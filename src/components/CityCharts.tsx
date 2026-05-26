import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { usePropertyData } from "@/hooks/usePropertyData";
import { formatINR } from "@/lib/analytics";

const axisTick = { fill: "rgba(255,255,255,0.55)", fontSize: 11 };
const gridStroke = "rgba(255,255,255,0.08)";
const tooltipStyle = {
  backgroundColor: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#fff",
};

export default function CityCharts() {
  const { cityStats, loading } = usePropertyData();
  const [view, setView] = useState<"money" | "status">("money");

  return (
    <section
      id="charts"
      className="glass-panel animate-on-scroll p-6 [animation:fadeSlideIn_1s_ease-out_0.3s_both] md:p-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/50 font-geist">Comparison</p>
          <h2 className="mt-1 text-2xl font-geist tracking-tighter text-white md:text-3xl">
            All 10 cities
          </h2>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setView("money")}
            className={`rounded-full px-4 py-2 font-geist transition ${
              view === "money"
                ? "bg-blue-500 text-white"
                : "border border-white/10 bg-white/5 text-white/70 hover:text-white"
            }`}
          >
            Collection
          </button>
          <button
            type="button"
            onClick={() => setView("status")}
            className={`rounded-full px-4 py-2 font-geist transition ${
              view === "status"
                ? "bg-blue-500 text-white"
                : "border border-white/10 bg-white/5 text-white/70 hover:text-white"
            }`}
          >
            Status split
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-72 animate-pulse rounded-xl bg-white/5" />
      ) : view === "money" ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityStats} margin={{ bottom: 50 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
              <XAxis dataKey="city" angle={-25} textAnchor="end" height={50} interval={0} tick={axisTick} />
              <YAxis tick={axisTick} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v: number) => formatINR(v)} contentStyle={tooltipStyle} />
              <Bar dataKey="collection" fill="#3b82f6" name="Collection" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityStats} margin={{ bottom: 50 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
              <XAxis dataKey="city" angle={-25} textAnchor="end" height={50} interval={0} tick={axisTick} />
              <YAxis tick={axisTick} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }} />
              <Bar dataKey="approved" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#eab308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
