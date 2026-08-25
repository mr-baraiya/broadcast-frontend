import axios from "axios";
import { getApiBaseUrl } from "./config";

// ─── Registries Cache ─────────────────────────────────────────────────────────
let registryCache = {};
let logoRegistryCache = {};
const registryListeners = new Set();

function notifyRegistryListeners() {
  registryListeners.forEach((fn) => {
    try { fn(); } catch (e) { /* ignore */ }
  });
}

export function subscribeRegistryUpdate(listener) {
  registryListeners.add(listener);
  return () => registryListeners.delete(listener);
}

export async function initPlayerRegistry() {
  try {
    const res = await axios.get(`${getApiBaseUrl()}/players/registry`);
    if (res.data && res.data.registry) {
      registryCache = res.data.registry;
      notifyRegistryListeners();
    }
  } catch (err) {
    console.debug("[PlayerRegistry] Backend fetch fallback active:", err.message);
  }
}

export async function initLogoRegistry() {
  try {
    const res = await axios.get(`${getApiBaseUrl()}/team/logos/registry`);
    if (res.data && res.data.registry) {
      logoRegistryCache = res.data.registry;
      notifyRegistryListeners();
    }
  } catch (err) {
    console.debug("[TeamLogoRegistry] Backend fetch fallback active:", err.message);
  }
}

initPlayerRegistry();
initLogoRegistry();

export async function refreshPlayerRegistry() {
  await initPlayerRegistry();
}

export async function refreshLogoRegistry() {
  await initLogoRegistry();
}

// ─── Team Utilities ───────────────────────────────────────────────────────────

export function getTeamInitials(teamName) {
  if (!teamName || teamName === "TEAM A" || teamName === "TEAM B") return "TM";

  const words = teamName.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return teamName.substring(0, 3).toUpperCase();
}

function normalizeTeamKey(teamName) {
  if (!teamName) return "unknown_team";
  const cleaned = teamName.trim().replace(/[^a-zA-Z0-9\s_]/g, "");
  return cleaned.toLowerCase().replace(/\s+/g, "_") || "unknown_team";
}

export function getTeamLogoUrl(teamName) {
  if (!teamName) return null;

  const key = normalizeTeamKey(teamName);

  if (logoRegistryCache[key] && logoRegistryCache[key].blob_url) {
    return logoRegistryCache[key].blob_url;
  }

  const words = key.split("_");
  const lastWord = words[words.length - 1];
  for (const [regKey, data] of Object.entries(logoRegistryCache)) {
    if (lastWord && regKey.endsWith(lastWord) && data.blob_url) {
      return data.blob_url;
    }
  }

  return null;
}

// ─── Player Portrait Utilities ────────────────────────────────────────────────

export function resolvePlayerFromRegistry(name, roleKey) {
  if (!registryCache) return null;

  if (name) {
    const cleanParts = name.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/);
    if (cleanParts.length) {
      // 1. Exact key match
      const exactKey = cleanParts.join("_");
      if (registryCache[exactKey] && registryCache[exactKey].blob_url) {
        return registryCache[exactKey].blob_url;
      }

      // 2. Initial + Last Name matching (e.g. "P Nissanka" -> "pathum_nissanka")
      if (cleanParts.length >= 2) {
        const initial = cleanParts[0][0];
        const lastName = cleanParts[cleanParts.length - 1];

        for (const [regKey, entry] of Object.entries(registryCache)) {
          const regParts = regKey.split("_");
          if (regParts.length >= 2) {
            const regFirst = regParts[0];
            const regLast = regParts[regParts.length - 1];
            if (regLast === lastName && regFirst.startsWith(initial) && entry.blob_url) {
              return entry.blob_url;
            }
          }
          if ((regKey.endsWith(`_${lastName}`) || regKey === lastName) && entry.blob_url) {
            return entry.blob_url;
          }
        }
      }

      // 3. Last name fallback match
      const lastName = cleanParts[cleanParts.length - 1];
      for (const [regKey, entry] of Object.entries(registryCache)) {
        if ((regKey.endsWith(`_${lastName}`) || regKey === lastName) && entry.blob_url) {
          return entry.blob_url;
        }
      }
    }
  }

  // 4. Role key fallback match (e.g. "striker", "nonStriker", "bowler")
  if (roleKey) {
    const rKey = roleKey.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
    if (registryCache[rKey] && registryCache[rKey].blob_url) {
      return registryCache[rKey].blob_url;
    }
  }

  return null;
}

export function getPlayerPortrait(player, roleKey) {
  if (!player && !roleKey) return "https://api.dicebear.com/7.x/avataaars/svg?seed=Player";

  const name = typeof player === "object" ? (player?.name || "") : String(player || "");

  // 1. ALWAYS check registryCache FIRST for custom Vercel Blob portrait!
  const registryUrl = resolvePlayerFromRegistry(name, roleKey);
  if (registryUrl) return registryUrl;

  // 2. Check if player object explicitly has a Vercel Blob URL
  if (typeof player === "object" && player) {
    if (player.blob_url && typeof player.blob_url === "string" && player.blob_url.startsWith("http")) {
      return player.blob_url;
    }
    if (player.image && typeof player.image === "string" && player.image.includes("vercel-storage.com")) {
      return player.image;
    }
  }

  // 3. Fallback to existing player.image if valid non-Dicebear URL
  if (typeof player === "object" && player && player.image && typeof player.image === "string" && player.image.startsWith("http")) {
    if (!player.image.includes("dicebear.com")) {
      return player.image;
    }
  }

  // 4. Default Dicebear Avatar
  const cleanParts = name ? name.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/) : [roleKey || "player"];
  const cleanKey = cleanParts.join("_") || "player";
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanKey}`;
}
