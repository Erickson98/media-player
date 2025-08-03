import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  const { access_token } = await request.json();

  if (!access_token) {
    return new Response(JSON.stringify({ error: "Missing token" }), {
      status: 400,
    });
  }

  cookies.set("access_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 3600,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
