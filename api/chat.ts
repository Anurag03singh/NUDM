import { generateChatReply, type ChatMessage } from "../lib/gemini-chat";

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  try {
    const { messages, summary } = (await request.json()) as {
      messages: ChatMessage[];
      summary: string;
    };

    const result = await generateChatReply(messages, summary, {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL,
    });

    if (result.error) {
      return Response.json({ error: result.error }, { status: result.status ?? 500 });
    }

    return Response.json({ content: result.content });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
