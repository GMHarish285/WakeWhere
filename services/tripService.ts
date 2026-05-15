import * as Location from "expo-location";
import { saveActiveTrip, clearActiveTrip } from "../storage/activeTrip";
import { ActiveTrip } from "../types/ActiveTrip";
import { LOCATION_TASK_NAME } from "../background/locationTask";

export async function startTrip(trip: ActiveTrip) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Location permission not granted");
  }

  const bg = await Location.requestBackgroundPermissionsAsync();
  if (bg.status !== "granted") {
    throw new Error("Background location not granted");
  }

  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    throw new Error("Location services disabled");
  }

  await saveActiveTrip(trip);

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000,
    distanceInterval: 10,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "WakeWhere",
      notificationBody: "Tracking your location",
    },
  });
}

export async function stopTrip() {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  await clearActiveTrip();
}
