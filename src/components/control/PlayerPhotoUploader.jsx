import React, { useState } from "react";
import axios from "axios";
import { Upload, Check, Image as ImageIcon, Loader2 } from "lucide-react";
import { getPlayerPortrait } from "../../utils/teamLogos";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6020";

export function PlayerPhotoUploader({ matchData, onRefresh }) {
  const [uploadingState, setUploadingState] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);

  if (!matchData || !matchData.players) return null;

  const { players } = matchData;
  const activePlayers = [
    { key: "striker", label: "Striker", data: players.batsman1 },
    { key: "nonStriker", label: "Non-Striker", data: players.batsman2 },
    { key: "bowler", label: "Bowler", data: players.bowler }
  ].filter((item) => item.data && item.data.name);

  const handleFileUpload = async (playerName, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingState((prev) => ({ ...prev, [playerName]: true }));
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("player_name", playerName);
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE_URL}/player/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data && response.data.blob_url) {
        setStatusMessage({
          type: "success",
          text: `Uploaded 600x800 WebP for '${playerName}' to Vercel Blob!`
        });
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Failed to upload player photo:", error);
      setStatusMessage({
        type: "error",
        text: `Upload failed for '${playerName}': ${error.response?.data?.error?.message || error.message}`
      });
    } finally {
      setUploadingState((prev) => ({ ...prev, [playerName]: false }));
    }
  };

  return (
    <div className="control-panel-section">
      <div className="section-title-wrap">
        <h3>Player Photos</h3>
      </div>
      <p className="section-desc">Manage or upload custom 600x800 WebP portraits directly to Vercel Blob.</p>

      {statusMessage && (
        <div className={`uploader-status-msg ${statusMessage.type}`}>
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="player-photos-grid">
        {activePlayers.map(({ key, label, data }) => {
          const playerName = data.name;
          const portraitUrl = getPlayerPortrait(playerName);
          const isBlob = portraitUrl.includes("vercel-storage.com");
          const isUploading = !!uploadingState[playerName];

          return (
            <div key={key} className="player-photo-card">
              <div className="player-photo-preview">
                <img src={portraitUrl} alt={playerName} className="portrait-img-thumb" />
                <span className={`blob-chip ${isBlob ? "ready" : "pending"}`}>
                  {isBlob ? "● Vercel Blob Ready" : "○ Default Avatar"}
                </span>
              </div>

              <div className="player-photo-info">
                <span className="player-role-badge">{label}</span>
                <span className="player-card-name">{playerName}</span>
                <span className="player-card-stats">
                  {key === "bowler"
                    ? `${data.wickets || 0}/${data.runs || 0} (${data.overs || 0} ov)`
                    : `${data.runs || 0} (${data.balls || 0}b)`}
                </span>
              </div>

              <div className="player-photo-action">
                <label className={`btn-upload-photo ${isUploading ? "disabled" : ""}`}>
                  {isUploading ? (
                    <>
                      <Loader2 size={13} className="spin-icon" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={13} />
                      <span>Upload Photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploading}
                    onChange={(e) => handleFileUpload(playerName, e)}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
