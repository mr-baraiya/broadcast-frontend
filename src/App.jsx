import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { LiveBroadcast } from "./pages/LiveBroadcast";
import { ControlPanel } from "./pages/ControlPanel";
import "./styles/broadcast.css";
import "./styles/animations.css";
import "./styles/dashboard.css";
import "./styles/control.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/live/:matchId" element={<LiveBroadcast />} />
        <Route path="/control/:matchId" element={<ControlPanel />} />
        <Route path="/live" element={<LiveBroadcast />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
