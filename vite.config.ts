import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateChatReply, type ChatMessage } from "./lib/gemini-chat";

const root = path.dirname(fileURLToPath(import.meta.url));

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
          try {
            const { messages, summary } = JSON.parse(Buffer.concat(chunks).toString()) as {
              messages: ChatMessage[];
              summary: string;
            };
            const result = await generateChatReply(messages, summary, {
              apiKey: process.env.GEMINI_API_KEY,
              model: process.env.GEMINI_MODEL,
            });

            res.setHeader("Content-Type", "application/json");
            if (result.error) {
              res.statusCode = result.status ?? 500;
              res.end(JSON.stringify({ error: result.error }));
              return;
            }
            res.statusCode = 200;
            res.end(JSON.stringify({ content: result.content }));
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
