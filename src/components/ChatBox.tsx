import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { usePropertyData } from "@/hooks/usePropertyData";
import { sendChatMessage } from "@/lib/chat";

type ChatMessage = { role: "user" | "assistant"; content: string };

const samples = [
  "Which city has the highest total collection?",
  "How many properties are rejected in Mumbai?",
  "What percentage of Delhi properties are approved?",
];

export default function ChatBox() {
  const { summaryForChat } = usePropertyData();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Ask me about the property data — totals, cities, approval rates, etc." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function onSend(text: string) {
    const question = text.trim();
    if (!question || busy || !summaryForChat) return;

    const updated = [...messages, { role: "user", content: question }];
    setMessages(updated);
    setInput("");
    setBusy(true);

    try {
      const answer = await sendChatMessage(updated, summaryForChat);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (e) {
      const err = e instanceof Error ? e.message : "Failed to get a reply";
      setMessages((prev) => [...prev, { role: "assistant", content: err }]);
    } finally {
      setBusy(false);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }
  }

  return (
    <div className="animate-on-scroll rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl sm:p-8 [animation:fadeSlideIn_1s_ease-out_0.2s_both]">
      <div
        ref={listRef}
        className="mb-4 max-h-64 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-4"
      >
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span
              className={`inline-block max-w-[90%] rounded-lg px-3 py-2 text-sm font-geist ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "border border-white/10 bg-neutral-900/80 text-white/90"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
        {busy && <p className="text-xs text-white/50 font-geist">…</p>}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {samples.map((s) => (
          <button
            key={s}
            type="button"
            disabled={busy}
            onClick={() => onSend(s)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 font-geist hover:bg-white/10 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSend(input);
        }}
      >
        <input
          className="glass-input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question"
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="inline-flex items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500 px-4 py-3 text-white hover:bg-blue-400 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
