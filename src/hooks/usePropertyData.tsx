import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Property } from "@/lib/types";
import { CITIES } from "@/lib/types";
import { buildSummary, computeKpis, filterByTenant, perCityStats } from "@/lib/analytics";

type Ctx = {
  properties: Property[] | null;
  loading: boolean;
  tenant: string;
  setTenant: (t: string) => void;
  filtered: Property[];
  kpis: ReturnType<typeof computeKpis>;
  cityStats: ReturnType<typeof perCityStats>;
  summaryForChat: string;
};

const PropertyDataContext = createContext<Ctx | null>(null);

export function PropertyDataProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState("All");

  useEffect(() => {
    fetch("/properties.json")
      .then((res) => res.json())
      .then((rows: Property[]) => {
        setProperties(rows);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Could not load properties.json", err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () => (properties ? filterByTenant(properties, tenant) : []),
    [properties, tenant],
  );
  const kpis = useMemo(() => computeKpis(filtered), [filtered]);
  const cityStats = useMemo(
    () => (properties ? perCityStats(properties) : []),
    [properties],
  );
  const summaryForChat = useMemo(
    () => (properties ? JSON.stringify(buildSummary(properties)) : ""),
    [properties],
  );

  const value: Ctx = {
    properties,
    loading,
    tenant,
    setTenant,
    filtered,
    kpis,
    cityStats,
    summaryForChat,
  };

  return (
    <PropertyDataContext.Provider value={value}>{children}</PropertyDataContext.Provider>
  );
}

export function usePropertyData() {
  const ctx = useContext(PropertyDataContext);
  if (!ctx) throw new Error("usePropertyData must be used inside PropertyDataProvider");
  return ctx;
}

export const TENANT_OPTIONS = ["All", ...CITIES] as const;
