import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Users, MapPin, Target, Shield } from "lucide-react";
import { formatStrikeRate } from "../../utils/formatScore";

export function MatchInfoCarousel({ matchData }) {
  const [slideIndex, setSlideIndex] = useState(0);

  if (!matchData) return null;

  const { statusText, venue, score, players } = matchData;

  const slides = [];

  // Slide 1: Match Situation
  if (statusText) {
    slides.push({
      id: "sit",
      icon: Shield,
      title: "MATCH SITUATION",
      content: statusText
    });
  }

  // Slide 2: Partnership
  if (score && score.partnership) {
    slides.push({
      id: "part",
      icon: Users,
      title: "CURRENT PARTNERSHIP",
      content: `${score.partnership} RUNS`
    });
  }

  // Slide 3: CRR & Target
  if (score && score.crr) {
    slides.push({
      id: "crr",
      icon: Activity,
      title: "RUN RATE",
      content: `CURRENT RUN RATE: ${score.crr}${score.target ? ` • TARGET: ${score.target}` : ""}`
    });
  }

  // Slide 4: Striker Stats
  if (players && players.striker) {
    const s = players.striker;
    slides.push({
      id: "striker",
      icon: Target,
      title: "BATSMAN ON STRIKE",
      content: `${s.name} ${s.runs} (${s.balls}b) • 4s: ${s.fours} 6s: ${s.sixes} • SR: ${formatStrikeRate(s.strike_rate)}`
    });
  }

  // Slide 5: Bowler Stats
  if (players && players.bowler) {
    const b = players.bowler;
    slides.push({
      id: "bowler",
      icon: Shield,
      title: "CURRENT BOWLER",
      content: `${b.name} ${b.wickets}-${b.runs} (${b.overs} ov) • Maidens: ${b.maidens} • Econ: ${b.economy?.toFixed(2) || "—"}`
    });
  }

  // Slide 6: Venue
  if (venue) {
    slides.push({
      id: "venue",
      icon: MapPin,
      title: "MATCH VENUE",
      content: venue
    });
  }

  // Rotate every 10 seconds predictably
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[slideIndex % slides.length];
  const IconComp = currentSlide.icon;

  return (
    <div className="broadcast-panel match-carousel-bar">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, translateY: 6 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -6 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="carousel-content-wrap"
        >
          <div className="carousel-badge">
            <IconComp size={14} className="carousel-icon" />
            <span>{currentSlide.title}</span>
          </div>
          <div className="carousel-text">{currentSlide.content}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
