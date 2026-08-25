import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Upload, Loader2 } from "lucide-react";
import { getApiBaseUrl } from "../../utils/config";

export function StadiumUploader({ onStadiumUpdate }) {
  const [stadiumData, setStadiumData] = useState({
    url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1920&auto=format&fit=crop",
    overlay_opacity: 0.55,
    blur: 4
  });
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStadiumBackground();
  }, []);

  const fetchStadiumBackground = async () => {
    try {
      const res = await axios.get(`${getApiBaseUrl()}/stadium/background`);
      if (res.data && res.data.stadium) {
        setStadiumData(res.data.stadium);
      }
    } catch (err) {
      console.debug("Stadium background fetch error:", err);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("overlay_opacity", stadiumData.overlay_opacity);
    formData.append("blur", stadiumData.blur);

    try {
      const res = await axios.post(`${getApiBaseUrl()}/stadium/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data && res.data.stadium) {
        setStadiumData(res.data.stadium);
        setStatusMessage({
          type: "success",
          text: "✓ Stadium background updated successfully!"
        });
        if (onStadiumUpdate) onStadiumUpdate(res.data.stadium);
      }
    } catch (err) {
      console.error("Stadium background upload failed:", err);
      setStatusMessage({
        type: "error",
        text: `Upload failed: ${err.response?.data?.error?.message || err.message}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="control-panel-section stadium-uploader-section">
      <div className="section-title-wrap">
        <h3>STADIUM BACKGROUND IMAGE & EFFECTS</h3>
      </div>
      <p className="section-desc">
        Upload custom full-bleed stadium photos to Vercel Blob for the live 16:9 TV broadcast backdrop.
      </p>

      {statusMessage && (
        <div
          style={{
            padding: "0.5rem 0.8rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "0.8rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            background: statusMessage.type === "success" ? "rgba(109, 186, 127, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: statusMessage.type === "success" ? "1px solid var(--accent-on)" : "1px solid #ef4444",
            color: statusMessage.type === "success" ? "var(--accent-on)" : "#ef4444"
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id="stadium-file-input"
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {/* Preview Dropzone Matching Control Theme */}
      <div
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        style={{
          width: "100%",
          height: "120px",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          backgroundImage: `url(${stadiumData.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          cursor: "pointer",
          position: "relative",
          border: "1px solid var(--border-light)",
          marginBottom: "0.8rem"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(13, 13, 13, 0.75)",
            backdropFilter: "blur(3px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.35rem",
            color: "var(--text-primary)"
          }}
        >
          {isUploading ? (
            <Loader2 size={20} className="spin-icon" style={{ color: "var(--accent-live)" }} />
          ) : (
            <Upload size={20} style={{ color: "var(--text-secondary)" }} />
          )}
          <span style={{ fontWeight: 600, fontSize: "0.8rem", color: "var(--text-primary)" }}>
            {isUploading ? "Uploading Stadium Photo..." : "Click Anywhere To Upload Stadium Image"}
          </span>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Supports WebP, PNG, JPG, JPEG</span>
        </div>
      </div>

      {/* Primary Action Button Matching Control Theme */}
      <button
        type="button"
        disabled={isUploading}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        style={{
          width: "100%",
          padding: "0.65rem 1rem",
          borderRadius: "var(--radius-sm)",
          background: "var(--bg-raised)",
          border: "1px solid var(--border-light)",
          color: "var(--text-primary)",
          fontWeight: 600,
          fontSize: "0.78rem",
          letterSpacing: "0.5px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          transition: "all 0.15s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--bg-hover)";
          e.currentTarget.style.borderColor = "var(--accent-live)";
          e.currentTarget.style.color = "var(--accent-live)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--bg-raised)";
          e.currentTarget.style.borderColor = "var(--border-light)";
          e.currentTarget.style.color = "var(--text-primary)";
        }}
      >
        <Upload size={14} />
        <span>SELECT & UPLOAD STADIUM IMAGE</span>
      </button>
    </div>
  );
}
