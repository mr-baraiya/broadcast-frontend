import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Target, Shield } from "lucide-react";
import { formatStrikeRate } from "../utils/formatScore";
import { getPlayerPortrait, getTeamInitials } from "../utils/teamLogos";

export function BatsmanCard({ batsman, teamName = "SL", isStriker = false }) {
  const name = batsman?.name || "Batsman";
  const runs = batsman?.runs ?? 0;
  const balls = batsman?.balls ?? 0;
  const fours = batsman?.fours ?? 0;
  const sixes = batsman?.sixes ?? 0;
  const sr = formatStrikeRate(batsman?.strike_rate ?? 0);

  const portraitUrl = getPlayerPortrait(batsman);
  const initials = getTeamInitials(teamName);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={name}
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`ref-player-card ${isStriker ? "striker" : ""}`}
      >
        <div className="card-top-body">
          {/* Player Portrait Cutout */}
          <div className="portrait-container">
            <img src={portraitUrl} alt={name} className="player-portrait-img" loading="eager" />
          </div>

          <div className="player-main-info">
            <div className="role-team-header">
              <span className="team-flag-chip">
                <Shield size={12} />
                <span>{initials}</span>
              </span>
              <span className={`role-tag ${isStriker ? "striker-tag" : ""}`}>
                {isStriker ? (
                  <>
                    <Zap size={11} className="tag-icon" /> STRIKER
                  </>
                ) : (
                  "NON-STRIKER"
                )}
              </span>
            </div>

            <div className="card-player-name">{name}</div>

            <div className="card-player-score">
              <span className="runs-bold">{runs}</span>
              <span className="balls-muted">({balls}b)</span>
              {isStriker && <Target size={14} className="bats-icon" />}
            </div>
          </div>
        </div>

        {/* Bottom Black Stat Pill Bar */}
        <div className="card-bottom-stat-bar">
          <span>4s: <strong className="stat-highlight">{fours}</strong></span>
          <span>6s: <strong className="stat-highlight">{sixes}</strong></span>
          <span>SR: <strong className="stat-white">{sr}</strong></span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
