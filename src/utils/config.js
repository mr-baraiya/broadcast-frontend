/**
 * Production & Local Environment Config Resolver
 * Automatically detects protocol (http/https -> ws/wss), domain name, and environment variables.
 */

export function getApiBaseUrl() {
  let url = import.meta.env.VITE_API_BASE_URL;
  if (url && url.trim()) {
    url = url.trim().replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    return url;
  }
  
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname || "localhost";
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${hostname}:6020`;
  }

  return "http://localhost:6020";
}

export function getWsBaseUrl() {
  let url = import.meta.env.VITE_WS_BASE_URL;
  if (url && url.trim()) {
    url = url.trim().replace(/\/+$/, "");
    if (!/^wss?:\/\//i.test(url)) {
      if (url.startsWith("http://")) {
        url = url.replace(/^http:\/\//i, "ws://");
      } else if (url.startsWith("https://")) {
        url = url.replace(/^https:\/\//i, "wss://");
      } else {
        url = `wss://${url}`;
      }
    }
    return url;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname || "localhost";
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${wsProtocol}//${hostname}:6020`;
  }

  return "ws://localhost:6020";
}
