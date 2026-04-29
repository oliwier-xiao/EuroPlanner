export function compareRoutePointsByArrivalStart(
  a: { arrival_date: string },
  b: { arrival_date: string }
): number {
  const dateOf = (s: string) => (s && s.includes("T") ? s.slice(0, 10) : "");
  const timeOf = (s: string) => (s && s.includes("T") ? s.slice(11, 16) : "");
  const dA = dateOf(a.arrival_date);
  const dB = dateOf(b.arrival_date);
  if (dA === "" && dB === "") return 0;
  if (dA === "") return 1;
  if (dB === "") return -1;
  const byDate = dA.localeCompare(dB);
  if (byDate !== 0) return byDate;
  const tA = timeOf(a.arrival_date) || "00:00";
  const tB = timeOf(b.arrival_date) || "00:00";
  return tA.localeCompare(tB);
}

export function compareRoutePointsForDisplay(
  a: { visit_order: number | null; arrival_date: string },
  b: { visit_order: number | null; arrival_date: string }
): number {
  const byArrival = compareRoutePointsByArrivalStart(a, b);
  if (byArrival !== 0) return byArrival;
  const oa = a.visit_order;
  const ob = b.visit_order;
  if (oa == null && ob == null) return 0;
  if (oa == null) return 1;
  if (ob == null) return -1;
  return oa - ob;
}
