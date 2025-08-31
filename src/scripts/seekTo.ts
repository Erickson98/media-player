import { getSpotifyToken } from "src/utils/get-spotify-token";
import { refreshPanel } from "./refreshPanel";

export async function seekTo(positionMs: number, deviceId = null) {
  const token = await getSpotifyToken();
  const url = new URL("https://api.spotify.com/v1/me/player/seek");
  url.searchParams.set("position_ms", positionMs.toString());
  if (deviceId) url.searchParams.set("device_id", deviceId);

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Seek failed: " + res.status);
  }

  // Recalcular estado y reprogramar refresh
  await refreshPanel();
}
