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
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://127.0.0.1:6020";
    }
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${window.location.host}`;
  }

  return "http://127.0.0.1:6020";
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
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "ws://127.0.0.1:6020";
    }
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${wsProtocol}//${window.location.host}`;
  }

  return "ws://127.0.0.1:6020";
}
