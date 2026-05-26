import { Building2 } from "lucide-react";
import { usePropertyData } from "@/hooks/usePropertyData";
import { formatINR } from "@/lib/analytics";

export default function SiteHeader() {
  const { properties, kpis } = usePropertyData();

  return (
    <header className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mt-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-500/20 border border-blue-500/30">
              <Building2 className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white font-geist">UPYOG</span>
          </a>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-lg md:flex">
            <a href="#kpis" className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white font-geist">
              KPIs
            </a>
            <a href="#charts" className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white font-geist">
              Charts
            </a>
            <a href="#chat" className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white font-geist">
              Chat
            </a>
            <a
              href="#kpis"
              className="inline-flex cursor-pointer items-center rounded-full border border-white/20 bg-neutral-900/60 px-6 py-3 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] font-geist"
            >
              View dashboard
            </a>
          </div>
        </nav>

        <section className="relative z-10 mx-auto max-w-5xl pb-24 pt-16 text-center md:pt-32 md:pb-28">
          <h1 className="mx-auto max-w-5xl text-4xl font-geist tracking-tighter opacity-0 [animation:fadeSlideIn_1s_ease-out_0.2s_forwards] sm:text-6xl md:text-7xl">
            Property tax analytics
            <br />
            across 10 cities.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-normal text-white/70 font-geist [animation:fadeSlideIn_1s_ease-out_0.3s_both] sm:text-lg">
            Multi-tenant UPYOG dashboard — live KPIs, city comparisons, and an AI assistant on top of
            the provided JSON dataset.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 [animation:fadeSlideIn_1s_ease-out_0.4s_both] sm:flex-row">
            <a
              href="#kpis"
              className="group relative inline-flex min-w-[140px] items-center justify-center overflow-hidden rounded-full border border-neutral-600 bg-neutral-800 px-5 py-3 text-sm font-semibold tracking-tight text-neutral-400 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
            >
              Open KPIs
            </a>
            <a
              href="#chat"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-base font-medium text-white/90 backdrop-blur font-geist hover:bg-white/10"
            >
              Try the assistant
            </a>
          </div>

          {properties && (
            <dl className="mx-auto mt-14 flex max-w-xl flex-wrap justify-center gap-8 text-sm [animation:fadeSlideIn_1s_ease-out_0.5s_both]">
              <div>
                <dt className="text-white/50 font-geist">Registered</dt>
                <dd className="mt-1 text-xl font-semibold text-white">{kpis.total.toLocaleString("en-IN")}</dd>
              </div>
              <div>
                <dt className="text-white/50 font-geist">Collection</dt>
                <dd className="mt-1 text-xl font-semibold text-white">{formatINR(kpis.collection)}</dd>
              </div>
            </dl>
          )}
        </section>
      </div>
    </header>
  );
}
