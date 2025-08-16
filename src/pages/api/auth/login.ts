import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.SPOTIFY_REDIRECT_URI;
  const scope =
    "user-library-read user-read-email streaming user-read-email user-read-private user-modify-playback-state user-top-read";

  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("redirect_uri", redirectUri);
  url.searchParams.append("scope", scope);
  return Response.redirect(url.toString(), 302);
};
