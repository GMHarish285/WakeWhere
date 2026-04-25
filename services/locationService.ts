import { getAlarmState } from "@/storage/alarmStateStorage";
import {
  clearActiveConfig,
  Config,
  saveActiveConfig,
} from "@/storage/configStorage";
import {
  clearTrackingMode,
  setCurrentTrackingMode,
} from "@/storage/trackingModeStorage";
import { transitionAlarmStateTo } from "@/utils/alarmUtils";
import * as Location from "expo-location";
import { Alert } from "react-native";
import LOCATION_TASK_NAME from "./locationTask";
import { clearTrackingNotification } from "./notifeeService";

const UPDATE_INTERVAL = 5000;

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

export async function startLocationTracking(config: Config) {
  const allowed = await ensureLocationEnabled();
  if (!allowed) return;

  await saveActiveConfig(config);

  await setCurrentTrackingMode("VERY_NEAR");

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 5,
    timeInterval: UPDATE_INTERVAL,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Tracking location",
      notificationBody: "",
    },
  });

  await transitionAlarmStateTo("idle");
  await transitionAlarmStateTo("tracking");
}

export async function stopLocationTracking() {
  const started =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

  if (started) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }

  await clearActiveConfig();

  await clearTrackingNotification();

  await clearTrackingMode();

  const alarmState = await getAlarmState();
  if (alarmState !== "ringing") {
    await transitionAlarmStateTo("idle");
  }
}
