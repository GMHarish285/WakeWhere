import { Config } from "@/storage/configStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Alert } from "react-native";
import LOCATION_TASK_NAME from "./locationTask";

let foregroundSubscription: Location.LocationSubscription | null = null;

export async function ensureLocationEnabled() {
  const servicesEnabled = await Location.hasServicesEnabledAsync();

  if (!servicesEnabled) {
    Alert.alert(
      "Location Disabled",
      "Please enable location services to start tracking.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Turn On",
          onPress: async () => {
            try {
              await Location.enableNetworkProviderAsync();
            } catch (e) {
              console.log("Could not enable location services", e);
            }
          },
        },
      ],
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
  onUpdate?: (data: { lat: number; lon: number; dist: number }) => void,
) {
  const allowed = await ensureLocationEnabled();
  if (!allowed) return;

  await AsyncStorage.setItem("activeConfig", JSON.stringify(config));

  if (foregroundSubscription) {
    foregroundSubscription.remove();
  }

  foregroundSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 1,
      timeInterval: 1000,
    },
    (location) => {
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;

      const dist = calculateDistance(lat, lon, config.lat, config.lon);

      onUpdate?.({ lat, lon, dist });

      if (dist <= config.thres) {
        Alert.alert("Destination reached");
        stopLocationTracking();
      }
    },
  );

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.BestForNavigation,
    distanceInterval: 5,
    timeInterval: 2000,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Tracking location",
      notificationBody: "Location tracking is active",
    },
  });
}

export async function stopLocationTracking() {
  if (foregroundSubscription) {
    foregroundSubscription.remove();
    foregroundSubscription = null;
  }

  const started =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

  if (!started) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 5,
      timeInterval: 2000,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Tracking location",
        notificationBody: "Location tracking is active",
      },
    });
  }

  if (started) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }

  await AsyncStorage.removeItem("activeConfig");
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
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
