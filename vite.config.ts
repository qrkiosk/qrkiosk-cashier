import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [
      zaloMiniApp(),
      react(),
      {
        name: "override-config",
        config: () => ({
          build: {
            target: "esnext",
          },
        }),
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
};
