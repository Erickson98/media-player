import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const albums = await fetch("/api/1CHUXwuge9A7L2KiA3vnR6.json");

  return new Response(JSON.stringify(albums), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
