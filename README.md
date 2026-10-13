# CUBEPRO by Kaloy

> Speedcubing Made Dead Simple • Path to Sub-20 & Sub-10

CubePro is a fast, responsive, offline-ready Progressive Web App (PWA) built for learning and mastering the CFOP speedcubing method (Cross, F2L, OLL, PLL) with solid 3D WebGL animations, spaced-repetition drills, and a competition-grade timer.

---

## Features

### 1. Structured CFOP Curriculum (`Learn`)
* **12 Step-by-Step Lessons**: Four sequential stages (**Cross**, **F2L**, **OLL**, **PLL**) each with **Beginner**, **Intermediate**, and **Pro** tracks.
* **Practice Readiness Checklists**: Clear goals, practice drills, and self-reported readiness tracking persisted to `localStorage`.
* **Integrated Case Vault**: 90+ verified algorithms including White Cross methods, all 41 standard F2L cases, 2-Look OLL, and full PLL with 2D flat-net diagrams and real-cube setup scrambles.

### 2. Physical & Logical 3D Visualizer (`Practice`)
* **Solid 3D WebGL Engine**: Powered by Three.js with tactile beveled plastic styling and OrbitControls camera orbit.
* **Exact Turn Consistency**: Mathematically unified layer rotation (`cube-moves.js`) guaranteeing physical turns agree with logical facelet tracking across all quarter turns, slice moves ($M$, $E$, $S$), wide turns ($r$, $l$, $f$, $u$, $d$, $b$), and cube rotations ($x$, $y$, $z$).
* **Step-by-Step Playback**: Synchronized ribbon pills, step indicator, variable speed slider (0.3s – 3.0s), 2D top-down Last-Layer recognition view, and keyboard shortcuts (`Space`, `←`, `→`, `R`).
* **Interactive Move Notation Explorer**: Safe sandbox to test any move notation slowly on a solved cube.

### 3. Flashcard Drill Trainer (`Drills`)
* **Spaced-Repetition Recall**: Tests algorithm recognition from scrambled 2D previews with easy/good/hard rating weights.
* **Lookahead Metronome**: Built-in audio metronome (30 – 180 BPM) using Web Audio API to build smooth, pause-free turning flow.

### 4. Competition Speed Timer (`Timer`)
* **WCA Scramble Generator & 2D Verification Net**: Random 3x3 scrambles with instant 2D flat-net diagram for pre-solve verification.
* **WCA 15-Second Inspection**: Optional countdown with sound cues.
* **Statistics & History**: Real-time tracking of Best Single, Average of 5 (Ao5), Average of 12 (Ao12), and interactive performance trend charts.

### 5. Hardware & Ergonomics Guide (`Guide`)
* **Hardware Advice**: Explanation of magnetic cubes vs. standard non-magnetic cubes, tensioning, and budget/flagship recommendations.
* **Fingertrick Fundamentals**: Step-by-step guides for index flick $U$, double-flick $U2$, Sexy Move ($R\ U\ R'\ U'$), and Sledgehammer ($R'\ F\ R\ F'$).

### 6. Design & Accessibility
* **Light / Dark Mode**: Dedicated high-contrast color palettes with smooth transitions and persistent state.
* **Ergonomic Mobile Layout**: Thumb-zone bottom navigation bar, mobile-first responsive controls, and zero horizontal scroll overflow.
* **100% Offline PWA**: Installable on Android, iOS, Windows, macOS, and Linux with Service Worker precaching (`sw.js`).

---

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher; v22 recommended)

### Quick Run
Double-click `run_app.bat` on Windows, or run:
```bash
npm start
```
Then open [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in your web browser.

### Running Automated Tests
Run the comprehensive test suite with Node's native test runner:
```bash
npm test
```
The test suite validates:
* Physical 3D animation endpoints agree with logical facelet tracking for all moves and variants.
* Wide-layer equivalences and Singmaster rotation identities.
* Four-turn and inverse identities.
* Parsing of algorithm groups and repetitions (e.g. `(R U R' U')6`).
* Replay, cancelation, and playback state coherence.
* All 12 curriculum lessons, setups, and example algorithms.
* Service worker precaching and cache management.

---

## Project Structure

```
cube/
├── index.html                 # Single-page app structure & accessible dialogs
├── manifest.json              # Web App Manifest for PWA installation
├── sw.js                      # Service Worker with versioned offline cache
├── run_app.bat                # Windows quick-launch script
├── package.json               # Scripts & test commands
├── css/
│   ├── styles.css             # Design system tokens, dark/light themes, components
│   └── learning.css           # CFOP curriculum cards & visualizer layout
├── js/
│   ├── app.js                 # App orchestrator & state manager
│   ├── cube-moves.js          # Unified coordinate & physical rotation specs
│   ├── cube-engine.js         # Core Rubik's cube facelet simulation model
│   ├── cube-visualizer.js     # Three.js 3D WebGL renderer & playback controller
│   ├── curriculum.js          # 12 structured CFOP lessons & case selectors
│   ├── algorithms-data.js     # Algorithm vault data (Cross, F2L, OLL, PLL)
│   ├── diagram-generator.js   # 2D SVG flat net & recognition diagram generator
│   ├── timer.js               # WCA speed timer with statistics
│   ├── trainer.js             # Flashcard drill trainer & metronome
│   ├── three.min.js           # Bundled Three.js WebGL library
│   └── OrbitControls.js       # Camera orbit controls
├── scripts/
│   └── serve.cjs              # Local static HTTP server
├── tests/
│   ├── cube.test.mjs          # Physics, logic, parser, & visualizer tests
│   └── curriculum.test.mjs    # Lessons, algorithms, setups, & PWA tests
└── icons/                     # PWA icons & app badges
```

---

## License
MIT
