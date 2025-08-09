// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import path from "path";
import react from "@astrojs/react";


// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  adapter: node({ mode: "standalone" }),
  vite: {
    resolve: {
      alias: {
        "@/scripts": path.resolve("./src/scripts"),
        "@models": "/src/models",
      },
    },
  },
});
