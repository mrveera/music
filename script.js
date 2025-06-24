class LyricsPlayer {
    constructor() {
        this.audioFile = null;
        this.lyricsFile = null;
        this.lyrics = [];
        this.currentLineIndex = -1;
        this.autoScroll = true;
        this.audioPlayer = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadFromStorage();
    }

    initializeElements() {
        // File inputs
        this.audioFileInput = document.getElementById('audioFile');
        this.lyricsFileInput = document.getElementById('lyricsFile');
        
        // Display elements
        this.uploadSection = document.getElementById('uploadSection');
        this.playerSection = document.getElementById('playerSection');
        this.fileInfo = document.getElementById('fileInfo');
        this.audioFileName = document.getElementById('audioFileName');
        this.lyricsFileName = document.getElementById('lyricsFileName');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Audio player elements
        this.audioPlayer = document.getElementById('audioPlayer');
        this.trackTitle = document.getElementById('trackTitle');
        this.trackDuration = document.getElementById('trackDuration');
        this.currentTimeSpan = document.getElementById('currentTime');
        this.totalTimeSpan = document.getElementById('totalTime');
        this.progressFill = document.getElementById('progressFill');
        
        // Lyrics elements
        this.lyricsContent = document.getElementById('lyricsContent');
        this.toggleAutoScrollBtn = document.getElementById('toggleAutoScroll');
    }

    bindEvents() {
        // File upload events
        this.audioFileInput.addEventListener('change', (e) => this.handleAudioFileSelect(e));
        this.lyricsFileInput.addEventListener('change', (e) => this.handleLyricsFileSelect(e));
        
        // Audio player events
        this.audioPlayer.addEventListener('timeupdate', () => this.updateProgress());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateTrackInfo());
        this.audioPlayer.addEventListener('ended', () => this.handlePlaybackEnd());
        
        // Lyrics control events
        this.toggleAutoScrollBtn.addEventListener('click', () => this.toggleAutoScroll());
        
        // Drag and drop events
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const audioBox = document.getElementById('audioUploadBox');
        const lyricsBox = document.getElementById('lyricsUploadBox');

        [audioBox, lyricsBox].forEach(box => {
            box.addEventListener('dragover', (e) => {
                e.preventDefault();
                box.classList.add('dragover');
            });

            box.addEventListener('dragleave', () => {
                box.classList.remove('dragover');
            });

            box.addEventListener('drop', (e) => {
                e.preventDefault();
                box.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const file = files[0];
                    if (box === audioBox && this.isAudioFile(file)) {
                        this.loadAudioFile(file);
                    } else if (box === lyricsBox && this.isLyricsFile(file)) {
                        this.loadLyricsFile(file);
                    }
                }
            });
        });
    }

    isAudioFile(file) {
        return ['audio/mp3', 'audio/mpeg', 'audio/flac', 'audio/wav'].includes(file.type) ||
               file.name.match(/\.(mp3|flac|wav)$/i);
    }

    isLyricsFile(file) {
        return file.name.toLowerCase().endsWith('.lrc');
    }

    handleAudioFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadAudioFile(file);
        }
    }

    handleLyricsFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadLyricsFile(file);
        }
    }

    loadAudioFile(file) {
        if (!this.isAudioFile(file)) {
            this.showError('Please select a valid audio file (MP3, FLAC, or WAV)');
            return;
        }

        this.audioFile = file;
        this.audioFileName.textContent = file.name;
        this.trackTitle.textContent = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
        
        const url = URL.createObjectURL(file);
        this.audioPlayer.src = url;
        
        this.saveToStorage();
        this.checkFilesLoaded();
    }

    loadLyricsFile(file) {
        if (!this.isLyricsFile(file)) {
            this.showError('Please select a valid .lrc file');
            return;
        }

        this.lyricsFile = file;
        this.lyricsFileName.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.lyrics = this.parseLRC(e.target.result);
                this.displayLyrics();
                this.saveToStorage();
                this.checkFilesLoaded();
            } catch (error) {
                this.showError('Error parsing lyrics file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    parseLRC(lrcContent) {
        const lines = lrcContent.split('\n');
        const lyrics = [];
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            // Match timestamp format [mm:ss.xx] or [mm:ss:xx]
            const timestampMatch = trimmedLine.match(/\[(\d{2}):(\d{2})[.:](\d{2})\]/);
            if (timestampMatch) {
                const minutes = parseInt(timestampMatch[1]);
                const seconds = parseInt(timestampMatch[2]);
                const centiseconds = parseInt(timestampMatch[3]);
                
                const timeInSeconds = minutes * 60 + seconds + centiseconds / 100;
                const text = trimmedLine.replace(/\[.*?\]/g, '').trim();
                
                if (text) {
                    lyrics.push({
                        time: timeInSeconds,
                        text: text
                    });
                }
            }
        }
        
        // Sort by timestamp
        lyrics.sort((a, b) => a.time - b.time);
        
        if (lyrics.length === 0) {
            throw new Error('No valid lyrics found in the file');
        }
        
        return lyrics;
    }

    displayLyrics() {
        this.lyricsContent.innerHTML = '';
        
        if (this.lyrics.length === 0) {
            this.lyricsContent.innerHTML = '<div class="lyrics-placeholder"><p>No lyrics loaded</p></div>';
            return;
        }
        
        this.lyrics.forEach((lyric, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'lyrics-line';
            lineElement.textContent = lyric.text;
            lineElement.dataset.index = index;
            lineElement.dataset.time = lyric.time;
            this.lyricsContent.appendChild(lineElement);
        });
    }

    updateProgress() {
        const currentTime = this.audioPlayer.currentTime;
        const duration = this.audioPlayer.duration;
        
        if (duration) {
            const progress = (currentTime / duration) * 100;
            this.progressFill.style.width = progress + '%';
        }
        
        this.currentTimeSpan.textContent = this.formatTime(currentTime);
        this.updateLyricsSync(currentTime);
    }

    updateTrackInfo() {
        const duration = this.audioPlayer.duration;
        this.totalTimeSpan.textContent = this.formatTime(duration);
        this.trackDuration.textContent = `${this.formatTime(0)} / ${this.formatTime(duration)}`;
    }

    updateLyricsSync(currentTime) {
        let activeIndex = -1;
        
        // Find the current line
        for (let i = 0; i < this.lyrics.length; i++) {
            if (currentTime >= this.lyrics[i].time) {
                activeIndex = i;
            } else {
                break;
            }
        }
        
        // Update active line
        if (activeIndex !== this.currentLineIndex) {
            this.currentLineIndex = activeIndex;
            this.updateLyricsDisplay();
        }
    }

    updateLyricsDisplay() {
        const lines = this.lyricsContent.querySelectorAll('.lyrics-line');
        
        lines.forEach((line, index) => {
            line.classList.remove('active', 'past');
            
            if (index === this.currentLineIndex) {
                line.classList.add('active');
                if (this.autoScroll) {
                    this.scrollToLine(line);
                }
            } else if (index < this.currentLineIndex) {
                line.classList.add('past');
            }
        });
    }

    scrollToLine(lineElement) {
        const container = this.lyricsContent;
        const containerHeight = container.clientHeight;
        const lineTop = lineElement.offsetTop;
        const lineHeight = lineElement.offsetHeight;
        
        const scrollTop = lineTop - (containerHeight / 2) + (lineHeight / 2);
        container.scrollTop = scrollTop;
    }

    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        this.toggleAutoScrollBtn.classList.toggle('active', this.autoScroll);
        this.toggleAutoScrollBtn.title = this.autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll';
    }

    handlePlaybackEnd() {
        this.currentLineIndex = -1;
        this.updateLyricsDisplay();
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    checkFilesLoaded() {
        if (this.audioFile && this.lyricsFile) {
            this.uploadSection.style.display = 'none';
            this.playerSection.style.display = 'block';
            this.fileInfo.style.display = 'block';
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        
        setTimeout(() => {
            this.errorMessage.style.display = 'none';
        }, 5000);
    }

    saveToStorage() {
        try {
            const session = {
                audioFileName: this.audioFile?.name || '',
                lyricsFileName: this.lyricsFile?.name || '',
                autoScroll: this.autoScroll
            };
            localStorage.setItem('lyricsPlayerSession', JSON.stringify(session));
        } catch (error) {
            console.warn('Could not save to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const session = JSON.parse(localStorage.getItem('lyricsPlayerSession'));
            if (session) {
                this.autoScroll = session.autoScroll ?? true;
                this.toggleAutoScrollBtn.classList.toggle('active', this.autoScroll);
                this.toggleAutoScrollBtn.title = this.autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll';
            }
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LyricsPlayer();
});

// Add some helpful console messages
console.log('🎧 Offline Lyrics Player loaded!');
console.log('Features:');
console.log('- Load local audio files (MP3, FLAC, WAV)');
console.log('- Load .lrc lyrics files');
console.log('- Synchronized lyrics display');
console.log('- Auto-scroll with toggle');
console.log('- Responsive design');
console.log('- Drag and drop support'); 