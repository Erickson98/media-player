export async function getSpotifyToken() {
  const res = await fetch("/spotify/token", {
    credentials: "same-origin",
  });

  if (res.status === 401) {
    window.location.assign("/login");
    return null;
  }

  const contentType = res.headers.get("Content-Type") || "";
  if (!contentType.includes("application/json")) {
    window.location.assign("/login");
    return null;
  }

  const { access_token } = await res.json();
  return access_token ?? null;
}
