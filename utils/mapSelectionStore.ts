let selectedLocation: { lat: number; lon: number } | null = null;

export function setSelectedLocation(loc: { lat: number; lon: number }) {
  selectedLocation = loc;
}

export function getSelectedLocation() {
  return selectedLocation;
}

export function clearSelectedLocation() {
  selectedLocation = null;
}