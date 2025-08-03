import type { MiddlewareHandler } from "astro";

const PUBLIC_ENDPOINT = import.meta.env.PUBLIC_ENDPOINT.split(" ");

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { cookies, url } = context;
  if (url.origin !== context.url.origin) {
    return next();
  }
  if (url.pathname.startsWith("/api/spotify")) {
    const accessToken = cookies.get("access_token")?.value;
    const refreshToken = cookies.get("refresh_token")?.value;

    if (!accessToken && !refreshToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
  }
  const pathname = url.pathname;
  const response = await next();

  if (response.status === 404 && !pathname.startsWith("/404")) {
    return Response.redirect(new URL("/404", url));
  }
  const isPublicRoute = PUBLIC_ENDPOINT.some((route: string) =>
    pathname.startsWith(route)
  );
  if (!isPublicRoute) {
    const accessToken = cookies.get("access_token")?.value;
    const refreshToken = cookies.get("refresh_token")?.value;
    if (!accessToken && !refreshToken) {
      return Response.redirect(new URL("/login", url));
    }
  }

  return response;
};
