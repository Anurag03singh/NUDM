export type Property = {
  property_id: string;
  tenant: string;
  owner_name: string;
  property_type: "Residential" | "Commercial" | "Industrial" | "Agricultural" | "Mixed Use";
  ward: string;
  area_sqft: number;
  status: "Approved" | "Rejected" | "Pending";
  annual_tax_inr: number;
  collection_inr: number;
  registration_date: string;
  floor_count: number;
  address: string;
};

export const CITIES = [
  "Delhi", "Mumbai", "Pune", "Bengaluru", "Chennai",
  "Hyderabad", "Ahmedabad", "Kolkata", "Jaipur", "Lucknow",
];
