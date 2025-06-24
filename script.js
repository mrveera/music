class LyricsPlayer {
    constructor() {
        this.audioFile = null;
        this.lyricsFile = null;
        this.lyrics = [];
        this.currentLineIndex = -1;
        this.autoScroll = true;
        this.audioPlayer = null;
        
        // Editor properties
        this.editorAudioFile = null;
        this.editorAudio = null;
        this.annotatedLyrics = [];
        this.currentLyricIndex = 0;
        
        // Word timing properties
        this.wordTiming = false;
        this.wordTimings = [];
        this.currentWordIndex = -1;
        
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
        this.toggleWordTimingBtn = document.getElementById('toggleWordTiming');
        this.scrollToTopBtn = document.getElementById('scrollToTop');
        
        // Tab navigation
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Editor elements
        this.editorAudioFileInput = document.getElementById('editorAudioFile');
        this.editorAudio = document.getElementById('editorAudio');
        this.editorAudioFileName = document.getElementById('editorAudioFileName');
        this.editorAudioPlayer = document.getElementById('editorAudioPlayer');
        this.lyricsTextarea = document.getElementById('lyricsTextarea');
        this.annotatedLyricsContainer = document.getElementById('annotatedLyricsContainer');
        this.editorCurrentTime = document.getElementById('editorCurrentTime');
        
        // Editor controls
        this.markTimeBtn = document.getElementById('markTimeBtn');
        this.playFromMarkBtn = document.getElementById('playFromMarkBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        
        // Export elements
        this.songTitleInput = document.getElementById('songTitle');
        this.artistNameInput = document.getElementById('artistName');
        this.exportLrcBtn = document.getElementById('exportLrcBtn');
        
        // Timing analysis elements
        this.timingInfo = document.getElementById('timingInfo');
        this.lineDuration = document.getElementById('lineDuration');
        this.wordsPerSecond = document.getElementById('wordsPerSecond');
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
        this.toggleWordTimingBtn.addEventListener('click', () => this.toggleWordTiming());
        this.scrollToTopBtn.addEventListener('click', () => this.scrollToTop());
        
        // Drag and drop events
        this.setupDragAndDrop();
        
        // Tab navigation events
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Editor events
        this.editorAudioFileInput.addEventListener('change', (e) => this.handleEditorAudioFileSelect(e));
        this.editorAudio.addEventListener('timeupdate', () => this.updateEditorTime());
        this.editorAudio.addEventListener('loadedmetadata', () => this.updateEditorAudioInfo());
        
        // Editor control events
        this.markTimeBtn.addEventListener('click', () => this.markCurrentTime());
        this.playFromMarkBtn.addEventListener('click', () => this.playFromMark());
        this.clearAllBtn.addEventListener('click', () => this.clearAllAnnotations());
        
        // Export events
        this.exportLrcBtn.addEventListener('click', () => this.exportLrcFile());
        
        // Lyrics textarea events
        this.lyricsTextarea.addEventListener('input', () => this.processLyricsInput());
    }

    switchTab(tabName) {
        // Update tab buttons
        this.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabName + 'Tab');
        });
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
                
                // Calculate word timings if word timing is enabled
                if (this.wordTiming) {
                    this.calculateWordTimings();
                }
                
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
            lineElement.dataset.index = index;
            lineElement.dataset.time = lyric.time;
            
            if (this.wordTiming) {
                // Split into words for word-by-word highlighting
                const words = lyric.text.split(' ');
                words.forEach((word, wordIndex) => {
                    const wordElement = document.createElement('span');
                    wordElement.className = 'word';
                    wordElement.textContent = word + ' ';
                    wordElement.dataset.lineIndex = index;
                    wordElement.dataset.wordIndex = wordIndex;
                    lineElement.appendChild(wordElement);
                });
            } else {
                lineElement.textContent = lyric.text;
            }
            
            this.lyricsContent.appendChild(lineElement);
        });
        
        // Initialize word display if word timing is enabled
        if (this.wordTiming) {
            this.updateWordDisplay();
        }
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
        this.updateWordTiming(currentTime);
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
            this.updateTimingAnalysis();
        }
    }

    updateLyricsDisplay() {
        const lines = this.lyricsContent.querySelectorAll('.lyrics-line');
        
        lines.forEach((line, index) => {
            line.classList.remove('active', 'past', 'future');
            
            if (index === this.currentLineIndex) {
                line.classList.add('active');
                if (this.autoScroll) {
                    this.scrollToLine(line);
                }
            } else if (index < this.currentLineIndex) {
                line.classList.add('past');
            } else {
                line.classList.add('future');
            }
        });
    }

    scrollToLine(lineElement) {
        const container = this.lyricsContent;
        const containerHeight = container.clientHeight;
        const lineTop = lineElement.offsetTop;
        const lineHeight = lineElement.offsetHeight;
        
        // Calculate the ideal scroll position to center the line
        const idealScrollTop = lineTop - (containerHeight / 2) + (lineHeight / 2);
        
        // Get current scroll position
        const currentScrollTop = container.scrollTop;
        const currentScrollBottom = currentScrollTop + containerHeight;
        
        // Check if the line is already visible
        const lineBottom = lineTop + lineHeight;
        const isLineVisible = lineTop >= currentScrollTop && lineBottom <= currentScrollBottom;
        
        // Only scroll if the line is not visible or if it's at the edges
        if (!isLineVisible || lineTop < currentScrollTop + 50 || lineBottom > currentScrollBottom - 50) {
            // Smooth scroll to the ideal position
            container.scrollTo({
                top: idealScrollTop,
                behavior: 'smooth'
            });
        }
    }

    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        this.toggleAutoScrollBtn.classList.toggle('active', this.autoScroll);
        this.toggleAutoScrollBtn.title = this.autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll';
        
        // Update button text for better clarity
        if (this.autoScroll) {
            this.toggleAutoScrollBtn.innerHTML = '📜 <span class="btn-text">Auto-scroll ON</span>';
        } else {
            this.toggleAutoScrollBtn.innerHTML = '📜 <span class="btn-text">Auto-scroll OFF</span>';
        }
        
        // If auto-scroll is enabled and there's an active line, scroll to it
        if (this.autoScroll && this.currentLineIndex >= 0) {
            const activeLine = this.lyricsContent.querySelector('.lyrics-line.active');
            if (activeLine) {
                this.scrollToLine(activeLine);
            }
        }
    }

    scrollToTop() {
        this.lyricsContent.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
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
                autoScroll: this.autoScroll,
                wordTiming: this.wordTiming
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
                this.wordTiming = session.wordTiming ?? false;
                
                this.toggleAutoScrollBtn.classList.toggle('active', this.autoScroll);
                this.toggleAutoScrollBtn.title = this.autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll';
                
                this.toggleWordTimingBtn.classList.toggle('active', this.wordTiming);
                this.toggleWordTimingBtn.title = this.wordTiming ? 'Disable word timing' : 'Enable word timing';
                
                // Initialize button text
                if (this.autoScroll) {
                    this.toggleAutoScrollBtn.innerHTML = '📜 <span class="btn-text">Auto-scroll ON</span>';
                } else {
                    this.toggleAutoScrollBtn.innerHTML = '📜 <span class="btn-text">Auto-scroll OFF</span>';
                }
                
                if (this.wordTiming) {
                    this.toggleWordTimingBtn.innerHTML = '🔤 <span class="btn-text">Word Timing ON</span>';
                } else {
                    this.toggleWordTimingBtn.innerHTML = '🔤 <span class="btn-text">Word Timing OFF</span>';
                }
            }
        } catch (error) {
            console.warn('Could not load from localStorage:', error);
        }
    }

    // Editor Methods
    handleEditorAudioFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadEditorAudioFile(file);
        }
    }

    loadEditorAudioFile(file) {
        if (!this.isAudioFile(file)) {
            this.showError('Please select a valid audio file (MP3, FLAC, or WAV)');
            return;
        }

        this.editorAudioFile = file;
        this.editorAudioFileName.textContent = file.name;
        
        const url = URL.createObjectURL(file);
        this.editorAudio.src = url;
        this.editorAudioPlayer.style.display = 'block';
    }

    updateEditorTime() {
        const currentTime = this.editorAudio.currentTime;
        this.editorCurrentTime.textContent = this.formatTime(currentTime);
    }

    updateEditorAudioInfo() {
        // Audio loaded, ready for annotation
    }

    processLyricsInput() {
        const text = this.lyricsTextarea.value;
        const lines = text.split('\n').filter(line => line.trim());
        
        // Reset annotated lyrics
        this.annotatedLyrics = lines.map((line, index) => ({
            index: index,
            text: line.trim(),
            time: null
        }));
        
        this.currentLyricIndex = 0;
        this.displayAnnotatedLyrics();
    }

    markCurrentTime() {
        if (this.annotatedLyrics.length === 0) {
            this.showError('Please enter lyrics first');
            return;
        }

        if (this.currentLyricIndex >= this.annotatedLyrics.length) {
            this.showError('All lyrics have been annotated');
            return;
        }

        const currentTime = this.editorAudio.currentTime;
        this.annotatedLyrics[this.currentLyricIndex].time = currentTime;
        
        this.currentLyricIndex++;
        this.displayAnnotatedLyrics();
        
        // Auto-advance to next line if there are more
        if (this.currentLyricIndex < this.annotatedLyrics.length) {
            this.lyricsTextarea.focus();
        }
    }

    playFromMark() {
        if (this.currentLyricIndex > 0 && this.currentLyricIndex <= this.annotatedLyrics.length) {
            const prevIndex = this.currentLyricIndex - 1;
            const time = this.annotatedLyrics[prevIndex].time;
            if (time !== null) {
                this.editorAudio.currentTime = time;
                this.editorAudio.play();
            }
        }
    }

    clearAllAnnotations() {
        this.annotatedLyrics = [];
        this.currentLyricIndex = 0;
        this.lyricsTextarea.value = '';
        this.displayAnnotatedLyrics();
    }

    displayAnnotatedLyrics() {
        this.annotatedLyricsContainer.innerHTML = '';
        
        if (this.annotatedLyrics.length === 0) {
            this.annotatedLyricsContainer.innerHTML = '<div class="lyrics-placeholder"><p>Start by entering lyrics and marking timestamps</p></div>';
            return;
        }
        
        this.annotatedLyrics.forEach((lyric, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'annotated-line';
            
            const timeElement = document.createElement('div');
            timeElement.className = 'line-time';
            timeElement.textContent = lyric.time !== null ? this.formatTime(lyric.time) : '--:--';
            
            const textElement = document.createElement('div');
            textElement.className = 'line-text';
            textElement.textContent = lyric.text;
            
            const actionsElement = document.createElement('div');
            actionsElement.className = 'line-actions';
            
            if (lyric.time !== null) {
                const playBtn = document.createElement('button');
                playBtn.className = 'line-action-btn';
                playBtn.textContent = '▶️';
                playBtn.title = 'Play from this line';
                playBtn.onclick = () => {
                    this.editorAudio.currentTime = lyric.time;
                    this.editorAudio.play();
                };
                actionsElement.appendChild(playBtn);
            }
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'line-action-btn delete';
            deleteBtn.textContent = '🗑️';
            deleteBtn.title = 'Delete this line';
            deleteBtn.onclick = () => this.deleteAnnotatedLine(index);
            actionsElement.appendChild(deleteBtn);
            
            lineElement.appendChild(timeElement);
            lineElement.appendChild(textElement);
            lineElement.appendChild(actionsElement);
            
            this.annotatedLyricsContainer.appendChild(lineElement);
        });
    }

    deleteAnnotatedLine(index) {
        this.annotatedLyrics.splice(index, 1);
        
        // Update indices
        this.annotatedLyrics.forEach((lyric, i) => {
            lyric.index = i;
        });
        
        // Adjust current index
        if (this.currentLyricIndex > index) {
            this.currentLyricIndex--;
        }
        
        this.displayAnnotatedLyrics();
        this.updateLyricsTextarea();
    }

    updateLyricsTextarea() {
        const text = this.annotatedLyrics.map(lyric => lyric.text).join('\n');
        this.lyricsTextarea.value = text;
    }

    exportLrcFile() {
        if (this.annotatedLyrics.length === 0) {
            this.showError('No lyrics to export');
            return;
        }

        const songTitle = this.songTitleInput.value.trim() || 'Unknown Song';
        const artistName = this.artistNameInput.value.trim() || 'Unknown Artist';
        
        let lrcContent = '';
        
        // Add metadata
        lrcContent += `[00:00.00]${songTitle}\n`;
        lrcContent += `[00:03.45]${artistName}\n`;
        lrcContent += `[00:07.20]\n`;
        
        // Add annotated lyrics
        this.annotatedLyrics.forEach(lyric => {
            if (lyric.time !== null) {
                const minutes = Math.floor(lyric.time / 60);
                const seconds = Math.floor(lyric.time % 60);
                const centiseconds = Math.floor((lyric.time % 1) * 100);
                
                const timestamp = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}]`;
                lrcContent += `${timestamp}${lyric.text}\n`;
            }
        });
        
        // Create and download file
        const blob = new Blob([lrcContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${songTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.lrc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showError('LRC file exported successfully!');
    }

    calculateWordTimings() {
        this.wordTimings = [];
        
        for (let i = 0; i < this.lyrics.length; i++) {
            const currentLine = this.lyrics[i];
            const nextLine = this.lyrics[i + 1];
            
            const lineStartTime = currentLine.time;
            const lineEndTime = nextLine ? nextLine.time : lineStartTime + 3; // Default 3 seconds if no next line
            
            const words = currentLine.text.split(' ');
            const wordCount = words.length;
            const timePerWord = (lineEndTime - lineStartTime) / wordCount;
            
            const lineWordTimings = words.map((word, wordIndex) => ({
                word: word,
                startTime: lineStartTime + (wordIndex * timePerWord),
                endTime: lineStartTime + ((wordIndex + 1) * timePerWord),
                lineIndex: i,
                wordIndex: wordIndex
            }));
            
            this.wordTimings.push(...lineWordTimings);
        }
    }

    toggleWordTiming() {
        this.wordTiming = !this.wordTiming;
        this.toggleWordTimingBtn.classList.toggle('active', this.wordTiming);
        this.toggleWordTimingBtn.title = this.wordTiming ? 'Disable word timing' : 'Enable word timing';
        
        // Update button text
        if (this.wordTiming) {
            this.toggleWordTimingBtn.innerHTML = '🔤 <span class="btn-text">Word Timing ON</span>';
            // Calculate word timings if lyrics are loaded
            if (this.lyrics.length > 0) {
                this.calculateWordTimings();
            }
        } else {
            this.toggleWordTimingBtn.innerHTML = '🔤 <span class="btn-text">Word Timing OFF</span>';
            this.currentWordIndex = -1;
        }
        
        // Refresh display
        this.displayLyrics();
    }

    updateWordTiming(currentTime) {
        if (!this.wordTiming || this.wordTimings.length === 0) return;
        
        let newWordIndex = -1;
        
        // Find the current word
        for (let i = 0; i < this.wordTimings.length; i++) {
            if (currentTime >= this.wordTimings[i].startTime && currentTime < this.wordTimings[i].endTime) {
                newWordIndex = i;
                break;
            }
        }
        
        // Update word index if changed
        if (newWordIndex !== this.currentWordIndex) {
            this.currentWordIndex = newWordIndex;
            this.updateWordDisplay();
        }
    }

    updateWordDisplay() {
        if (!this.wordTiming) return;
        
        const lines = this.lyricsContent.querySelectorAll('.lyrics-line');
        
        lines.forEach((line, lineIndex) => {
            const words = line.querySelectorAll('.word');
            words.forEach((word, wordIndex) => {
                word.classList.remove('current-word', 'past-word', 'future-word');
                
                if (this.currentWordIndex >= 0) {
                    const currentWord = this.wordTimings[this.currentWordIndex];
                    if (currentWord.lineIndex === lineIndex && currentWord.wordIndex === wordIndex) {
                        word.classList.add('current-word');
                    } else if (currentWord.lineIndex > lineIndex || 
                             (currentWord.lineIndex === lineIndex && currentWord.wordIndex > wordIndex)) {
                        word.classList.add('past-word');
                    } else {
                        word.classList.add('future-word');
                    }
                }
            });
        });
    }

    updateTimingAnalysis() {
        if (this.currentLineIndex >= 0 && this.currentLineIndex < this.lyrics.length) {
            const currentLine = this.lyrics[this.currentLineIndex];
            const nextLine = this.lyrics[this.currentLineIndex + 1];
            
            const lineStartTime = currentLine.time;
            const lineEndTime = nextLine ? nextLine.time : lineStartTime + 3;
            const lineDuration = lineEndTime - lineStartTime;
            
            const wordCount = currentLine.text.split(' ').length;
            const wordsPerSecond = wordCount / lineDuration;
            
            this.lineDuration.textContent = this.formatTime(lineDuration);
            this.wordsPerSecond.textContent = wordsPerSecond.toFixed(1);
            
            this.timingInfo.style.display = 'block';
        } else {
            this.timingInfo.style.display = 'none';
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
console.log('- Lyrics editor with annotation');
console.log('- LRC file generation'); 