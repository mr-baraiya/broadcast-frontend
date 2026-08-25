import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { formatStrikeRate } from "../utils/formatScore";
import { getPlayerPortrait, getTeamInitials, getTeamLogoUrl } from "../utils/teamLogos";

export function BatsmanCard({ batsman, teamName = "SL", isStriker = false }) {
  const name = batsman?.name || "Batsman";
  const runs = batsman?.runs ?? 0;
  const balls = batsman?.balls ?? 0;
  const fours = batsman?.fours ?? 0;
  const sixes = batsman?.sixes ?? 0;
  const sr = formatStrikeRate(batsman?.strike_rate ?? 0, runs, balls);

  const portraitUrl = getPlayerPortrait(batsman, isStriker ? "striker" : "nonStriker");
  const initials = getTeamInitials(teamName);
  const logoUrl = getTeamLogoUrl(teamName);

  const isSriLanka = (teamName || "").toLowerCase().includes("sl") || (teamName || "").toLowerCase().includes("sri");
  const borderClass = isStriker
    ? "striker-active-glow"
    : isSriLanka
    ? "card-yellow-border"
    : "card-blue-border";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={name}
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`ref-player-card-v2 ${borderClass} ${!isStriker ? "non-striker-dim" : ""}`}
      >
        <div className="card-top-body-v2">
          {/* Circular Equal-Sized Player Portrait */}
          <div className="portrait-container-v2">
            <img
              src={portraitUrl}
              alt={name}
              className="player-portrait-img-v2"
              loading="eager"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
              }}
            />
          </div>

          <div className="player-main-info-v2">
            <div className="role-team-header-v2">
              <span className="team-flag-chip-circle-v2">
                {logoUrl ? (
                  <img src={logoUrl} alt={teamName} className="team-chip-flag-img-v2" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <Shield size={12} />
                )}
              </span>
              <span className="role-tag-clean">
                BATSMAN
              </span>
            </div>

            <div className="card-player-name-clean">{name}</div>

            <div className="card-player-score-row-v2">
              <span className="runs-giant-bold">{runs}</span>
              <span className="balls-muted-55">({balls})</span>
            </div>
          </div>
        </div>

        {/* 3-Column Centered Footer */}
        <div className="card-bottom-stat-bar-v2 grid-3-col">
          <div className="footer-stat-item">
            <span className="footer-lbl-gray">4s</span>
            <span className="footer-val-yellow">{fours}</span>
          </div>
          <div className="footer-stat-item">
            <span className="footer-lbl-gray">6s</span>
            <span className="footer-val-yellow">{sixes}</span>
          </div>
          <div className="footer-stat-item">
            <span className="footer-lbl-gray">SR</span>
            <span className="footer-val-yellow">{sr}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
