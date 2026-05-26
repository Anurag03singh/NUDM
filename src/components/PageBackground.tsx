import { Component, lazy, Suspense, type ReactNode } from "react";

const UnicornScene = lazy(() => import("unicornstudio-react"));

function FallbackBg() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-black to-black">
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-lime-500/10 blur-3xl" />
    </div>
  );
}

class BgErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <FallbackBg />;
    return this.props.children;
  }
}

export default function PageBackground() {
  return (
    <div className="aura-background-component absolute top-0 -z-10 h-[1040px] w-full">
      <div className="absolute left-0 top-0 -z-10 h-full w-full" style={{ filter: "hue-rotate(90deg)" }}>
        <BgErrorBoundary>
          <Suspense fallback={<FallbackBg />}>
            <UnicornScene projectId="vTTCp5g4cVl9nwjlT56Z" />
          </Suspense>
        </BgErrorBoundary>
      </div>
    </div>
  );
}
