const TUNNEL_API_ORIGIN = 'https://fee-fascinating-zope-beast.trycloudflare.com';

function resolveApiOrigin() {
  if (import.meta.env.VITE_API_ORIGIN) return import.meta.env.VITE_API_ORIGIN;
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.pages.dev')) {
    return TUNNEL_API_ORIGIN;
  }
  return 'http://127.0.0.1:5001';
}

export const API_ORIGIN = resolveApiOrigin();
const API_BASE_URL = `${API_ORIGIN}/api/data`;

export function authUrl(path) {
  return `${API_ORIGIN}${path}`;
}

export function fileUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function patchToAPI(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `API error! status: ${response.status}`);
  }
  return response.json();
}

export async function postToAPI(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `API error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
}
