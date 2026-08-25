import axios from "axios";
import { MOCK_MATCH_DATA } from "./mockMatchData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6020";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    "Accept": "application/json"
  }
});

export const getMatchFull = async (matchId) => {
  try {
    const res = await apiClient.get(`/match/${matchId}/full`);
    return res.data;
  } catch (err) {
    console.warn(`[API] Failed to fetch REST match data for ${matchId}, using fallback:`, err.message);
    try {
      const stateRes = await apiClient.get(`/match/${matchId}/state`);
      return stateRes.data;
    } catch (stateErr) {
      console.warn(`[API] State endpoint fallback failed. Serving development mock data.`);
      return MOCK_MATCH_DATA;
    }
  }
};

export const getLiveMatches = async () => {
  try {
    const res = await apiClient.get("/matches/live");
    return res.data;
  } catch (err) {
    console.warn("[API] Failed to fetch live matches list:", err.message);
    return { status: "success", matches: [] };
  }
};

export const getUpcomingMatches = async () => {
  try {
    const res = await apiClient.get("/matches/upcoming");
    return res.data;
  } catch (err) {
    console.warn("[API] Failed to fetch upcoming matches list:", err.message);
    return { status: "success", matches: [] };
  }
};

export const getMatchControl = async (matchId) => {
  try {
    const res = await apiClient.get(`/match/${matchId}/control`);
    return res.data;
  } catch (err) {
    return {
      status: "success",
      control: {
        showScoreboard: true,
        showPlayers: true,
        showRecentBalls: true,
        showCommentary: true,
        showVenue: true,
        layout: "DEFAULT"
      }
    };
  }
};

export const updateMatchControl = async (matchId, controlData) => {
  try {
    const res = await apiClient.post(`/match/${matchId}/control`, controlData);
    return res.data;
  } catch (err) {
    console.warn("[API] Failed to post match control update:", err.message);
    return { status: "error" };
  }
};
