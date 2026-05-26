export default function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-lg font-semibold text-white font-geist">UPYOG Property Tax</p>
            <p className="mt-4 max-w-md text-sm text-white/70 font-geist">
              Dashboard built for the NUDM assessment. Data loads from properties.json — no separate
              backend.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight font-geist">Sections</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <a href="#kpis" className="font-geist hover:text-white">
                  KPIs
                </a>
              </li>
              <li>
                <a href="#charts" className="font-geist hover:text-white">
                  Charts
                </a>
              </li>
              <li>
                <a href="#chat" className="font-geist hover:text-white">
                  Chat
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs text-white/50 font-geist">© {new Date().getFullYear()} UPYOG · NUDM</p>
        </div>
      </div>
    </footer>
  );
}
