import React from "react";

export function VenueBackground() {
  return (
    <div
      className="bg-motion-wrapper"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden"
      }}
    >
      {/* Stadium Photo Background Layer */}
      <div
        className="bg-motion-layer"
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          filter: "brightness(0.35) contrast(1.1)"
        }}
      />

      {/* Dark Broadcast Gradient Overlay for Maximum Text Contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 20%, rgba(6, 11, 25, 0.4) 0%, rgba(2, 6, 23, 0.92) 85%),
            linear-gradient(180deg, rgba(6, 11, 25, 0.85) 0%, rgba(2, 6, 23, 0.95) 100%)
          `
        }}
      />
    </div>
  );
}
