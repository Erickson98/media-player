import type { APIRoute } from "astro";

const KEY = import.meta.env.LASTFM_API_KEY!;

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get("q")?.trim();
  const full = url.searchParams.get("full") === "1";
  const lang = url.searchParams.get("lang") ?? "es";

  if (!q) return json({ error: "Missing q" }, 400);

  const dataEs = await fetchInfo(q, lang);
  let payload = extractBio(dataEs, full);
  if (!payload?.bio) {
    const dataEn = await fetchInfo(q, "en");
    payload = extractBio(dataEn, full);
  }

  if (!payload?.bio) return json({ error: "Bio not found" }, 404);
  return json({ source: "lastfm", ...payload });
};

async function fetchInfo(name: string, lang: string) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
    name
  )}&api_key=${KEY}&format=json&autocorrect=1&lang=${lang}`;
  const r = await fetch(url, { headers: { "User-Agent": "astro-app/1.0" } });
  if (!r.ok) return null;
  return r.json();
}

function extractBio(d: any, full = false) {
  const a = d?.artist;
  if (!a) return null;
  const html = full ? a?.bio?.content : a?.bio?.summary;
  const bio = stripHtml(html || "");
  const image =
    a?.image?.find((i: any) => i.size === "extralarge")?.["#text"] || null;
  return { title: a.name, bio, url: a.url, image };
}

function stripHtml(s: string) {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/\s+Leer más.*$/i, "")
    .trim();
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
