import { Config } from "@/storage/configStorage";
import * as Location from "expo-location";
import { Alert } from "react-native";

let locationSubscription: Location.LocationSubscription | null = null;

export async function ensureLocationServiceEnabled() {
  const locationServiceEnabled = await Location.hasServicesEnabledAsync();

  if (!locationServiceEnabled) {
    Alert.alert(
      "Location Disabled",
      "Please enable location services in your device settings.",
    );
    return false;
  }

  const { status } = await Location.getForegroundPermissionsAsync();
  if (status === "granted") {
    return true;
  }

  const { status: newStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (newStatus !== "granted") {
    Alert.alert(
      "Permission Required",
      "Location permission is required to track your destination.",
    );
    return false;
  }
  return true;
}

export async function startLocationTracking(
  config: Config,
  onDistanceUpdate?: (distance: number) => void,
) {
  const allowed = await ensureLocationServiceEnabled();
  if (!allowed) return;

  stopLocationTracking();

  locationSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 5,
      timeInterval: 2000,
    },
    (location) => {
      const currentLat = location.coords.latitude;
      const currentLon = location.coords.longitude;

      const distance = calculateDistance(
        currentLat,
        currentLon,
        config.lat,
        config.lon,
      );

      if (onDistanceUpdate) {
        onDistanceUpdate(distance);
      }

      if (distance <= config.thres) {
        Alert.alert("Destination reached");
        stopLocationTracking();
      }
    },
  );
}

export function stopLocationTracking() {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
  }
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371000;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
