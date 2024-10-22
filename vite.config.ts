import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import path from "path";

function generateManifest() {
  const manifest = readJsonFile("public/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

export default defineConfig(({ command }) => {
  const plugins = [
    react(),
    command === "build" &&
      webExtension({
        manifest: generateManifest,
      }),
  ];

  return {
    plugins,
    build: {
      watch: {
        include: [path.resolve("./src/**")],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
