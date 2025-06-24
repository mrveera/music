# 🎧 Offline Lyrics Player

A modern, browser-based music player that synchronizes local audio files with timestamped lyrics (.lrc files). Perfect for karaoke, language learning, or simply enjoying music with synchronized lyrics - all offline!

## ✨ Features

- **🎵 Local Audio Support**: MP3, FLAC, WAV files
- **📝 LRC Lyrics Sync**: Load and parse .lrc files with timestamps
- **🎯 Real-time Synchronization**: Lyrics highlight and scroll with audio playback
- **📱 Responsive Design**: Works on desktop and mobile browsers
- **🖱️ Drag & Drop**: Easy file upload with visual feedback
- **⚙️ Auto-scroll Toggle**: Enable/disable automatic lyrics scrolling
- **💾 Session Memory**: Remembers your preferences
- **🌙 Modern Dark Theme**: Beautiful gradient design with smooth animations

## 🚀 Quick Start

1. **Open the app**: Simply open `index.html` in your browser
2. **Load audio**: Click "Choose Audio File" or drag an MP3/FLAC/WAV file
3. **Load lyrics**: Click "Choose Lyrics File" or drag a .lrc file
4. **Enjoy**: Play your music with synchronized lyrics!

## 📁 File Formats

### Audio Files
- **MP3** (.mp3)
- **FLAC** (.flac) 
- **WAV** (.wav)

### Lyrics Files
- **LRC** (.lrc) - Standard timestamped lyrics format

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

- **Play/Pause**: Use the audio player controls
- **Seek**: Click on the progress bar or use audio controls
- **Auto-scroll**: Toggle the 📜 button to enable/disable automatic scrolling
- **Manual Scroll**: When auto-scroll is disabled, scroll manually through lyrics

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
- [ ] Manual lyrics sync editor
- [ ] Playlist support
- [ ] Album art from file metadata
- [ ] Export lyrics + sync map
- [ ] Keyboard shortcuts
- [ ] Multiple language support
- [ ] Lyrics search functionality

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

---

**Enjoy your music with synchronized lyrics! 🎧✨** 