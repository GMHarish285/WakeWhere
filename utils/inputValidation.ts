export function isValidLatitude(value: string): boolean {
  if (value.trim() === "") return false;
  const n = Number(value);
  return !isNaN(n) && n >= -90 && n <= 90;
}

export function isValidLongitude(value: string): boolean {
  if (value.trim() === "") return false;
  const n = Number(value);
  return !isNaN(n) && n >= -180 && n <= 180;
}

export function isValidThreshold(value: string): boolean {
  if (value.trim() === "") return false;
  const n = Number(value);
  return !isNaN(n) && n > 0;
}
