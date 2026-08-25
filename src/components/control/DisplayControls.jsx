import React from "react";

export function DisplayControls({ controlState, onToggleChange }) {
  const coreToggles = [
    { key: "showScoreboard", label: "Top Scoreboard", desc: "Main score & overs header graphic" },
    { key: "showPlayers", label: "Player Cards", desc: "Striker, non-striker & bowler statistics" },
    { key: "showRecentBalls", label: "Recent Balls", desc: "Delivery pills for recent overs" },
    { key: "showCommentary", label: "Commentary Ticker", desc: "Live delivery text ticker" },
    { key: "showVenue", label: "Venue Background", desc: "Stadium photo backdrop layer" }
  ];

  return (
    <div className="control-panel-section">
      <div className="section-title-wrap">
        <h3>GRAPHICS SWITCHER CONTROLS</h3>
      </div>
      <p className="section-desc">Toggle broadcast layers on/off for remote OBS capture in real-time.</p>

      <div className="category-group">
        <div className="category-title">OVERLAY LAYERS</div>
        <div className="toggles-grid">
          {coreToggles.map(({ key, label, desc }) => {
            const isActive = !!controlState[key];

            return (
              <div
                key={key}
                className={`toggle-card ${isActive ? "active" : ""}`}
                onClick={() => onToggleChange(key, !isActive)}
              >
                <div className="toggle-info">
                  <div className="toggle-header">
                    <span className="toggle-label">{label}</span>
                  </div>
                  <span className="toggle-desc">{desc}</span>
                </div>

                <button className={`switch-button ${isActive ? "on" : "off"}`} aria-label={`Toggle ${label}`}>
                  <span className="switch-slider" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
