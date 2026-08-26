import React from "react";
import { AlertTriangle, ArrowDown } from "lucide-react";
import { getPlayerPortrait, getTeamLogoUrl } from "../../utils/teamLogos";

export function MissingMediaAlert({ matchData }) {
  if (!matchData) return null;

  const missing = [];
  const { teams, players } = matchData;

  const teamA = teams?.teamA || teams?.batting || null;
  const teamB = teams?.teamB || teams?.bowling || null;

  if (teamA) {
    const logoA = getTeamLogoUrl(teamA);
    if (!logoA || !logoA.includes("vercel-storage.com")) {
      missing.push(`${teamA} Logo`);
    }
  }

  if (teamB) {
    const logoB = getTeamLogoUrl(teamB);
    if (!logoB || !logoB.includes("vercel-storage.com")) {
      missing.push(`${teamB} Logo`);
    }
  }

  const striker = players?.striker || players?.batsman1;
  const nonStriker = players?.nonStriker || players?.batsman2;
  const bowler = players?.bowler;

  const slots = [
    { label: "Striker", data: striker, role: "striker" },
    { label: "Non-Striker", data: nonStriker, role: "nonStriker" },
    { label: "Bowler", data: bowler, role: "bowler" }
  ];

  slots.forEach(({ label, data, role }) => {
    if (data && data.name) {
      const portrait = getPlayerPortrait(data, role);
      if (!portrait || portrait.includes("default-player.svg") || !portrait.includes("vercel-storage.com")) {
        missing.push(`${data.name} (${label})`);
      }
    }
  });

  if (missing.length === 0) return null;

  const handleScrollToUploader = () => {
    const el = document.getElementById("media-uploader-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="missing-media-top-alert">
      <div className="alert-content-wrap">
        <div className="alert-icon-box">
          <AlertTriangle size={20} color="#f59e0b" />
        </div>

        <div className="alert-text-body">
          <h4 className="alert-title">
            BROADCAST MEDIA ACTION REQUIRED — {missing.length} {missing.length === 1 ? "ASSET" : "ASSETS"} MISSING
          </h4>
          <p className="alert-desc">
            Default placeholder detected for: <strong>{missing.join(" • ")}</strong>. Upload custom high-resolution photos for optimal broadcast presentation.
          </p>
        </div>
      </div>

      <button type="button" onClick={handleScrollToUploader} className="btn-alert-upload-jump">
        <span>Upload Photos</span>
        <ArrowDown size={14} />
      </button>
    </div>
  );
}
