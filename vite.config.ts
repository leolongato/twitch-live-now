import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import path from "path";
import fs from "fs";

function generateManifestByMode(mode: string) {
  const manifestPath =
    mode === "firefox"
      ? "manifests/manifest.firefox.json"
      : "manifests/manifest.chrome.json";

  const source = path.resolve(__dirname, manifestPath);
  const dest = path.resolve(__dirname, "public/manifest.json");

  fs.copyFileSync(source, dest);

  const manifest = readJsonFile(manifestPath);
  const pkg = readJsonFile("package.json");

  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

function fixManifestAfterBuild() {
  return {
    name: "fix-manifest-background-path",
    closeBundle() {
      const manifestPath = path.resolve(__dirname, "dist/manifest.json");
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

        if (
          manifest.background?.service_worker &&
          manifest.background.service_worker.endsWith(".ts")
        ) {
          manifest.background.service_worker =
            manifest.background.service_worker.replace(/\.ts$/, ".js");
        }

        if (
          manifest.background?.scripts &&
          manifest.background.scripts[0].endsWith(".ts")
        ) {
          manifest.background.scripts[0] =
            manifest.background.scripts[0].replace(/\.ts$/, ".js");
        }

        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log("✅ Corrigido manifest.json com background.js");
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const plugins = [
    react(),
    webExtension({
      manifest: () => generateManifestByMode(mode),
      watchFilePaths: [
        path.resolve(__dirname, `public/manifest.${mode}.json`),
        path.resolve(__dirname, "package.json"),
        path.resolve(__dirname, "src/background.ts"),
        path.resolve(__dirname, "src/main.tsx"),
        path.resolve(__dirname, "src/App.tsx"),
      ],
      disableAutoLaunch: true,
    }),
    fixManifestAfterBuild(),
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
