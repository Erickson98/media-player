export const prerender = false;
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const currentUrl = new URL(request.url);

    const code = currentUrl.searchParams.get("code");
    if (!code) return new Response("Missing code", { status: 400 });

    const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = import.meta.env.SPOTIFY_REDIRECT_URI;

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await res.json();
    if (!res.ok) return new Response(JSON.stringify(data), { status: 400 });

    const { access_token, refresh_token, expires_in } = data;
    const home = new URL("/", request.url).toString();

    const response = new Response(null, {
      status: 302,
      headers: { Location: home },
    });

    cookies.set("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: expires_in,
    });

    cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
