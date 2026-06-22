# 📸 SnapBooth — Modern Korean Photo Booth

> A beautiful, zero-dependency photo booth web app inspired by Life4Cuts & Photoism.  
> Works entirely in the browser — no server, no install, no build step required.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-c084fc?style=flat-square&logo=github)](https://YOUR-USERNAME.github.io/snapbooth/)

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🎞 **Strip Modes** | Single · Double · Triple · Classic Strip (4 photos) |
| 🖼 **30+ Frames** | Minimalist · Pastel · Korean Style · Birthday · Romantic · Neon · Anime · Graduation · Friendship · Eid |
| 🎨 **8 Filters** | Original · Vintage · Retro · Warm · Cool · B&W · Soft Glow · Vivid |
| ⏱ **Countdown** | 3s / 5s / 10s auto-countdown |
| ⚡ **Flash Effect** | White flash animation on capture |
| ✏️ **Custom Caption** | Add your own text / date / quote to the strip |
| 💾 **Gallery** | All sessions saved in-browser (session memory) |
| 📥 **Download** | Exports composite PNG strip with frame + filter baked in |
| 🔄 **Camera Switch** | Front / back camera toggle |

---

## 🚀 Deploy to GitHub Pages (3 steps)

### Option A — Upload directly
1. Create a new GitHub repository (e.g. `snapbooth`)
2. Upload `index.html` to the root of the repo
3. Go to **Settings → Pages → Source: main branch / root** → Save  
   Your app is live at `https://YOUR-USERNAME.github.io/snapbooth/`

### Option B — Git CLI
```bash
git init
git add index.html README.md
git commit -m "🎞 Initial SnapBooth"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/snapbooth.git
git push -u origin main
# Then enable Pages in repo Settings
```

---

## 🛠 Tech Stack

- **React 18** — via CDN (unpkg), no npm needed  
- **Babel Standalone** — compiles JSX in the browser  
- **HTML5 Camera API** — `getUserMedia` for live video  
- **Canvas API** — photo capture + composite export  
- **Pure CSS** — glassmorphism, animations, responsive layout  

> **No Node.js. No npm. No Webpack. No frameworks.** Just one HTML file.

---

## 📁 File Structure

```
snapbooth/
└── index.html      ← entire app (HTML + CSS + React/JSX)
└── README.md       ← this file
```

---

## 🖥 Browser Support

| Browser | Support |
|---------|---------|
| Chrome / Edge | ✅ Full |
| Firefox | ✅ Full |
| Safari (iOS) | ✅ Full |
| Samsung Internet | ✅ Full |

> Camera requires **HTTPS** (GitHub Pages provides this automatically).  
> On `localhost` it also works fine via HTTP.

---

## 🎨 Customisation

All frames, filters and modes are defined as plain JS arrays at the top of `index.html`. To add a new frame:

```js
// Inside the FRAMES object in index.html
MyCategory: [
  { id:"myframe", label:"My Frame", border:"8px solid #ff69b4", bg:"#fff0f6", text:"#831843" },
],
```

---

## 📄 License

MIT — free to use, modify and distribute.

---

<div align="center">
  Made with 💜 · Inspired by Life4Cuts, Photoism &amp; Korean Photo Booth culture
</div>
