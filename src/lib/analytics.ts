import type { Property } from "./types";
import { CITIES } from "./types";

export function filterByTenant(data: Property[], tenant: string) {
  if (tenant === "All") return data;
  return data.filter((p) => p.tenant === tenant);
}

export function computeKpis(data: Property[]) {
  const total = data.length;
  const approved = data.filter((p) => p.status === "Approved").length;
  const rejected = data.filter((p) => p.status === "Rejected").length;
  const pending = data.filter((p) => p.status === "Pending").length;
  const collection = data.reduce((sum, p) => sum + (p.collection_inr || 0), 0);
  return { total, approved, rejected, pending, collection };
}

export function perCityStats(data: Property[]) {
  return CITIES.map((city) => {
    const rows = data.filter((p) => p.tenant === city);
    return { city, ...computeKpis(rows) };
  });
}

export function buildSummary(data: Property[]) {
  const cities = perCityStats(data).map((c) => ({
    city: c.city,
    total: c.total,
    approved: c.approved,
    rejected: c.rejected,
    pending: c.pending,
    collection_inr: Math.round(c.collection),
  }));
  return { overall: computeKpis(data), cities };
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
