import type { APIRoute } from "astro";
export const prerender = false;

async function refreshAccessToken(
  refreshToken: string
): Promise<string | null> {
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token;
}

export const ALL: APIRoute = async ({ params, request, cookies }) => {
  let token = cookies.get("access_token")?.value;
  const refreshToken = cookies.get("refresh_token")?.value;
  if (!token && refreshToken) {
    token = await refreshAccessToken(refreshToken);
    if (token) {
      cookies.set("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/",
        maxAge: 3600,
      });
    }
  }
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const path = Array.isArray(params.path) ? params.path.join("/") : params.path;
  const url = `https://api.spotify.com/v1/${path}${
    request.url.split(path)[1] || ""
  }`;
  const res = await fetch(url, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": request.headers.get("Content-Type") || "application/json",
    },
    body: request.method !== "GET" ? await request.text() : undefined,
  });
  return new Response(await res.text(), { status: res.status });
};
