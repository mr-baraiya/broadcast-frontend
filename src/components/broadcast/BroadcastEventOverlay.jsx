import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Flame, AlertTriangle, Plus } from "lucide-react";

export function BroadcastEventOverlay({ activeEvent }) {
  if (!activeEvent) return null;

  const { type, title, text } = activeEvent;

  const getEventStyle = () => {
    switch (type) {
      case "WICKET":
        return {
          bg: "linear-gradient(135deg, rgba(220, 38, 38, 0.98) 0%, rgba(153, 27, 27, 0.98) 100%)",
          border: "2px solid #ef4444",
          shadow: "0 0 35px rgba(239, 68, 68, 0.85)",
          icon: AlertTriangle,
          textColor: "#ffffff",
          accentColor: "#fef2f2"
        };
      case "SIX":
        return {
          bg: "linear-gradient(135deg, rgba(147, 51, 234, 0.98) 0%, rgba(107, 33, 168, 0.98) 100%)",
          border: "2px solid #c084fc",
          shadow: "0 0 35px rgba(168, 85, 247, 0.85)",
          icon: Flame,
          textColor: "#ffffff",
          accentColor: "#fef08a"
        };
      case "FOUR":
        return {
          bg: "linear-gradient(135deg, rgba(234, 179, 8, 0.98) 0%, rgba(202, 138, 4, 0.98) 100%)",
          border: "2px solid #fde047",
          shadow: "0 0 35px rgba(234, 179, 8, 0.85)",
          icon: Zap,
          textColor: "#000000",
          accentColor: "#000000"
        };
      case "RUNS":
        return {
          bg: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)",
          border: "2px solid #38bdf8",
          shadow: "0 0 24px rgba(56, 189, 248, 0.6)",
          icon: Plus,
          textColor: "#38bdf8",
          accentColor: "#ffffff"
        };
      default:
        return {
          bg: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)",
          border: "2px solid #facc15",
          shadow: "0 0 25px rgba(250, 204, 21, 0.5)",
          icon: Zap,
          textColor: "#ffffff",
          accentColor: "#facc15"
        };
    }
  };

  const style = getEventStyle();
  const IconComponent = style.icon;

  return (
    <AnimatePresence>
      <motion.div
        key={type + title}
        initial={{ opacity: 0, scale: 0.85, translateY: -15 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        exit={{ opacity: 0, scale: 0.9, translateY: 15 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "13.5%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 120,
          background: style.bg,
          border: style.border,
          boxShadow: style.shadow,
          borderRadius: "30px",
          padding: type === "RUNS" ? "0.4rem 1.4rem" : "0.6rem 2.2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          pointerEvents: "none",
          textAlign: "center"
        }}
      >
        <IconComponent size={type === "RUNS" ? 20 : 26} color={style.textColor} />
        <span
          style={{
            fontSize: type === "RUNS" ? "1.4rem" : "2rem",
            fontWeight: 900,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: style.textColor,
            lineHeight: 1
          }}
        >
          {title}
        </span>
        {text && type !== "RUNS" && (
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: style.accentColor,
              marginLeft: "0.6rem"
            }}
          >
            {text}
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
