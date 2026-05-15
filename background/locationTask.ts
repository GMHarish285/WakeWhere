import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { loadActiveTrip } from "../storage/activeTrip";

export const LOCATION_TASK_NAME = "LOCATION_TRACKING_TASK";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Location task error:", error);
    return;
  }

  if (!data) return;

  const trip = await loadActiveTrip();
  if (!trip) return;

  const { locations } = data as {
    locations: Location.LocationObject[];
  };

  if (!locations || locations.length === 0) return;

  const location = locations[0];
  const { latitude, longitude } = location.coords;

  const distance = getDistanceMeters(
    latitude,
    longitude,
    trip.latitude,
    trip.longitude
  );

  console.log("Distance to destination:", distance);
});

function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
