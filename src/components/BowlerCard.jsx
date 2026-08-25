import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleDot, Shield } from "lucide-react";
import { getPlayerPortrait, getTeamInitials } from "../utils/teamLogos";

export function BowlerCard({ bowler, teamName = "IND" }) {
  const name = bowler?.name || "Bowler";
  const wickets = bowler?.wickets ?? 0;
  const runs = bowler?.runs ?? 0;
  const overs = bowler?.overs ?? 0;
  const maidens = bowler?.maidens ?? 0;
  const econ = bowler?.economy !== null && bowler?.economy !== undefined ? bowler.economy.toFixed(2) : "—";

  const portraitUrl = getPlayerPortrait(bowler, "bowler");
  const initials = getTeamInitials(teamName);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={name}
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="ref-player-card bowler"
      >
        <div className="card-top-body">
          {/* Player Portrait Cutout */}
          <div className="portrait-container">
            <img
              src={portraitUrl}
              alt={name}
              className="player-portrait-img"
              loading="eager"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
              }}
            />
          </div>

          <div className="player-main-info">
            <div className="role-team-header">
              <span className="team-flag-chip">
                <Shield size={12} />
                <span>{initials}</span>
              </span>
              <span className="role-tag bowler">
                <CircleDot size={11} className="tag-icon" /> BOWLER
              </span>
            </div>

            <div className="card-player-name">{name}</div>

            <div className="card-player-score bowler-color">
              <span className="runs-bold">{wickets}/{runs}</span>
              <span className="balls-muted">({overs} ov)</span>
            </div>
          </div>
        </div>

        {/* Bottom Black Stat Pill Bar */}
        <div className="card-bottom-stat-bar">
          {maidens > 0 && <span>M: <strong className="stat-white">{maidens}</strong></span>}
          <span>Econ: <strong className="stat-highlight">{econ}</strong></span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
