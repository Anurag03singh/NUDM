type Message = { role: "user" | "assistant"; content: string };

type Summary = {
  overall: { total: number; approved: number; rejected: number; pending: number; collection: number };
  cities: {
    city: string;
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    collection_inr: number;
  }[];
};

const cityAliases: Record<string, string> = {
  bangalore: "Bengaluru",
  delhi: "Delhi",
  mumbai: "Mumbai",
  pune: "Pune",
  chennai: "Chennai",
  hyderabad: "Hyderabad",
  ahmedabad: "Ahmedabad",
  kolkata: "Kolkata",
  jaipur: "Jaipur",
  lucknow: "Lucknow",
};

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function findCityInQuestion(q: string, cities: Summary["cities"]) {
  const lower = q.toLowerCase();
  for (const [needle, name] of Object.entries(cityAliases)) {
    if (lower.includes(needle)) return cities.find((c) => c.city === name);
  }
  return undefined;
}

function tryLocalAnswer(question: string, summaryJson: string): string | null {
  let summary: Summary;
  try {
    summary = JSON.parse(summaryJson);
  } catch {
    return null;
  }

  const q = question.toLowerCase();
  const { cities, overall } = summary;

  if (/highest|most.*collection|top.*collect/.test(q)) {
    const top = [...cities].sort((a, b) => b.collection_inr - a.collection_inr)[0];
    return `${top.city} leads on collection: ${formatINR(top.collection_inr)} (${top.total} properties).`;
  }

  if (/most.*pending/.test(q)) {
    const top = [...cities].sort((a, b) => b.pending - a.pending)[0];
    return `${top.city} has the most pending cases (${top.pending}).`;
  }

  const city = findCityInQuestion(q, cities);
  if (city) {
    if (/reject/.test(q)) return `${city.city}: ${city.rejected} rejected out of ${city.total}.`;
    if (/pending/.test(q)) return `${city.city}: ${city.pending} pending out of ${city.total}.`;
    if (/approv/.test(q) && /%|percent/.test(q)) {
      const pct = city.total ? ((city.approved / city.total) * 100).toFixed(1) : "0";
      return `${pct}% approved in ${city.city} (${city.approved}/${city.total}).`;
    }
    if (/approv/.test(q)) return `${city.city}: ${city.approved} approved out of ${city.total}.`;
    if (/collection/.test(q)) return `${city.city} collection is ${formatINR(city.collection_inr)}.`;
  }

  if (/compare/.test(q) && /pune/.test(q) && /jaipur/.test(q)) {
    const pune = cities.find((c) => c.city === "Pune");
    const jaipur = cities.find((c) => c.city === "Jaipur");
    if (pune && jaipur) {
      return `Pune: ${pune.total} registrations, ${formatINR(pune.collection_inr)} collected. Jaipur: ${jaipur.total} registrations, ${formatINR(jaipur.collection_inr)} collected.`;
    }
  }

  return null;
}

async function askGemini(messages: Message[], summary: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, summary }),
  });
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(body.error || "Chat request failed");
  return body.content as string;
}

export async function sendChatMessage(messages: Message[], summary: string) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  try {
    return await askGemini(messages, summary);
  } catch (err) {
    const local = tryLocalAnswer(lastUser, summary);
    if (local) return local;

    const msg = err instanceof Error ? err.message : "Something went wrong";
    if (msg.toLowerCase().includes("quota")) {
      throw new Error("Gemini quota hit — wait a bit, or try one of the sample questions below.");
    }
    throw err;
  }
}
