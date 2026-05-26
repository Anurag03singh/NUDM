import { Building2, CheckCircle2, IndianRupee, XCircle } from "lucide-react";
import { TENANT_OPTIONS, usePropertyData } from "@/hooks/usePropertyData";
import { formatINR } from "@/lib/analytics";

export default function KpiSection() {
  const { loading, tenant, setTenant, kpis, filtered, properties } = usePropertyData();

  const cards = [
    { label: "Registered", value: kpis.total.toLocaleString("en-IN"), icon: Building2, color: "text-blue-400" },
    { label: "Approved", value: kpis.approved.toLocaleString("en-IN"), icon: CheckCircle2, color: "text-blue-400" },
    { label: "Rejected", value: kpis.rejected.toLocaleString("en-IN"), icon: XCircle, color: "text-red-400" },
    { label: "Collection", value: formatINR(kpis.collection), icon: IndianRupee, color: "text-blue-300" },
  ];

  return (
    <section
      id="kpis"
      className="glass-panel animate-on-scroll p-6 [animation:fadeSlideIn_1s_ease-out_0.2s_both] md:p-8"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/50 font-geist">Overview</p>
          <h2 className="mt-1 text-2xl font-geist tracking-tighter text-white md:text-3xl">KPIs</h2>
        </div>
        <label className="text-sm text-white/70 font-geist">
          City
          <select
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            className="glass-input ml-2 mt-1 min-w-[11rem]"
          >
            {TENANT_OPTIONS.map((c) => (
              <option key={c} value={c} className="bg-black text-white">
                {c === "All" ? "All cities" : c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-sm text-white/50 font-geist">Loading properties.json…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.07]"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-white/60 font-geist">{card.label}</span>
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2">
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </div>
                  <p className="mt-4 text-2xl font-semibold tracking-tight text-white font-geist">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>
          {properties && (
            <p className="mt-6 text-center text-xs text-white/50 font-geist">
              {filtered.length} / {properties.length} rows
              {tenant !== "All" ? ` · ${tenant}` : ""}
            </p>
          )}
        </>
      )}
    </section>
  );
}
