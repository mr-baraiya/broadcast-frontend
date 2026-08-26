import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getPlayerPortrait, getTeamLogoUrl, refreshLogoRegistry, refreshPlayerRegistry } from "../../utils/teamLogos";

import { getApiBaseUrl } from "../../utils/config";

// ─── Initials Placeholder SVG ─────────────────────────────────────────────────
function InitialsBadge({ text, size = 52 }) {
  const initials = (text || "?").replace(/[^A-Za-z0-9]/g, "").substring(0, 3).toUpperCase();
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 6, display: "block" }}>
      <rect width={size} height={size} fill="#1c1c1c" />
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#888"
        fontSize={size * 0.3}
        fontWeight="700"
        fontFamily="Inter, sans-serif"
        letterSpacing="1"
      >
        {initials}
      </text>
    </svg>
  );
}

// ─── Single Drop Zone ─────────────────────────────────────────────────────────
function DropZone({ id, label, sublabel, previewUrl, isCustom, isUploading, uploadSuccess, onFile, accept = "image/*", initialsText }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  const stateClass = isDragging
    ? "dz-dragging"
    : isUploading
      ? "dz-uploading"
      : uploadSuccess
        ? "dz-success"
        : isCustom
          ? "dz-blob"
          : "dz-idle";

  return (
    <div
      id={id}
      className={`media-drop-zone ${stateClass}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploading && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !isUploading && inputRef.current?.click()}
      aria-label={`Upload ${label}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={handleChange}
        disabled={isUploading}
      />

      {/* Preview or Initials Placeholder */}
      <div className="dz-preview-wrap">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={label}
            className="dz-preview-img"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="dz-placeholder">
            <InitialsBadge text={initialsText || label} size={52} />
          </div>
        )}

        {/* Status Overlay */}
        <div className={`dz-status-overlay ${isUploading || uploadSuccess ? "visible" : ""}`}>
          {isUploading && <Loader2 size={18} className="spin-icon dz-overlay-icon" />}
          {uploadSuccess && <CheckCircle2 size={18} className="dz-overlay-icon success-icon" />}
        </div>
      </div>

      {/* Info */}
      <div className="dz-info">
        <span className="dz-label">{label}</span>
        {sublabel && <span className="dz-sublabel">{sublabel}</span>}

        <div className="dz-meta-row">
          {isUploading ? (
            <span className="dz-chip uploading">
              <Loader2 size={9} className="spin-icon" /> Uploading…
            </span>
          ) : uploadSuccess ? (
            <span className="dz-chip success">
              <CheckCircle2 size={9} /> Updated
            </span>
          ) : isCustom ? (
            <span className="dz-chip blob">● Custom Image</span>
          ) : (
            <span className="dz-chip default" style={{ background: "rgba(245, 158, 11, 0.2)", color: "#f59e0b", border: "1px solid rgba(245, 158, 11, 0.4)", fontWeight: "700" }}>
              ⚠️ Photo Missing
            </span>
          )}


          <span className="dz-action-hint">
            {isDragging ? "Drop to upload" : isUploading ? "Please wait…" : "Click or drag to change"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main MediaUploader Component ─────────────────────────────────────────────
export function MediaUploader({ matchData, onRefresh }) {
  const [uploadingState, setUploadingState] = useState({});
  const [successState, setSuccessState] = useState({});
  const [previewOverrides, setPreviewOverrides] = useState({});
  const [globalStatus, setGlobalStatus] = useState(null);

  if (!matchData) return null;

  const { players, teams } = matchData;

  const teamA = teams?.teamA || teams?.batting || "Team A";
  const teamB = teams?.teamB || teams?.bowling || "Team B";
  const teamALogoUrl = previewOverrides["teamA"] || getTeamLogoUrl(teamA);
  const teamBLogoUrl = previewOverrides["teamB"] || getTeamLogoUrl(teamB);

  // Correctly extract player data from normalized matchData or raw object
  const strikerData = players?.striker || players?.batsman1 || null;
  const nonStrikerData = players?.nonStriker || players?.batsman2 || null;
  const bowlerData = players?.bowler || null;

  const playerSlots = [
    { key: "striker", label: "Striker", role: "Striker", data: strikerData },
    { key: "nonStriker", label: "Non-Striker", role: "Non-Striker", data: nonStrikerData },
    { key: "bowler", label: "Bowler", role: "Bowler", data: bowlerData },
  ];

  const showStatus = (type, text) => {
    setGlobalStatus({ type, text });
    setTimeout(() => setGlobalStatus(null), 3500);
  };

  // ─── Team Logo Upload ──────────────────────────────────────────────────────
  const handleLogoFile = async (teamKey, teamName, file) => {
    const localUrl = URL.createObjectURL(file);
    setPreviewOverrides((prev) => ({ ...prev, [teamKey]: localUrl }));
    setUploadingState((prev) => ({ ...prev, [teamKey]: true }));
    setSuccessState((prev) => ({ ...prev, [teamKey]: false }));

    const formData = new FormData();
    formData.append("team_name", teamName);
    formData.append("file", file);

    try {
      const res = await axios.post(`${getApiBaseUrl()}/team/logo/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data && res.data.blob_url) {
        setSuccessState((prev) => ({ ...prev, [teamKey]: true }));
        setPreviewOverrides((prev) => ({ ...prev, [teamKey]: res.data.blob_url }));
        await refreshLogoRegistry();
        showStatus("success", `✓ ${teamName} logo updated`);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      showStatus("error", `✗ Logo upload failed: ${error.response?.data?.error?.message || error.message}`);
    } finally {
      setUploadingState((prev) => ({ ...prev, [teamKey]: false }));
    }
  };

  // ─── Player Photo Upload ───────────────────────────────────────────────────
  const handlePlayerFile = async (playerName, playerKey, file) => {
    if (!playerName) return;
    const localUrl = URL.createObjectURL(file);
    setPreviewOverrides((prev) => ({ ...prev, [playerKey]: localUrl }));
    setUploadingState((prev) => ({ ...prev, [playerKey]: true }));
    setSuccessState((prev) => ({ ...prev, [playerKey]: false }));

    const formData = new FormData();
    formData.append("player_name", playerName);
    if (playerKey) formData.append("role_key", playerKey);
    formData.append("file", file);

    try {
      const res = await axios.post(`${getApiBaseUrl()}/player/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data && res.data.blob_url) {
        setSuccessState((prev) => ({ ...prev, [playerKey]: true }));
        setPreviewOverrides((prev) => ({ ...prev, [playerKey]: res.data.blob_url }));
        await refreshPlayerRegistry();
        showStatus("success", `✓ ${playerName} photo updated`);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      showStatus("error", `✗ Upload failed for ${playerName}: ${error.response?.data?.error?.message || error.message}`);
    } finally {
      setUploadingState((prev) => ({ ...prev, [playerKey]: false }));
    }
  };

  return (
    <div id="media-uploader-section" className="media-uploader-root">

      {/* Status Banner */}
      {globalStatus && (
        <div className={`mu-status-banner ${globalStatus.type}`}>
          {globalStatus.type === "success"
            ? <CheckCircle2 size={14} />
            : <AlertCircle size={14} />}
          <span>{globalStatus.text}</span>
        </div>
      )}

      {/* ── Team Logos Section ────────────────────────────────────── */}
      <div className="mu-section">
        <div className="mu-section-header">
          <div>
            <h3 className="mu-section-title">Team Logos</h3>
            <p className="mu-section-desc">Upload logos for playing teams</p>
          </div>
        </div>

        <div className="mu-logo-grid">
          <DropZone
            id="dz-team-a"
            label={teamA}
            sublabel="Home Team"
            previewUrl={teamALogoUrl}
            initialsText={teamA}
            isCustom={teamALogoUrl && teamALogoUrl.includes("vercel-storage.com")}
            isUploading={!!uploadingState["teamA"]}
            uploadSuccess={!!successState["teamA"]}
            onFile={(file) => handleLogoFile("teamA", teamA, file)}
          />
          <DropZone
            id="dz-team-b"
            label={teamB}
            sublabel="Away Team"
            previewUrl={teamBLogoUrl}
            initialsText={teamB}
            isCustom={teamBLogoUrl && teamBLogoUrl.includes("vercel-storage.com")}
            isUploading={!!uploadingState["teamB"]}
            uploadSuccess={!!successState["teamB"]}
            onFile={(file) => handleLogoFile("teamB", teamB, file)}
          />
        </div>
      </div>

      {/* ── Player Portraits Section ─────────────────────────────────── */}
      <div className="mu-section">
        <div className="mu-section-header">
          <div>
            <h3 className="mu-section-title">On-Field Player Photos</h3>
            <p className="mu-section-desc">Upload photos for active batsmen and bowler</p>
          </div>
        </div>

        <div className="mu-player-grid">
          {playerSlots.map(({ key, label, role, data }) => {
            const actualName = data?.name || null;
            const displayName = actualName || label;
            const sublabel = actualName ? role : `${role} (Awaiting Data)`;

            const portraitUrl = previewOverrides[key] || getPlayerPortrait(data || displayName, key);
            const isCustom = portraitUrl && portraitUrl.includes("vercel-storage.com");

            return (
              <DropZone
                key={key}
                id={`dz-player-${key}`}
                label={displayName}
                sublabel={sublabel}
                previewUrl={portraitUrl}
                initialsText={displayName}
                isCustom={isCustom}
                isUploading={!!uploadingState[key]}
                uploadSuccess={!!successState[key]}
                onFile={(file) => handlePlayerFile(displayName, key, file)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
