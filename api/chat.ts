import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateChatReply, type ChatMessage } from "../lib/gemini-chat";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  try {
    const { messages, summary } = req.body as { messages: ChatMessage[]; summary: string };
    const result = await generateChatReply(messages, summary, {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL,
    });

    if (result.error) {
      res.status(result.status ?? 500).json({ error: result.error });
      return;
    }

    res.status(200).json({ content: result.content });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Server error" });
  }
}
