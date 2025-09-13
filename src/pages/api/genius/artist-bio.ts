import type { APIRoute } from "astro";

const KEY = import.meta.env.LASTFM_API_KEY!;
const GENIUS_TOKEN = import.meta.env.GENIUS_ACCESS_TOKEN!;

export const GET: APIRoute = async ({ url }) => {
  const q = url.searchParams.get("q")?.trim();
  const full = url.searchParams.get("full") === "1";
  const lang = url.searchParams.get("lang") ?? "es";

  if (!q) return json({ error: "Missing q" }, 400);

  let data = await fetchInfo(q, lang);
  let payload = extractBio(data, full);

  if (!payload?.bio) {
    data = await fetchInfo(q, "en");
    payload = extractBio(data, full);
  }

  if (!payload?.bio) return json({ error: "Bio not found" }, 404);

  if (!payload.image || isPlaceholder(payload.image)) {
    const genius = await fetchGenius(q);
    if (genius?.image) {
      payload.image = genius.image;
      payload.source = "genius";
    } else {
      payload.image = makePlaceholder(payload.title);
      payload.source = "placeholder";
    }
  } else {
    payload.source = "lastfm";
  }

  return json(payload);
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

async function fetchGenius(query: string) {
  const url = `https://api.genius.com/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${GENIUS_TOKEN}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const hit = data?.response?.hits?.[0]?.result;
  if (!hit) return null;

  return {
    title: hit.primary_artist.name,
    url: hit.primary_artist.url ?? hit.url,
    image: hit.primary_artist.image_url || hit.song_art_image_url,
    header: hit.primary_artist.header_image_url,
  };
}

function isPlaceholder(url: string) {
  return url.includes("2a96cbd8b46e442fc41c2b86b821562f.png");
}

function makePlaceholder(name: string) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return `data:image/svg+xml;utf8,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
        d="m13.363 10.474-.521.625a2.499 2.499 0 0 0 .67 3.766l.285.164a5.998 5.998 0 0 1 1.288-1.565l-.573-.33a.5.5 0 0 1-.134-.754l.52-.624a7.372 7.372 0 0 0 1.837-4.355 7.221 7.221 0 0 0-.29-2.489 5.646 5.646 0 0 0-3.116-3.424A5.771 5.771 0 0 0 6.753 2.87a5.7 5.7 0 0 0-1.19 2.047 7.22 7.22 0 0 0-.29 2.49 7.373 7.373 0 0 0 1.838 4.355l.518.622a.5.5 0 0 1-.134.753L3.5 15.444a5 5 0 0 0-2.5 4.33v2.231h13.54a5.981 5.981 0 0 1-1.19-2H3v-.23a3 3 0 0 1 1.5-2.6l3.995-2.308a2.5 2.5 0 0 0 .67-3.766l-.521-.625a5.146 5.146 0 0 1-1.188-4.918 3.71 3.71 0 0 1 .769-1.334 3.769 3.769 0 0 1 5.556 0c.346.386.608.84.768 1.334.157.562.22 1.146.187 1.728a5.379 5.379 0 0 1-1.373 3.188Zm7.641-1.173a1 1 0 0 0-1 1v4.666h-1a3 3 0 1 0 3 3v-7.666a.999.999 0 0 0-1.003-1h.003Zm-1 8.666a1 1 0 1 1-1-1h1v1Z" />
    </svg>`;
}
