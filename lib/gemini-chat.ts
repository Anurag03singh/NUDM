export type ChatMessage = { role: string; content: string };

export type GeminiChatEnv = {
  apiKey?: string;
  model?: string;
};

function modelList(env: GeminiChatEnv): string[] {
  return [env.model, "gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-1.5-flash"].filter(
    Boolean,
  ) as string[];
}

export async function generateChatReply(
  messages: ChatMessage[],
  summary: string,
  env: GeminiChatEnv,
): Promise<{ content?: string; error?: string; status?: number }> {
  const key = env.apiKey?.trim();
  if (!key) {
    return { error: "Add GEMINI_API_KEY to environment variables", status: 500 };
  }

  const system = `You answer questions about UPYOG property tax data for 10 Indian cities. Use only this summary. Be short. Use INR.\n\n${summary}`;
  const contents = messages.slice(-8).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let lastErr = "Model error";
  for (const model of modelList(env)) {
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
      return { content: text || "No answer." };
    }
    lastErr = json.error?.message || lastErr;
    if (r.status !== 429 && !String(lastErr).toLowerCase().includes("quota")) break;
  }

  return { error: lastErr, status: 429 };
}
