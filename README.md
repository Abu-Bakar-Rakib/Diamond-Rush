# 💎 Diamond Rush — Retro Cave Puzzle Adventure

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css&logoColor=white)
![Audio](https://img.shields.io/badge/Audio-Web_Audio_API-orange)
![FPS](https://img.shields.io/badge/Performance-60_FPS-emerald)

An authentic retro cave-exploration arcade puzzle game built with **React**, **HTML5 Canvas**, and **TypeScript**. Navigate treacherous underground chambers, dig through soil, gather precious gems, manipulate boulders with dynamic gravity physics, and unlock escape portals!

[🎮 Features](#-key-features) • [🕹️ Controls](#-controls) • [⚙️ Physics & Mechanics](#-gameplay--physics) • [🗺️ Progression System](#-progression-system) • [🚀 Getting Started](#-getting-started) • [📁 Project Structure](#-project-structure)

</div>

---

## ✨ Key Features

- **🗺️ 15 Handcrafted Sequential Levels:**
  - **Easy (5 Stages):** Introductory caverns focusing on basic digging, boulder balancing, and routing.
  - **Medium (5 Stages):** Tight tunnels, stacked boulders, and avalanche chain reactions.
  - **Hard (5 Stages):** Complex cave systems, intricate gravity puzzles, and perilous gem extractions.
- **💾 Persistent Stage Progression:**
  - Sequential unlocking: Complete Stage $N$ to unlock Stage $N+1$.
  - Automated progress save in browser `localStorage` — pick up right where you left off.
- **🪨 Realistic Boulder Gravity Physics:**
  - Dynamic falling hazards: Clearing dirt underneath unsupported boulders causes them to plunge straight down.
  - Boulder pushing: Push rocks horizontally into empty space or dug paths.
- **💥 Comic-Style Visual Crush VFX:**
  - High-impact camera shake upon boulder impact.
  - Animated comic starburst **`SPLAT!`** badge with flattened pancake player sprite.
  - Orbiting dizzy stars, flying rock debris particles, and educational hazard banner.
- **🔊 100% Procedural Chiptune Audio:**
  - Pure Web Audio API synthesis — zero external MP3/WAV assets required.
  - Custom sound effects for gem pickups, dirt digging, boulder pushes, portal unlocks, and deaths.
- **⚡ High Performance & Zero Asset Dependencies:**
  - Rendered via optimized HTML5 2D Canvas at a locked 60 FPS.
  - Zero external image sprites or audio files — everything is dynamically drawn and synthesized in code.
  - Instant reset (<1s rewind) for seamless retry loops.

---

## 🕹️ Controls

| Key | Action |
| :--- | :--- |
| <kbd>↑</kbd> / <kbd>W</kbd> | Move Up |
| <kbd>↓</kbd> / <kbd>S</kbd> | Move Down |
| <kbd>←</kbd> / <kbd>A</kbd> | Move Left |
| <kbd>→</kbd> / <kbd>D</kbd> | Move Right |
| <kbd>R</kbd> | Quick Restart Level |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | Instant Respawn after Crush |
| <kbd>Esc</kbd> | Return to Stage Menu |

---

## ⚙️ Gameplay & Physics

### Entity Overview

| Icon / Tile | Name | Description |
| :---: | :--- | :--- |
| 🧑 | **Player** | The cave explorer. Digs through dirt and pushes boulders horizontally. |
| 💎 | **Diamond** | Collect quota to power and unlock the escape portal. |
| 🪨 | **Boulder** | Heavy stone. Falls downwards when unsupported. Can crush the player! |
| 🟫 | **Dirt** | Soft earth. Digs away instantly when walked over by the player. |
| ⬛ | **Stone Wall** | Indestructible cave barrier framing the cavern. |
| 🌀 | **Portal** | Locked initially; steps into victory once all diamonds are gathered. |

### Boulder Physics Rules
1. **Vertical Gravity:** If dirt or space underneath a rock is cleared, the rock enters free-fall after a fractional delay.
2. **Crush Hazard:** If a boulder drops onto the player's tile, the player is flattened. An alert banner explains the cause and rewinds the cavern.
3. **Horizontal Pushing:** The player can push a boulder left or right, provided the adjacent destination tile is completely empty (`empty` air).

---

## 🗺️ Progression System

1. **Sequential Unlocking:**
   - Players start at **Stage 1** for each difficulty mode.
   - Beating Stage 1 unlocks Stage 2, beating Stage 2 unlocks Stage 3, and so on up to Stage 5.
   - Future stages remain locked until the prerequisite stage is cleared.
2. **Automatic Browser Storage:**
   - Progress is automatically saved into browser `localStorage`.
   - Players can close their tab and resume their highest unlocked stage on return.
3. **Stage Replayability:**
   - Any previously cleared stage can be freely selected and replayed from the stage briefing screen.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/diamond-rush.git
   cd diamond-rush
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to play!

4. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready self-contained bundle will be generated in `dist/`.

---

## 📁 Project Structure

```text
Diamond Rush/
├── .gitignore               # Git exclusions (node_modules, dist, etc.)
├── README.md                # Project documentation & manual
├── index.html               # Main HTML5 entry point
├── package.json             # Minimal dependencies (React 19, Lucide, Canvas-Confetti)
├── tsconfig.json            # TypeScript compiler configuration
├── vite.config.ts           # Vite build pipeline
└── src/
    ├── components/
    │   ├── GameCanvas.tsx   # 60 FPS HTML5 game canvas, render loop & particle VFX
    │   ├── Header.tsx       # Top bar with mute toggle
    │   ├── MainMenu.tsx     # Title screen & difficulty entry
    │   ├── ModeSelect.tsx   # Difficulty picker (Easy, Medium, Hard)
    │   ├── StartScreen.tsx  # Stage selector (Stages 1–5) & mission briefing
    │   └── VictoryModal.tsx # Stage completion celebration & confetti
    ├── App.tsx              # Application state coordinator & view router
    ├── audio.ts             # 100% procedural Web Audio API sound synthesizer
    ├── gameLogic.ts         # Pure functional game state & move execution engine
    ├── index.css            # Dark mode Tailwind CSS styling
    ├── levels.ts            # Handcrafted grid layouts for 15 sequential levels
    ├── main.tsx             # React DOM root initialization
    ├── storage.ts           # Browser localStorage progression persistence
    └── types.ts             # TypeScript definitions for entities, grid & state
```

---

## 🛠️ Built With

- **[React 19](https://react.dev/)** — Declarative UI & game state orchestration
- **[TypeScript](https://www.typescriptlang.org/)** — Strict type safety for game state transitions
- **[Vite](https://vitejs.dev/)** — Ultra-fast frontend tooling and bundle pipeline
- **[Tailwind CSS](https://tailwindcss.com/)** — Modern dark-mode interface styling
- **[HTML5 Canvas 2D](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)** — High-performance sprite rendering & particle animations
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** — Zero-dependency retro arcade sound generator
- **[Lucide React](https://lucide.dev/)** — Crisp SVG icon set

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
