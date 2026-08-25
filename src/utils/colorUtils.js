export function getDeliveryStyle(event, runs) {
  const ev = (event || "").toUpperCase();
  
  if (ev === "WICKET" || ev === "W" || ev === "OUT") {
    return {
      bg: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
      color: "#ffffff",
      border: "1px solid #f87171",
      label: "W",
      shadow: "0 0 12px rgba(239, 68, 68, 0.6)"
    };
  }

  if (ev === "SIX" || runs === 6) {
    return {
      bg: "linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)",
      color: "#ffffff",
      border: "1px solid #c084fc",
      label: "6",
      shadow: "0 0 12px rgba(168, 85, 247, 0.6)"
    };
  }

  if (ev === "FOUR" || runs === 4) {
    return {
      bg: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
      color: "#000000",
      border: "1px solid #fde047",
      label: "4",
      shadow: "0 0 12px rgba(234, 179, 8, 0.6)"
    };
  }

  if (ev === "WIDE" || ev === "WD") {
    return {
      bg: "rgba(14, 165, 233, 0.3)",
      color: "#38bdf8",
      border: "1px solid rgba(56, 189, 248, 0.5)",
      label: "WD"
    };
  }

  if (ev === "NO_BALL" || ev === "NB") {
    return {
      bg: "rgba(249, 115, 22, 0.3)",
      color: "#fb923c",
      border: "1px solid rgba(251, 146, 60, 0.5)",
      label: "NB"
    };
  }

  if (runs === 0 || ev === "DOT") {
    return {
      bg: "rgba(255, 255, 255, 0.08)",
      color: "#94a3b8",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      label: "•"
    };
  }

  return {
    bg: "rgba(255, 255, 255, 0.18)",
    color: "#f8fafc",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    label: `${runs ?? ev ?? "•"}`
  };
}
