import { useScrollReveal } from "@/hooks/useScrollReveal";
import SiteHeader from "./components/SiteHeader";
import KpiSection from "./components/KpiSection";
import CityCharts from "./components/CityCharts";
import ChatBox from "./components/ChatBox";
import PageBackground from "./components/PageBackground";
import SiteFooter from "./components/SiteFooter";

export default function App() {
  useScrollReveal();

  return (
    <div
      className="h-full w-full font-geist"
      style={{
        fontFamily:
          "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
      }}
    >
      <PageBackground />

      <div className="relative z-10 h-full w-full overflow-y-auto">
        <SiteHeader />

        <main className="mx-auto max-w-7xl space-y-8 px-4 pb-20 sm:px-6 lg:px-8">
          <KpiSection />
          <CityCharts />
        </main>

        <section className="relative border-y border-white/5 bg-white/[0.02] py-24" id="chat">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="animate-on-scroll mb-10 text-center [animation:fadeSlideIn_1s_ease-out_0.1s_both]">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur">
                AI Assistant
              </span>
              <h2 className="mt-4 text-3xl font-geist tracking-tighter text-white sm:text-4xl md:text-5xl">
                Ask about the data
              </h2>
              <p className="mt-4 text-lg text-white/70 font-geist">
                Plain-English questions over the property tax summary.
              </p>
            </div>
            <ChatBox />
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
