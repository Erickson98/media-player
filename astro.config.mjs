// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import path from "path";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  vite: {
    build: {
      minify: "esbuild",
    },
    resolve: {
      alias: {
        "@/scripts": path.resolve("./src/scripts"),
        "@models": "/src/models",
      },
    },
  },

  server: {
    host: "127.0.0.1",
    port: 4321,
  },
});
