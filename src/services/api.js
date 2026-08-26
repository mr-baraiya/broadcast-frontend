import axios from "axios";
import { getApiBaseUrl } from "../utils/config";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20000,
  headers: {
    "Accept": "application/json"
  }
});


export const getMatchFull = async (matchId) => {
  try {
    const res = await apiClient.get(`/match/${matchId}/full`);
    return res.data;
  } catch (err) {
    console.warn(`[API] Primary full endpoint error for ${matchId}, trying state endpoint:`, err.message);
    const stateRes = await apiClient.get(`/match/${matchId}/state`);
    return stateRes.data;
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

export const getRecentMatches = async () => {
  try {
    const res = await apiClient.get("/matches/recent");
    return res.data;
  } catch (err) {
    console.warn("[API] Failed to fetch recent matches list:", err.message);
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
