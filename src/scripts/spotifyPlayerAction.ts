import { getSpotifyToken } from "../utils/get-spotify-token";

type PlayOptions = {
  deviceId?: string | null;
  context_uri?: string;
  uris?: string[] | null;
  offset?: number | { uri: string };
  position_ms?: number;
};

export async function spotifyPlayerAction(
  action: "play" | "pause" | "next" | "previous",
  {
    deviceId = null,
    context_uri = undefined,
    uris = null,
    offset,
    position_ms,
  }: PlayOptions = {}
) {
  const token = await getSpotifyToken();
  let url = "";
  let method: "PUT" | "POST" = "PUT";
  let body: any = null;

  if (!deviceId && action === "play") {
    deviceId = await getActiveOrFirstDeviceId(token);
  }

  switch (action) {
    case "play": {
      url = `https://api.spotify.com/v1/me/player/play${
        deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : ""
      }`;

      const payload: Record<string, any> = {};
      if (context_uri) payload.context_uri = context_uri;
      if (uris?.length) payload.uris = uris;

      if (typeof offset !== "undefined") {
        payload.offset =
          typeof offset === "number" ? { position: offset } : offset;
      }

      if (typeof position_ms === "number") {
        payload.position_ms = position_ms;
      }

      body = Object.keys(payload).length ? JSON.stringify(payload) : null;
      break;
    }

    case "pause":
      url = "https://api.spotify.com/v1/me/player/pause";
      break;

    case "next":
      url = "https://api.spotify.com/v1/me/player/next";
      method = "POST";
      break;

    case "previous":
      url = "https://api.spotify.com/v1/me/player/previous";
      method = "POST";
      break;

    default:
      throw new Error(`Acción desconocida: ${action as string}`);
  }

  const res = await fetch(url, {
    method,
    body,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 204) {
    console.log(`✅ Acción ${action} ejecutada correctamente`);
    return { ok: true };
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch (_) {
    /* ignore */
  }
  console.error(`❌ Acción ${action} falló:`, data || res.statusText);
  return { ok: false, status: res.status, error: data || res.statusText };
}

async function getActiveOrFirstDeviceId(
  token: string
): Promise<string | undefined> {
  const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return undefined;
  const json = await res.json();
  const devices: Array<{ id: string; is_active: boolean }> =
    json?.devices || [];
  return devices.find((d) => d.is_active)?.id || devices[0]?.id || undefined;
}
