import React, { useState, useEffect, useRef } from "react";
import { ExternalLink, Maximize, X } from "lucide-react";

export function BroadcastPreview({ controlState, matchId }) {
  const targetId = matchId || "163017";
  const iframeSrc = `/live/${targetId}`;
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.2);
  const [modalScale, setModalScale] = useState(1);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

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

  // Update modal scale dynamically on window resize
  useEffect(() => {
    if (!isFullscreenModalOpen) return;

    const updateModalScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleX = w / 1920;
      const scaleY = h / 1080;
      setModalScale(Math.min(scaleX, scaleY));
    };

    updateModalScale();
    window.addEventListener("resize", updateModalScale);
    return () => window.removeEventListener("resize", updateModalScale);
  }, [isFullscreenModalOpen]);

  // Open Standalone Browser Pop-Up Window (1280x720)
  const handleOpenPopUpWindow = () => {
    window.open(
      iframeSrc,
      "LiveBroadcastPopUp",
      "width=1280,height=720,menubar=no,toolbar=no,location=no,status=no,resizable=yes"
    );
  };

  // Open Fullscreen Modal Pop-Up Overlay
  const handleOpenFullscreenModal = async () => {
    setIsFullscreenModalOpen(true);
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.debug("Native fullscreen request error:", err);
    }
  };

  // Close Fullscreen Modal Pop-Up
  const handleCloseFullscreenModal = async () => {
    setIsFullscreenModalOpen(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.debug("Exit fullscreen error:", err);
    }
  };

  return (
    <>
      <div className="control-panel-section preview-section">
        <div className="section-title-wrap preview-title-row">
          <h3>OBS BROADCAST PREVIEW</h3>
          <div className="preview-action-group">
            <button
              type="button"
              onClick={handleOpenPopUpWindow}
              className="btn-icon-link"
              aria-label="Open broadcast in standalone pop-up window"
              title="Open Standalone Pop-up Window"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0
              }}
            >
              <ExternalLink size={13} />
            </button>

            <button
              type="button"
              onClick={handleOpenFullscreenModal}
              className="btn-icon-link"
              aria-label="Fullscreen broadcast preview pop-up"
              title="Fullscreen Pop-up Overlay"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0
              }}
            >
              <Maximize size={13} />
            </button>
          </div>
        </div>
        <p className="section-desc">Live 16:9 monitor canvas reflecting current OBS output. Click canvas to open full-screen pop-up.</p>

        {/* Clickable Preview Canvas Box */}
        <div
          className="preview-canvas-box"
          onClick={handleOpenFullscreenModal}
          style={{ cursor: "pointer" }}
        >
          <div className="preview-header-bar">
            <span className="preview-tag">● OBS CANVAS (1920x1080)</span>
            <span className="preview-layout-tag">LAYOUT: {controlState?.layout || "DEFAULT"} — CLICK TO ENLARGE POP-UP</span>
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

      {/* FULLSCREEN POPUP MODAL OVERLAY */}
      {isFullscreenModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#000000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          {/* Floating Top Control Bar with Close Button */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "20px",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              gap: "1rem"
            }}
          >
            <span
              style={{
                color: "#facc15",
                fontWeight: 800,
                fontSize: "0.85rem",
                letterSpacing: "1px",
                background: "rgba(15, 23, 42, 0.85)",
                padding: "0.4rem 0.9rem",
                borderRadius: "6px",
                border: "1px solid rgba(250, 204, 21, 0.4)",
                backdropFilter: "blur(4px)"
              }}
            >
              ● LIVE OBS BROADCAST FULLSCREEN PREVIEW
            </span>
            <button
              type="button"
              onClick={handleCloseFullscreenModal}
              style={{
                background: "#ef4444",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(239, 68, 68, 0.6)",
                transition: "transform 0.15s ease"
              }}
              title="Close Fullscreen Pop-up"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scaled Fullscreen 16:9 Broadcast Canvas */}
          <div
            style={{
              width: "1920px",
              height: "1080px",
              transform: `scale(${modalScale})`,
              transformOrigin: "center center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <iframe
              src={iframeSrc}
              title="Fullscreen Broadcast Stream"
              style={{
                width: "1920px",
                height: "1080px",
                border: "none"
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
