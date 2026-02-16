import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      // Proxy sitemap.xml requests to your API during development
      "/sitemap.xml": {
        target: "https://api.clindoeilstore.ovh",
        changeOrigin: true,
      },
    },
  },
});
