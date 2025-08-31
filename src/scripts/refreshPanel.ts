import { getSpotifyToken } from "src/utils/get-spotify-token";

let lastProgress = 0;
let lastTrackId: number | null = null;

async function fetchState(token: string | null = null) {
  if (token === null) {
    token = await getSpotifyToken();
  }
  const res = await fetch("https://api.spotify.com/v1/me/player", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204) return null;
  if (!res.ok) throw new Error("No se pudo obtener estado");

  return res.json();
}

export async function refreshPanel(token: string | null = null) {
  const state = await fetchState(token);
  if (!state?.item) return;

  const currentTrackId = state.item.id;
  const currentProgress = state.progress_ms;

  const trackChanged = currentTrackId !== lastTrackId;
  const jumped = Math.abs(currentProgress - lastProgress) > 5000; // 5s tolerancia

  if (trackChanged || jumped) {
    // renderNowPlaying(state.item); here i going to dispatch the events
    clearTimeout(window.nextRefresh);

    const remaining = state.item.duration_ms - state.progress_ms;
    window.nextRefresh = setTimeout(refreshPanel, remaining + 1000);

    lastTrackId = currentTrackId;
  }

  lastProgress = currentProgress;
}

setInterval(refreshPanel, 10000);
refreshPanel();
