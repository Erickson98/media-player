import type { APIRoute } from "astro";
export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get("access_token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ access_token: token }), {
    headers: { "Content-Type": "application/json" },
  });
};
