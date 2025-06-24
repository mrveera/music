# 🎧 Offline Lyrics Player

A modern, browser-based music player that synchronizes local audio files with timestamped lyrics (.lrc files). Perfect for karaoke, language learning, or simply enjoying music with synchronized lyrics - all offline!

## ✨ Features

- **🎵 Local Audio Support**: MP3, FLAC, WAV files
- **📝 LRC Lyrics Sync**: Load and parse .lrc files with timestamps
- **🎯 Real-time Synchronization**: Lyrics highlight and scroll with audio playback
- **✏️ Lyrics Editor**: Create and annotate lyrics with timestamps to generate .lrc files
- **📱 Responsive Design**: Works on desktop and mobile browsers
- **🖱️ Drag & Drop**: Easy file upload with visual feedback
- **⚙️ Auto-scroll Toggle**: Enable/disable automatic lyrics scrolling
- **💾 Session Memory**: Remembers your preferences
- **🌙 Modern Dark Theme**: Beautiful gradient design with smooth animations

## 🚀 Quick Start

1. **Open the app**: Simply open `index.html` in your browser
2. **Choose your mode**:
   - **Player Tab**: Load existing audio and .lrc files for playback
   - **Editor Tab**: Create new .lrc files from scratch
3. **Enjoy**: Play your music with synchronized lyrics!

## 📁 File Formats

### Audio Files
- **MP3** (.mp3)
- **FLAC** (.flac) 
- **WAV** (.wav)

### Lyrics Files
- **LRC** (.lrc) - Standard timestamped lyrics format

## 🎵 Player Mode

### How to Use the Player
1. **Load audio**: Click "Choose Audio File" or drag an MP3/FLAC/WAV file
2. **Load lyrics**: Click "Choose Lyrics File" or drag a .lrc file
3. **Play**: Use the audio controls to start playback
4. **Enjoy**: Watch the lyrics sync with your music!

## ✏️ Editor Mode

### How to Create LRC Files
1. **Switch to Editor Tab**: Click the "Lyrics Editor" tab
2. **Load Audio (Optional)**: Load an audio file to help with timing
3. **Enter Lyrics**: Type your lyrics in the text area (one line per verse)
4. **Mark Timestamps**: 
   - Play the audio and click "Mark Current Time" when each line should appear
   - Use "Play from Mark" to review previous timestamps
5. **Export**: Add song title and artist name, then click "Export .lrc File"

### Editor Features
- **Real-time Timing**: Mark exact timestamps while listening to audio
- **Visual Feedback**: See all annotated lines with their timestamps
- **Playback Controls**: Test your annotations by playing from any marked line
- **Edit & Delete**: Remove or modify any annotated line
- **Auto-advance**: Automatically moves to the next line after marking
- **Export**: Generate standard .lrc files ready for use

## 📝 LRC File Format

LRC files contain lyrics with timestamps in the format `[mm:ss.xx]`:

```
[00:00.00]Song Title
[00:03.45]Artist Name
[00:07.20]
[00:10.15]First line of lyrics
[00:13.80]Second line of lyrics
[00:17.25]Third line of lyrics
```

### Sample LRC File
```lrc
[00:00.00]Sample Song
[00:03.45]Sample Artist
[00:07.20]
[00:10.15]This is the first line of the song
[00:13.80]And this is the second line
[00:17.25]The lyrics will sync with the music
[00:21.10]As the song continues to play
```

## 🎮 Controls

### Player Controls
- **Play/Pause**: Use the audio player controls
- **Seek**: Click on the progress bar or use audio controls
- **Auto-scroll**: Toggle the 📜 button to enable/disable automatic scrolling
- **Manual Scroll**: When auto-scroll is disabled, scroll manually through lyrics

### Editor Controls
- **Mark Current Time**: ⏱️ Mark the current audio position for the next lyric line
- **Play from Mark**: ▶️ Play audio from the last marked timestamp
- **Clear All**: 🗑️ Reset all annotations and start over
- **Export**: 💾 Generate and download the .lrc file

## 🛠️ Technical Details

- **No Backend Required**: Pure frontend application
- **Offline First**: All processing happens in the browser
- **Local Storage**: Settings are saved locally
- **Modern JavaScript**: ES6+ features with class-based architecture
- **Responsive CSS**: Flexbox and Grid layouts with media queries

## 🌐 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest) 
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📱 Mobile Support

The app is fully responsive and works great on mobile devices:
- Touch-friendly interface
- Optimized layouts for small screens
- Smooth scrolling on touch devices
- Tab navigation adapts to mobile layout

## 🔧 Development

To run locally:

```bash
# Clone or download the files
# Open index.html in your browser
# Or use a local server:

# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# Then visit http://localhost:8000
```

## 📋 To-Do & Future Features

### Planned Enhancements
- [ ] Manual lyrics sync editor for existing files
- [ ] Playlist support
- [ ] Album art from file metadata
- [ ] Remember last session with files
- [ ] Export lyrics + sync map in other formats
- [ ] Keyboard shortcuts for editor
- [ ] Multiple language support
- [ ] Lyrics search functionality
- [ ] Batch processing for multiple files

### Completed ✅
- [x] Audio file loading (MP3, FLAC, WAV)
- [x] LRC file parsing and validation
- [x] Synchronized lyrics display
- [x] Real-time highlighting and scrolling
- [x] Responsive design
- [x] Drag and drop support
- [x] Auto-scroll toggle
- [x] Session memory
- [x] Error handling
- [x] Modern UI/UX
- [x] **Lyrics editor with annotation**
- [x] **LRC file generation**
- [x] **Tab navigation system**
- [x] **Real-time timing controls**

## 🤝 Contributing

Feel free to contribute by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## 📄 License

This project is open source and available under the MIT License.

## 🎵 Sample Files

For testing, you can use any MP3/FLAC/WAV file with a corresponding .lrc file. The app will automatically sync the lyrics with your audio playback.

### Testing the Editor
1. Use the included `sample-song.lrc` file in Player mode
2. Or create your own .lrc file using the Editor mode
3. Load any audio file and start annotating!

---

**Enjoy your music with synchronized lyrics! 🎧✨** 