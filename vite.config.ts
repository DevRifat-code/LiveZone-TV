import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // CORS proxy for HLS streams
    {
      name: "cors-proxy",
      configureServer(server) {
        server.middlewares.use("/api/cors-proxy", async (req, res, next) => {
          const setCors = () => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
            res.setHeader("Access-Control-Allow-Headers", "*");
          };
          const send = (status: number, body: string, type = "text/plain") => {
            setCors();
            res.statusCode = status;
            res.setHeader("Content-Type", type);
            res.end(body);
          };
          try {
            // Handle OPTIONS preflight
            if (req.method === "OPTIONS") { setCors(); res.statusCode = 204; res.end(); return; }

            const query = new URL(req.url!, `http://${req.headers.host}`);
            const target = query.searchParams.get("url") || "";
            if (!target) { send(400, "Missing url parameter"); return; }

            console.log(`[cors-proxy] Fetching: ${target.substring(0, 80)}...`);

            const response = await fetch(target, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
                "Referer": new URL(target).origin,
                "Accept": "*/*",
              },
            });

            if (!response.ok) {
              console.error(`[cors-proxy] Upstream returned ${response.status} for ${target.substring(0, 80)}`);
              send(response.status, `Upstream error: ${response.status} ${response.statusText}`);
              return;
            }

            const contentType = response.headers.get("content-type") || "";
            const baseUrl = target.substring(0, target.lastIndexOf("/") + 1);
            const proxyBase = `/api/cors-proxy?url=`;

            // Rewrite .m3u8 playlists: proxy segment/playlist URLs too
            if (contentType.includes("m3u") || target.includes(".m3u8")) {
              let text = await response.text();
              const segmentCount = (text.match(/^[^#\n\s]/gm) || []).length;
              text = text.replace(/^([^#\n\s][^\n]*)$/gm, (line) => {
                const trimmed = line.trim();
                if (!trimmed) return line;
                const resolved = trimmed.startsWith("http")
                  ? trimmed
                  : new URL(trimmed, baseUrl).toString();
                return proxyBase + encodeURIComponent(resolved);
              });
              console.log(`[cors-proxy] Rewrote m3u8: ${segmentCount} segments proxied`);
              setCors();
              res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
              res.statusCode = response.status;
              res.end(text);
              return;
            }

            // For segments / other files: just proxy with CORS
            const buffer = Buffer.from(await response.arrayBuffer());
            console.log(`[cors-proxy] Proxied ${buffer.length} bytes (${contentType})`);
            setCors();
            res.setHeader("Content-Type", contentType);
            res.statusCode = response.status;
            res.end(buffer);
          } catch (e: any) {
            console.error(`[cors-proxy] Error:`, e.message);
            send(502, `Proxy error: ${e.message}`);
          }
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
