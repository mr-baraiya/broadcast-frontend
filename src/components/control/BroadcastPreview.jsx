import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Maximize } from "lucide-react";

export function BroadcastPreview({ controlState, matchId }) {
  const targetId = matchId || "163017";
  const iframeSrc = `/live/${targetId}`;
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) {
          setScale(width / 1920);
        }
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="control-panel-section preview-section">
      <div className="section-title-wrap preview-title-row">
        <h3>OBS BROADCAST PREVIEW</h3>
        <div className="preview-action-group">
          <Link
            to={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon-link"
            aria-label="Open broadcast in new tab"
            title="Open in new tab"
          >
            <ExternalLink size={13} />
          </Link>
          <Link
            to={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon-link"
            aria-label="Fullscreen broadcast preview"
            title="Fullscreen"
          >
            <Maximize size={13} />
          </Link>
        </div>
      </div>
      <p className="section-desc">Live 16:9 monitor canvas reflecting current OBS output.</p>

      <div className="preview-canvas-box">
        <div className="preview-header-bar">
          <span className="preview-tag">● OBS CANVAS (1920x1080)</span>
          <span className="preview-layout-tag">LAYOUT: {controlState?.layout || "DEFAULT"}</span>
        </div>

        <div className="preview-iframe-wrapper" ref={containerRef}>
          <iframe
            src={iframeSrc}
            title="Live Broadcast Preview"
            className="preview-iframe-scaled"
            style={{
              width: "1920px",
              height: "1080px",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              border: "none",
              pointerEvents: "none"
            }}
          />
        </div>
      </div>
    </div>
  );
}
