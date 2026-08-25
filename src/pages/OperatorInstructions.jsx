import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Monitor, Sliders, Image, Play, ExternalLink, ArrowLeft, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function OperatorInstructions() {
  return (
    <div style={{ minHeight: "100vh", height: "auto", overflowY: "auto", backgroundColor: "#0d0d0d", color: "#f0f0f0", fontFamily: "Inter, sans-serif", padding: "2rem 2rem 4rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Top Header Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", borderBottom: "1px solid #272727", paddingBottom: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                background: "#1c1c1c",
                border: "1px solid #2e2e2e",
                color: "#f0f0f0",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <BookOpen size={24} color="#f0a500" /> TV Broadcast Operator Guide & Setup
            </h1>
          </div>
          <span style={{ fontSize: "0.8rem", color: "#f0a500", fontWeight: 700, background: "rgba(240, 165, 0, 0.15)", padding: "0.3rem 0.8rem", borderRadius: "20px", border: "1px solid rgba(240, 165, 0, 0.3)" }}>
            VERSION 2.0 • LIVE OBS ENGINE
          </span>
        </div>

        {/* Section 1: Quick Overview */}
        <section style={{ background: "#141414", border: "1px solid #272727", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0a500", marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={18} /> 1. Overview & System Architecture
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#aaaaaa", lineHeight: 1.6 }}>
            This system provides a full-featured, professional 16:9 TV graphics overlay for live cricket broadcasts. Control settings applied in the <strong style={{ color: "#ffffff" }}>Control Panel</strong> update the <strong style={{ color: "#ffffff" }}>Live Broadcast Screen</strong> in real-time via WebSocket data sync.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ background: "#1c1c1c", padding: "1rem", borderRadius: "8px", border: "1px solid #272727" }}>
              <span style={{ fontSize: "0.75rem", color: "#888888", fontWeight: 700, textTransform: "uppercase" }}>Control Panel URL</span>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#38bdf8", marginTop: "0.3rem" }}>
                http://localhost:5173/control/:matchId
              </div>
            </div>
            <div style={{ background: "#1c1c1c", padding: "1rem", borderRadius: "8px", border: "1px solid #272727" }}>
              <span style={{ fontSize: "0.75rem", color: "#888888", fontWeight: 700, textTransform: "uppercase" }}>Live Broadcast Stream URL</span>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#6dba7f", marginTop: "0.3rem" }}>
                http://localhost:5173/live/:matchId
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: OBS Studio Integration */}
        <section style={{ background: "#141414", border: "1px solid #272727", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0a500", marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Monitor size={18} /> 2. OBS Studio Setup Instructions
          </h2>
          <ol style={{ fontSize: "0.9rem", color: "#cccccc", lineHeight: 1.8, paddingLeft: "1.2rem", margin: 0 }}>
            <li>Open <strong>OBS Studio</strong> and navigate to your active broadcast Scene.</li>
            <li>Under the <strong>Sources</strong> box, click the <strong>+</strong> button and choose <strong>Browser</strong>.</li>
            <li>Name your source (e.g. <code>Cricket TV Overlay</code>) and click OK.</li>
            <li>In the Browser Source properties window, set the following parameters:
              <ul style={{ margin: "0.5rem 0", color: "#aaaaaa", listStyleType: "square" }}>
                <li><strong style={{ color: "#ffffff" }}>URL:</strong> <code>http://localhost:5173/live/163017</code></li>
                <li><strong style={{ color: "#ffffff" }}>Width:</strong> <code>1920</code></li>
                <li><strong style={{ color: "#ffffff" }}>Height:</strong> <code>1080</code></li>
                <li><strong style={{ color: "#ffffff" }}>FPS:</strong> <code>60</code></li>
                <li>Check <strong style={{ color: "#ffffff" }}>Shutdown source when not visible</strong>: Unchecked</li>
                <li>Check <strong style={{ color: "#ffffff" }}>Refresh browser when scene becomes active</strong>: Checked</li>
              </ul>
            </li>
            <li>Click <strong>OK</strong>. The 16:9 graphics canvas will now load seamlessly inside OBS Studio!</li>
          </ol>
        </section>

        {/* Section 3: Control Panel Operations */}
        <section style={{ background: "#141414", border: "1px solid #272727", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0a500", marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sliders size={18} /> 3. Layouts & Toggle Controls
          </h2>
          <ul style={{ fontSize: "0.9rem", color: "#cccccc", lineHeight: 1.8, paddingLeft: "1.2rem", margin: 0 }}>
            <li><strong style={{ color: "#ffffff" }}>DEFAULT Layout:</strong> Full 4-tier TV broadcast presentation (Top Scoreboard, Hero Player Cards, Match Analytics, Innings Timeline, Live Ticker).</li>
            <li><strong style={{ color: "#ffffff" }}>SCORE ONLY Layout:</strong> Compact top scoreboard strip only, ideal for tight match situations.</li>
            <li><strong style={{ color: "#ffffff" }}>MINIMAL Layout:</strong> Muted low-profile graphic preset.</li>
            <li><strong style={{ color: "#ffffff" }}>Display Toggles:</strong> Instantly toggle visibility of individual elements (Scoreboard, Player Cards, Analytics Panel, Timeline Track, Live Ticker) with 1-click controls.</li>
          </ul>
        </section>

        {/* Section 4: Stadium Photo & Player Customization */}
        <section style={{ background: "#141414", border: "1px solid #272727", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0a500", marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Image size={18} /> 4. Custom Stadium & Player Photo Uploads
          </h2>
          <div style={{ fontSize: "0.9rem", color: "#aaaaaa", lineHeight: 1.7 }}>
            <p><strong style={{ color: "#ffffff" }}>Uploading Stadium Backdrop Photos:</strong></p>
            <ol style={{ paddingLeft: "1.2rem", margin: 0 }}>
              <li>In the Control Panel under <strong>STADIUM BACKGROUND IMAGE & EFFECTS</strong>, click the preview dropzone or the <strong>SELECT & UPLOAD STADIUM IMAGE</strong> button.</li>
              <li>Pick any WebP, PNG, JPG, or JPEG photo from your computer.</li>
              <li>The image is automatically resized and optimized to a 1920×1080 WebP backdrop (&lt;250 KB).</li>
              <li>The new stadium background updates <strong>INSTANTLY</strong> on all active live broadcast screens!</li>
            </ol>
          </div>
        </section>

        {/* Section 5: Fullscreen & Pop-Up Monitoring */}
        <section style={{ background: "#141414", border: "1px solid #272727", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f0a500", marginTop: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Play size={18} /> 5. Fullscreen & Standalone Pop-Up Monitoring
          </h2>
          <ul style={{ fontSize: "0.9rem", color: "#cccccc", lineHeight: 1.8, paddingLeft: "1.2rem", margin: 0 }}>
            <li><strong style={{ color: "#ffffff" }}>Fullscreen Pop-Up Modal:</strong> Click the <strong style={{ color: "#f0a500" }}>Fullscreen Icon</strong> or click directly on the preview canvas inside the Control Panel to expand a full 1080p broadcast overlay. Click the red <strong>X</strong> button to close.</li>
            <li><strong style={{ color: "#ffffff" }}>Standalone Window:</strong> Click the <strong style={{ color: "#38bdf8" }}>External Window Icon</strong> to open a separate 1280×720 pop-up browser window for multi-monitor setups.</li>
          </ul>
        </section>

        {/* Bottom Back Button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link
            to="/control/163017"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 1.8rem",
              borderRadius: "8px",
              background: "#f0a500",
              color: "#0d0d0d",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 800
            }}
          >
            Open Control Panel Now
          </Link>
        </div>

      </div>
    </div>
  );
}
