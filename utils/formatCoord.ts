export function formatCoord(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return value.toFixed(6);
}
