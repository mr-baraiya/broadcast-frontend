import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { calculateEconomy } from "../utils/formatScore";
import { getPlayerPortrait, getTeamInitials, getTeamLogoUrl } from "../utils/teamLogos";

export function BowlerCard({ bowler, teamName = "IND" }) {
  const name = bowler?.name || "Bowler";
  const wickets = bowler?.wickets ?? 0;
  const runs = bowler?.runs ?? 0;
  const overs = bowler?.overs ?? 0;
  const maidens = bowler?.maidens ?? 0;
  const econ = calculateEconomy(runs, overs);

  const portraitUrl = getPlayerPortrait(bowler, "bowler");
  const initials = getTeamInitials(teamName);
  const logoUrl = getTeamLogoUrl(teamName);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={name}
        initial={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        exit={{ opacity: 0, translateY: -10 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="ref-player-card-v2 card-blue-border non-striker-dim"
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
              <span className="role-tag-clean bowler">
                BOWLER
              </span>
            </div>

            <div className="card-player-name-clean">{name}</div>

            <div className="card-player-score-row-v2 bowler-color">
              <span className="runs-giant-bold">{wickets}/{runs}</span>
              <span className="balls-muted-55">({overs})</span>
            </div>
          </div>
        </div>

        {/* 2-Column Centered Footer */}
        <div className="card-bottom-stat-bar-v2 grid-2-col">
          <div className="footer-stat-item">
            <span className="footer-lbl-gray">MAT</span>
            <span className="footer-val-yellow">{maidens || 4}</span>
          </div>
          <div className="footer-stat-item">
            <span className="footer-lbl-gray">ECONOMY</span>
            <span className="footer-val-yellow">{econ}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
