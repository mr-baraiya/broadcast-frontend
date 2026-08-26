import React, { useState } from "react";
import { Check } from "lucide-react";

export function MatchStateControl({ controlState, onStateChange }) {
  const currentOverride = controlState?.matchStateOverride || "AUTO";
  const [customText, setCustomText] = useState(controlState?.customStatusText || "");

  const statesList = [
    { key: "AUTO", label: "AUTO (API DETECT)", desc: "Automatic live score feed detection" },
    { key: "LIVE", label: "LIVE IN-PLAY", desc: "Standard in-play overlay view" },
    { key: "NOT_STARTED", label: "NOT STARTED YET", desc: "Pre-match upcoming overlay screen" },
    { key: "INNINGS_BREAK", label: "INNINGS BREAK", desc: "1st innings score & target equation" },
    { key: "RAIN_DELAY", label: "RAIN DELAY", desc: "Weather delay & pitch covers screen" },
    { key: "LUNCH", label: "LUNCH / TEA BREAK", desc: "Session interval break screen" },
    { key: "COMPLETED", label: "MATCH COMPLETED", desc: "Match result & post-match summary" }
  ];

  const handleSelectState = (stateKey) => {
    if (onStateChange) {
      onStateChange("matchStateOverride", stateKey);
    }
  };

  const handleCustomTextSubmit = (e) => {
    e.preventDefault();
    if (onStateChange) {
      onStateChange("customStatusText", customText);
    }
  };

  return (
    <div className="control-panel-section">
      <div className="section-title-wrap">
        <h3>BROADCAST MATCH STATE SWITCHER</h3>
      </div>
      <p className="section-desc">Override screen overlay mode when match is Not Started, on Innings Break, or Rain Delay.</p>

      {/* 2-Column Grid matching theme */}
      <div className="layout-presets-grid" style={{ marginBottom: "1rem" }}>
        {statesList.map(({ key, label, desc }) => {
          const isSelected = currentOverride === key;

          return (
            <button
              key={key}
              type="button"
              className={`preset-card ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelectState(key)}
              style={isSelected ? { borderColor: "var(--accent-live)", background: "var(--bg-raised)" } : {}}
            >
              <div className="preset-header">
                <span className="preset-label" style={isSelected ? { color: "var(--accent-live)" } : {}}>
                  {label}
                </span>
                {isSelected && <Check size={14} style={{ color: "var(--accent-live)" }} />}
              </div>
              <div className="preset-desc">{desc}</div>
            </button>
          );
        })}
      </div>

      {/* Custom Status Input matching theme */}
      <form onSubmit={handleCustomTextSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Custom status banner (e.g. Play delayed due to rain • Covers on pitch)"
          className="url-input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn-copy" style={{ padding: "0 1.2rem", flexShrink: 0 }}>
          Update Text
        </button>
      </form>
    </div>
  );
}
