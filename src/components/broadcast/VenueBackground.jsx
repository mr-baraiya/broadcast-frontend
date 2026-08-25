import React, { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "../../utils/config";

const DEFAULT_STADIUM_URL = "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1920&auto=format&fit=crop";

export function VenueBackground({ matchData }) {
  const [stadium, setStadium] = useState({
    url: DEFAULT_STADIUM_URL,
    overlay_opacity: 0.55,
    blur: 4
  });

  useEffect(() => {
    let isMounted = true;
    axios.get(`${getApiBaseUrl()}/stadium/background`)
      .then((res) => {
        if (isMounted && res.data && res.data.stadium) {
          setStadium(res.data.stadium);
        }
      })
      .catch((err) => console.debug("VenueBackground fetch error:", err));

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="venue-background-root" style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Stadium Photo Layer */}
      <div
        className="stadium-photo-layer"
        style={{
          position: "absolute",
          inset: "-20px",
          backgroundImage: `url(${stadium.url || DEFAULT_STADIUM_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          filter: `blur(${stadium.blur || 4}px)`,
          transform: "scale(1.03)",
          transition: "all 0.5s ease"
        }}
      />

      {/* Production Dark Vignette Overlay */}
      <div
        className="stadium-vignette-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 40%, rgba(10, 12, 16, ${stadium.overlay_opacity - 0.2}) 0%, rgba(10, 12, 16, ${stadium.overlay_opacity + 0.25}) 100%),
            linear-gradient(180deg, rgba(10, 12, 16, 0.4) 0%, rgba(10, 12, 16, 0.95) 100%)
          `
        }}
      />
    </div>
  );
}
