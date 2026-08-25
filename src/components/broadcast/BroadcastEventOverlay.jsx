import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Flame, Trophy, AlertTriangle } from "lucide-react";

export function BroadcastEventOverlay({ activeEvent }) {
  if (!activeEvent) return null;

  const { type, title, text, data } = activeEvent;

  const getEventStyle = () => {
    switch (type) {
      case "WICKET":
        return {
          bg: "linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(185, 28, 28, 0.98) 100%)",
          border: "2px solid #f87171",
          shadow: "0 0 40px rgba(239, 68, 68, 0.8)",
          icon: AlertTriangle,
          textColor: "#ffffff",
          accentColor: "#fef2f2"
        };
      case "SIX":
        return {
          bg: "linear-gradient(135deg, rgba(168, 85, 247, 0.95) 0%, rgba(126, 34, 206, 0.98) 100%)",
          border: "2px solid #c084fc",
          shadow: "0 0 40px rgba(168, 85, 247, 0.8)",
          icon: Flame,
          textColor: "#ffffff",
          accentColor: "#fef08a"
        };
      case "FOUR":
        return {
          bg: "linear-gradient(135deg, rgba(234, 179, 8, 0.95) 0%, rgba(202, 138, 4, 0.98) 100%)",
          border: "2px solid #fde047",
          shadow: "0 0 40px rgba(234, 179, 8, 0.8)",
          icon: Zap,
          textColor: "#000000",
          accentColor: "#000000"
        };
      case "MILESTONE":
        return {
          bg: "linear-gradient(135deg, rgba(56, 189, 248, 0.95) 0%, rgba(3, 105, 161, 0.98) 100%)",
          border: "2px solid #38bdf8",
          shadow: "0 0 40px rgba(56, 189, 248, 0.8)",
          icon: Trophy,
          textColor: "#ffffff",
          accentColor: "#fde047"
        };
      default:
        return {
          bg: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)",
          border: "2px solid #facc15",
          shadow: "0 0 30px rgba(250, 204, 21, 0.5)",
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
        initial={{ opacity: 0, scale: 0.8, translateY: -20 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        exit={{ opacity: 0, scale: 0.9, translateY: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          background: style.bg,
          border: style.border,
          boxShadow: style.shadow,
          borderRadius: "16px",
          padding: "1.5rem 3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          pointerEvents: "none",
          minWidth: "420px",
          textAlign: "center"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <IconComponent size={36} color={style.textColor} />
          <span
            style={{
              fontSize: "3rem",
              fontWeight: 900,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: style.textColor,
              lineHeight: 1
            }}
          >
            {title}
          </span>
        </div>

        {text && (
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: style.accentColor,
              maxWidth: "480px"
            }}
          >
            {text}
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
