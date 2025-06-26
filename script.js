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
        
        // Video-like player elements
        this.currentLineDisplay = document.getElementById('currentLineDisplay');
        this.currentLineText = document.getElementById('currentLineText');
        this.lineProgressFill = document.getElementById('lineProgressFill');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.videoProgressFill = document.getElementById('videoProgressFill');
        this.videoProgressHandle = document.getElementById('videoProgressHandle');
        this.videoCurrentTime = document.getElementById('videoCurrentTime');
        this.videoTotalTime = document.getElementById('videoTotalTime');
        this.videoPlayerContainer = document.querySelector('.video-player-container');
        this.videoProgressBar = document.querySelector('.video-progress-bar');
        
        // Debug: Check if elements are found
        console.log('Element initialization check:', {
            currentLineDisplay: !!this.currentLineDisplay,
            currentLineText: !!this.currentLineText,
            lineProgressFill: !!this.lineProgressFill,
            playPauseBtn: !!this.playPauseBtn,
            fullscreenBtn: !!this.fullscreenBtn,
            videoProgressFill: !!this.videoProgressFill,
            videoProgressHandle: !!this.videoProgressHandle,
            videoCurrentTime: !!this.videoCurrentTime,
            videoTotalTime: !!this.videoTotalTime,
            videoPlayerContainer: !!this.videoPlayerContainer,
            videoProgressBar: !!this.videoProgressBar
        });
        
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
        this.audioPlayer.addEventListener('play', () => this.handlePlayStart());
        
        // Video-like player control events
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.videoProgressBar.addEventListener('click', (e) => this.seekToPosition(e));
        this.videoProgressHandle.addEventListener('mousedown', (e) => this.startDragging(e));
        
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
        
        // Global mouse events for dragging
        document.addEventListener('mousemove', (e) => this.handleDragging(e));
        document.addEventListener('mouseup', () => this.stopDragging());
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
        console.log('Loading lyrics file:', file.name);
        
        if (!this.isLyricsFile(file)) {
            this.showError('Please select a valid .lrc file');
            return;
        }

        this.lyricsFile = file;
        this.lyricsFileName.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                console.log('Parsing lyrics content...');
                this.lyrics = this.parseLRC(e.target.result);
                console.log('Parsed lyrics:', this.lyrics.length, 'lines');
                
                // Ensure elements are properly initialized before displaying
                this.ensureElementsInitialized();
                
                this.displayLyrics();
                
                // Calculate word timings if word timing is enabled
                if (this.wordTiming) {
                    this.calculateWordTimings();
                }
                
                this.saveToStorage();
                this.checkFilesLoaded();
            } catch (error) {
                console.error('Error parsing lyrics:', error);
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
        console.log('displayLyrics called, lyrics count:', this.lyrics.length);
        
        this.lyricsContent.innerHTML = '';
        
        if (this.lyrics.length === 0) {
            console.log('No lyrics to display');
            this.lyricsContent.innerHTML = '<div class="lyrics-placeholder"><p>Load a .lrc file to see synchronized lyrics</p></div>';
            this.currentLineText.textContent = 'Load audio and lyrics to start';
            return;
        }
        
        console.log('Displaying lyrics lines...');
        this.lyrics.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'lyrics-line';
            lineElement.dataset.index = index;
            
            if (this.wordTiming && line.words) {
                lineElement.innerHTML = line.words.map(word => 
                    `<span class="word" data-time="${word.time}">${word.text}</span>`
                ).join(' ');
            } else {
                lineElement.textContent = line.text;
            }
            
            this.lyricsContent.appendChild(lineElement);
        });
        
        // Initialize current line display
        console.log('Initializing current line display...');
        this.updateCurrentLineDisplay();
        
        // Show timing info if word timing is available
        if (this.wordTiming && this.lyrics.some(line => line.words)) {
            this.timingInfo.style.display = 'block';
            this.updateTimingAnalysis();
        } else {
            this.timingInfo.style.display = 'none';
        }
    }

    updateProgress() {
        if (this.audioPlayer && this.audioPlayer.duration) {
            const currentTime = this.audioPlayer.currentTime;
            const duration = this.audioPlayer.duration;
            const progress = (currentTime / duration) * 100;
            
            // Update video progress bar
            if (this.videoProgressFill) {
                this.videoProgressFill.style.width = progress + '%';
            }
            if (this.videoProgressHandle) {
                this.videoProgressHandle.style.left = progress + '%';
            }
            
            // Update time displays
            if (this.videoCurrentTime) {
                this.videoCurrentTime.textContent = this.formatTime(currentTime);
            }
            if (this.currentTimeSpan) {
                this.currentTimeSpan.textContent = this.formatTime(currentTime);
            }
            
            // Update lyrics sync
            this.updateLyricsSync(currentTime);
        }
    }

    updateTrackInfo() {
        if (this.audioPlayer && this.audioPlayer.duration) {
            const duration = this.audioPlayer.duration;
            if (this.videoTotalTime) {
                this.videoTotalTime.textContent = this.formatTime(duration);
            }
            if (this.totalTimeSpan) {
                this.totalTimeSpan.textContent = this.formatTime(duration);
            }
            if (this.trackDuration) {
                this.trackDuration.textContent = `${this.formatTime(0)} / ${this.formatTime(duration)}`;
            }
        }
    }

    updateLyricsSync(currentTime) {
        let newLineIndex = -1;
        
        // Find the current line based on time
        for (let i = 0; i < this.lyrics.length; i++) {
            const line = this.lyrics[i];
            const nextLine = this.lyrics[i + 1];
            
            if (currentTime >= line.time && (!nextLine || currentTime < nextLine.time)) {
                newLineIndex = i;
                break;
            }
        }
        
        // If no line is found but we have lyrics and audio is playing, show the first line
        if (newLineIndex === -1 && this.lyrics.length > 0 && currentTime > 0) {
            // Find the next line that should appear
            for (let i = 0; i < this.lyrics.length; i++) {
                if (currentTime < this.lyrics[i].time) {
                    newLineIndex = Math.max(0, i - 1); // Show the previous line or first line
                    break;
                }
            }
            // If we're past all lines, show the last line
            if (newLineIndex === -1) {
                newLineIndex = this.lyrics.length - 1;
            }
        }
        
        // Update current line index
        if (newLineIndex !== this.currentLineIndex) {
            this.currentLineIndex = newLineIndex;
            this.updateLyricsDisplay();
            this.updateCurrentLineDisplay();
        }
        
        // Update line progress if we have a current line
        if (this.currentLineIndex >= 0 && this.currentLineIndex < this.lyrics.length) {
            const currentLine = this.lyrics[this.currentLineIndex];
            const nextLine = this.lyrics[this.currentLineIndex + 1];
            
            if (nextLine && this.lineProgressFill) {
                const lineDuration = nextLine.time - currentLine.time;
                const lineProgress = (currentTime - currentLine.time) / lineDuration;
                this.lineProgressFill.style.width = Math.max(0, Math.min(100, lineProgress * 100)) + '%';
            } else if (this.lineProgressFill) {
                // Last line - show full progress
                this.lineProgressFill.style.width = '100%';
            }
        }
        
        // Update word timing if enabled
        if (this.wordTiming) {
            this.updateWordTiming(currentTime);
        }
    }

    updateCurrentLineDisplay() {
        console.log('updateCurrentLineDisplay called:', {
            currentLineIndex: this.currentLineIndex,
            lyricsLength: this.lyrics.length,
            hasLyrics: this.lyrics.length > 0,
            currentLineText: !!this.currentLineText,
            lineProgressFill: !!this.lineProgressFill
        });
        
        if (!this.currentLineText) {
            console.error('currentLineText element not found!');
            return;
        }
        
        if (this.currentLineIndex >= 0 && this.currentLineIndex < this.lyrics.length) {
            const currentLine = this.lyrics[this.currentLineIndex];
            console.log('Setting current line text:', currentLine.text);
            this.currentLineText.textContent = currentLine.text;
            
            // Add animation class for smooth transition
            if (this.currentLineDisplay) {
                this.currentLineDisplay.classList.add('fade-in');
                setTimeout(() => {
                    if (this.currentLineDisplay) {
                        this.currentLineDisplay.classList.remove('fade-in');
                    }
                }, 300);
            }
        } else if (this.lyrics.length > 0) {
            // Show first line if lyrics are loaded but no line is currently active
            console.log('Showing first line:', this.lyrics[0].text);
            this.currentLineText.textContent = this.lyrics[0].text;
            if (this.lineProgressFill) {
                this.lineProgressFill.style.width = '0%';
            }
        } else {
            console.log('No lyrics loaded, showing default message');
            this.currentLineText.textContent = 'Load audio and lyrics to start';
            if (this.lineProgressFill) {
                this.lineProgressFill.style.width = '0%';
            }
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
        this.updateCurrentLineDisplay();
    }

    handlePlayStart() {
        // When audio starts playing, ensure we show the first line if no line is currently active
        if (this.lyrics.length > 0 && this.currentLineIndex === -1) {
            this.currentLineIndex = 0;
            this.updateLyricsDisplay();
            this.updateCurrentLineDisplay();
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    checkFilesLoaded() {
        if (this.audioFile && this.lyricsFile) {
            if (this.uploadSection) this.uploadSection.style.display = 'none';
            if (this.playerSection) this.playerSection.style.display = 'block';
            if (this.fileInfo) this.fileInfo.style.display = 'block';
            
            // Re-initialize elements after the player section becomes visible
            setTimeout(() => {
                this.ensureElementsInitialized();
                
                // Initialize the video display with the first line
                if (this.lyrics.length > 0) {
                    this.updateCurrentLineDisplay();
                }
            }, 100);
        } else {
            if (this.uploadSection) this.uploadSection.style.display = 'block';
            if (this.playerSection) this.playerSection.style.display = 'none';
            if (this.fileInfo) this.fileInfo.style.display = 'none';
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
        if (this.currentLineIndex >= 0 && this.currentLineIndex < this.lyrics.length) {
            const currentLine = this.lyrics[this.currentLineIndex];
            
            if (currentLine.words) {
                let newWordIndex = -1;
                
                for (let i = 0; i < currentLine.words.length; i++) {
                    const word = currentLine.words[i];
                    const nextWord = currentLine.words[i + 1];
                    
                    if (currentTime >= word.time && (!nextWord || currentTime < nextWord.time)) {
                        newWordIndex = i;
                        break;
                    }
                }
                
                if (newWordIndex !== this.currentWordIndex) {
                    this.currentWordIndex = newWordIndex;
                    this.updateWordDisplay();
                }
            }
        }
    }

    updateWordDisplay() {
        const wordElements = this.lyricsContent.querySelectorAll('.word');
        
        wordElements.forEach((wordElement, index) => {
            wordElement.classList.remove('current-word', 'past-word', 'future-word');
            
            if (this.currentLineIndex >= 0 && this.currentLineIndex < this.lyrics.length) {
                const currentLine = this.lyrics[this.currentLineIndex];
                
                if (currentLine.words) {
                    const wordTime = parseFloat(wordElement.dataset.time);
                    const currentTime = this.audioPlayer.currentTime;
                    
                    if (Math.abs(wordTime - currentTime) < 0.1) {
                        wordElement.classList.add('current-word');
                    } else if (wordTime < currentTime) {
                        wordElement.classList.add('past-word');
                    } else {
                        wordElement.classList.add('future-word');
                    }
                }
            }
        });
    }

    updateTimingAnalysis() {
        if (this.currentLineIndex >= 0 && this.currentLineIndex < this.lyrics.length) {
            const currentLine = this.lyrics[this.currentLineIndex];
            const nextLine = this.lyrics[this.currentLineIndex + 1];
            
            if (nextLine) {
                const lineDuration = nextLine.time - currentLine.time;
                this.lineDuration.textContent = this.formatTime(lineDuration);
                
                if (currentLine.words && currentLine.words.length > 0) {
                    const wordsPerSecond = currentLine.words.length / lineDuration;
                    this.wordsPerSecond.textContent = wordsPerSecond.toFixed(1);
                } else {
                    this.wordsPerSecond.textContent = '--';
                }
            } else {
                this.lineDuration.textContent = '--';
                this.wordsPerSecond.textContent = '--';
            }
        }
    }

    togglePlayPause() {
        if (!this.audioPlayer) {
            console.error('Audio player not found');
            return;
        }
        
        if (this.audioPlayer.paused) {
            this.audioPlayer.play();
            if (this.playPauseBtn) {
                this.playPauseBtn.querySelector('.control-icon').textContent = '⏸️';
            }
        } else {
            this.audioPlayer.pause();
            if (this.playPauseBtn) {
                this.playPauseBtn.querySelector('.control-icon').textContent = '▶️';
            }
        }
    }

    toggleFullscreen() {
        if (!this.videoPlayerContainer) {
            console.error('Video player container not found');
            return;
        }
        
        if (!document.fullscreenElement) {
            this.videoPlayerContainer.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
            this.videoPlayerContainer.classList.add('fullscreen');
        } else {
            document.exitFullscreen();
            this.videoPlayerContainer.classList.remove('fullscreen');
        }
    }

    seekToPosition(event) {
        if (!this.videoProgressBar || !this.audioPlayer) {
            console.error('Video progress bar or audio player not found');
            return;
        }
        
        const rect = this.videoProgressBar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const progress = (clickX / rect.width) * 100;
        const newTime = (progress / 100) * this.audioPlayer.duration;
        
        this.audioPlayer.currentTime = newTime;
    }

    startDragging(event) {
        event.preventDefault();
        this.isDragging = true;
        this.videoProgressHandle.style.cursor = 'grabbing';
    }

    handleDragging(event) {
        if (this.isDragging) {
            const rect = this.videoProgressBar.getBoundingClientRect();
            let clickX = event.clientX - rect.left;
            clickX = Math.max(0, Math.min(clickX, rect.width));
            
            const progress = (clickX / rect.width) * 100;
            const newTime = (progress / 100) * this.audioPlayer.duration;
            
            this.audioPlayer.currentTime = newTime;
        }
    }

    stopDragging() {
        this.isDragging = false;
        this.videoProgressHandle.style.cursor = 'grab';
    }

    ensureElementsInitialized() {
        // Re-get all video player elements to ensure they're available
        this.currentLineDisplay = document.getElementById('currentLineDisplay');
        this.currentLineText = document.getElementById('currentLineText');
        this.lineProgressFill = document.getElementById('lineProgressFill');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.videoProgressFill = document.getElementById('videoProgressFill');
        this.videoProgressHandle = document.getElementById('videoProgressHandle');
        this.videoCurrentTime = document.getElementById('videoCurrentTime');
        this.videoTotalTime = document.getElementById('videoTotalTime');
        this.videoPlayerContainer = document.querySelector('.video-player-container');
        this.videoProgressBar = document.querySelector('.video-progress-bar');
        
        console.log('Elements re-initialized:', {
            currentLineDisplay: !!this.currentLineDisplay,
            currentLineText: !!this.currentLineText,
            lineProgressFill: !!this.lineProgressFill,
            playPauseBtn: !!this.playPauseBtn,
            fullscreenBtn: !!this.fullscreenBtn,
            videoProgressFill: !!this.videoProgressFill,
            videoProgressHandle: !!this.videoProgressHandle,
            videoCurrentTime: !!this.videoCurrentTime,
            videoTotalTime: !!this.videoTotalTime,
            videoPlayerContainer: !!this.videoPlayerContainer,
            videoProgressBar: !!this.videoProgressBar
        });
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