import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const models = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
].filter(Boolean) as string[];

function chatApiPlugin(): Plugin {
  return {
    name: "chat-api",
    configureServer(server) {
      server.middlewares.use("/api/chat", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }

        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", async () => {
          const key = process.env.GEMINI_API_KEY;
          if (!key) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Add GEMINI_API_KEY to .env" }));
            return;
          }

          try {
            const { messages, summary } = JSON.parse(Buffer.concat(chunks).toString());
            const system = `You answer questions about UPYOG property tax data for 10 Indian cities. Use only this summary. Be short. Use INR.\n\n${summary}`;
            const contents = messages.slice(-8).map((m: { role: string; content: string }) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            }));

            let lastErr = "Model error";
            for (const model of models) {
              const r = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    systemInstruction: { parts: [{ text: system }] },
                    contents,
                  }),
                },
              );
              const json = await r.json();
              if (r.ok) {
                const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ content: text || "No answer." }));
                return;
              }
              lastErr = json.error?.message || lastErr;
              if (r.status !== 429 && !String(lastErr).toLowerCase().includes("quota")) break;
            }

            res.statusCode = 429;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: lastErr }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: e instanceof Error ? e.message : "Server error" }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.GEMINI_API_KEY ??= env.GEMINI_API_KEY;
  process.env.GEMINI_MODEL ??= env.GEMINI_MODEL;

  return {
    resolve: { alias: { "@": path.resolve(root, "src") } },
    plugins: [react(), tailwindcss(), chatApiPlugin()],
    optimizeDeps: {
      include: ["unicornstudio-react"],
    },
    server: { port: 5173 },
  };
});
