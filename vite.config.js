import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleCoinGeckoRequest } from "./api/coingeckoHandler.js";

const coingeckoDevMiddleware = (env) => ({
  name: "coingecko-dev-api",
  configureServer(server) {
    server.middlewares.use("/api/coingecko", async (req, res) => {
      if (req.method !== "GET") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed" }));
        return;
      }

      const url = new URL(req.url, "http://localhost");
      const requestedPath = url.searchParams.get("path");
      const query = Object.fromEntries(
        [...url.searchParams.entries()].filter(([key]) => key !== "path")
      );

      const result = await handleCoinGeckoRequest(requestedPath, query, env);

      res.statusCode = result.status;
      res.setHeader("Content-Type", "application/json");

      if (result.raw) {
        res.end(result.body);
        return;
      }

      res.end(JSON.stringify(result.body));
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), coingeckoDevMiddleware(env)],
    base: "/",
    preview: {
      // Serve SPA + allow API-less preview; E2E mocks network in Cypress
      port: 4173,
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.js",
      pool: "forks",
    },
  };
});
