import React from "react";
import { Check } from "lucide-react";

export function LayoutSelector({ currentLayout = "DEFAULT", onLayoutChange }) {
  const layouts = [
    { id: "DEFAULT", label: "DEFAULT", desc: "Full 16:9 broadcast overlay" },
    { id: "COMPACT", label: "COMPACT", desc: "Compact bottom third layout" },
    { id: "SCORE_ONLY", label: "SCORE ONLY", desc: "Top scoreboard display only" },
    { id: "FULL", label: "FULL OVERLAY", desc: "Extended broadcast composition" }
  ];

  return (
    <div className="control-panel-section">
      <div className="section-title-wrap">
        <h3>BROADCAST LAYOUT PRESETS</h3>
      </div>
      <p className="section-desc">Select visual layout mode for OBS Browser Source capture.</p>

      <div className="layout-presets-grid">
        {layouts.map(({ id, label, desc }) => {
          const isSelected = currentLayout === id;

          return (
            <button
              key={id}
              className={`preset-card ${isSelected ? "selected" : ""}`}
              onClick={() => onLayoutChange(id)}
            >
              <div className="preset-header">
                <span className="preset-label">{label}</span>
                {isSelected && <Check size={14} className="check-icon" />}
              </div>
              <div className="preset-desc">{desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
