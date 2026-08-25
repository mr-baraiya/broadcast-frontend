# Live Cricket 16:9 TV Broadcast Graphics System

A modern, high-definition 16:9 TV broadcast graphics overlay engine built with React, Vite, Framer Motion, and WebSockets. Designed specifically for streaming live cricket matches on **OBS Studio**, YouTube, and Twitch.

---

## Features

- **16:9 Full-Bleed Broadcast Overlay**: Zero-margin, broadcast-standard 1080p graphics layout with zero wasted canvas space.
- **Real-Time WebSocket Synchronization**: Instant state updates between the **Control Panel** (`/control/:matchId`) and the **Live Broadcast Screen** (`/live/:matchId`).
- **Dynamic Control Panel**:
  - 1-click Layout Preset Selector (`DEFAULT`, `SCORE ONLY`, `MINIMAL`, `FULL OVERLAY`).
  - Independent visibility toggles for Scoreboard, Player Cards, Analytics Panel, Timeline Track, and Live Ticker.
  - Interactive Standalone Pop-up Windows & Full-Screen Pop-up Modal Overlays.
- **Real-Time Stadium Background Engine**:
  - Custom WebP photo uploader with automatic 1920×1080 resolution and file size (&lt;250 KB) optimization.
  - Supports Vercel Blob CDN with automatic local static storage fallback.
  - Instant live background updates on active broadcast screens without page refresh.
- **Hero Player Cards**:
  - Enclosed 275px cards with equal edge padding.
  - 145px × 165px rounded rectangle (squircle) portrait badges.
  - Striker active gold breathing glow and real-time batsman & bowler statistics.
- **Match Analytics & Visual Innings Timeline**:
  - Horizontal score progression track with red wicket markers and gold halo current score indicator.
- **State Differential Micro-Animations**:
  - Floating `+1`, `+2`, `+3` run badges.
  - Gold `FOUR!` and purple `SIX!` near-score banners.
  - Red `WICKET!` event overlays with smooth new batsman slide-in transitions.
- **Operator Guide**: Built-in `/instructions` documentation page.

---

## Technology Stack

- **Framework**: React 18, Vite 5
- **Icons & Motion**: Lucide React, Framer Motion
- **Communication**: WebSockets (`ws://`), Axios REST API
- **Styling**: Vanilla CSS3, Design Tokens, CSS Grid/Flexbox

---

## Quick Start

### 1. Installation

```bash
# Navigate to the frontend directory
cd broadcast-frontend

# Install dependencies
npm install
```

### 2. Running Locally

```bash
# Start the Vite HMR development server
npm run dev
```

The application will be accessible at:
- **Dashboard**: `http://localhost:5173/`
- **Control Panel**: `http://localhost:5173/control/163017`
- **Live Broadcast Feed**: `http://localhost:5173/live/163017`
- **Operator Guide**: `http://localhost:5173/instructions`

---

## OBS Studio Integration Guide

To add this broadcast overlay to your live stream in **OBS Studio**:

1. Open OBS Studio and navigate to your active **Scene**.
2. Under **Sources**, click **+** and choose **Browser**.
3. Name your source (e.g. `Cricket TV Overlay`).
4. Configure the Browser Source settings:
   - **URL**: `http://localhost:5173/live/163017`
   - **Width**: `1920`
   - **Height**: `1080`
   - **FPS**: `60`
   - **Shutdown source when not visible**: `Unchecked`
   - **Refresh browser when scene becomes active**: `Checked`
5. Click **OK**. The graphics overlay will render seamlessly in 1080p!

---

## License

This project is licensed under the [MIT License](LICENSE).
