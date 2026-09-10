# LUMEN — The Theater of Light

A cinematic, single-page concept site for LUMEN, an immersive light-and-sound theater experience. Built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

![status](https://img.shields.io/badge/status-concept-e8ff57) ![license](https://img.shields.io/badge/license-MIT-8a7cff) ![stack](https://img.shields.io/badge/stack-HTML%2FCSS%2FJS-070709)

## ✨ Features

- Full-screen video hero with animated percentage loader
- Custom cursor, scroll-driven parallax, and marquee sections
- Interactive "Realms" tabs synced to background video
- Auto-playing system/feature carousel
- Draggable news/press strip
- Ambient background audio with a mute toggle (press **M** to toggle)
- Contact/film-request modal
- Fully responsive, no external JS frameworks

## 🗂️ Project Structure

```
Lumen/
├── index.html          # Page markup
├── css/
│   └── style.css        # All styling
├── js/
│   └── main.js           # All interactivity (loader, scroll, carousels, audio)
├── assets/
│   ├── video/            # Background/hero video loops
│   │   ├── hero.mp4
│   │   └── ambient.mp4
│   └── audio/             # UI sounds, voiceover, ambient drone
│       ├── ambient_drone.wav
│       ├── ui_click.wav
│       ├── ui_hover.wav
│       ├── ui_open.wav
│       ├── voice_hero.mp3
│       └── voice_manifesto.mp3
├── LICENSE
├── .gitignore
├── README.md
└── PUBLISHING_GUIDE.md   # Step-by-step guide to publish this on GitHub Pages
```

## 🚀 Running locally

Because the page loads video/audio via relative paths, open it through a local server rather than double-clicking the file (some browsers block media loaded via `file://`).

**Option A — VS Code:** install the "Live Server" extension, right-click `index.html`, choose **Open with Live Server**.

**Option B — Python (no install needed if Python is present):**

```bash
cd Lumen
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

**Option C — Node:**

```bash
npx serve .
```

## 🛠️ Customizing

- **Colors & fonts:** edit the CSS variables at the top of `css/style.css` (`--bg`, `--fg`, `--accent`, etc.) and the Google Fonts `<link>` in `index.html`.
- **Copy/content:** edit the text directly inside `index.html`.
- **Media:** swap files in `assets/video/` and `assets/audio/`, keeping the same filenames (or update the `<source>` paths in `index.html` to match new filenames).

## ⚠️ Note on file sizes

The `assets/video/` files are fairly large (~19–24 MB each). This is fine for GitHub (well under its 100 MB per-file limit) but keep it in mind if you plan to add many more media files — consider compressing video (e.g. with `ffmpeg` or HandBrake) or using [Git LFS](https://git-lfs.com/) for very large binary assets long-term.

## 📄 License

MIT — see [LICENSE](./LICENSE). Note: the MIT license covers the code (HTML/CSS/JS) in this repo. If the video, audio, and font assets are not your own original work, confirm you have the right to publish and redistribute them before making the repo public.
