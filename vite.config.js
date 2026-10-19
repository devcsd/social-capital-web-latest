import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget =
    env.VITE_API_PROXY_TARGET || new URL(env.VITE_API_BASE_URL).origin;

  return {
    plugins: [react()],
    assetsInclude: ["**/*.lottie"],
    server: {
      // The API's CORS whitelist doesn't include localhost, so in dev we
      // proxy /api through Vite and drop the browser's Origin header.
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.removeHeader("origin");
              proxyReq.removeHeader("referer");
            });
          },
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
