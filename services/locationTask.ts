import { getAlarmConfig } from "@/storage/alarmConfigStorage";
import { getAlarmState } from "@/storage/alarmStateStorage";
import { getActiveConfig, saveTrackingState } from "@/storage/configStorage";
import {
  getCurrentTrackingMode,
  setCurrentTrackingMode,
  TRACKING_MODES,
  TrackingMode,
} from "@/storage/trackingModeStorage";
import { transitionAlarmStateTo } from "@/utils/alarmUtils";
import { startNativeAlarm } from "@/utils/nativeAlarm";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { stopLocationTracking } from "./locationService";
import { triggerAlarm, updateTrackingNotification } from "./notifeeService";

const LOCATION_TASK_NAME = "background-location-task";

function getTrackingMode(
  distance: number,
  currentMode?: TrackingMode,
): TrackingMode {
  if (currentMode === "VERY_NEAR" && distance < 1050) return "VERY_NEAR";
  if (currentMode === "NEAR" && distance < 2100) return "NEAR";
  if (currentMode === "MID" && distance < 5200) return "MID";

  if (distance > 5000) return "FAR";
  if (distance > 2000) return "MID";
  if (distance > 1000) return "NEAR";
  return "VERY_NEAR";
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error || !data) {
    // console.log("Location task error:", error);
    return;
  }

  const { locations } = data as any; // TODO: fix type checking
  const location = locations[0];

  const lat = location.coords.latitude;
  const lon = location.coords.longitude;

  const activeConfig = await getActiveConfig();
  if (!activeConfig) return;

  const dist = calculateDistance(lat, lon, activeConfig.lat, activeConfig.lon);

  //   console.log("BG distance:", dist);

  await saveTrackingState({ lat, lon, dist });

  const currentMode = await getCurrentTrackingMode();

  await updateTrackingNotification(dist, currentMode);

  const newMode = getTrackingMode(dist, currentMode ?? undefined);

  if (newMode !== currentMode) {
    const config = TRACKING_MODES[newMode];

    try {
      const started =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

      if (started) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        ...config,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Tracking location",
          notificationBody: `${Math.round(dist)}m • ${newMode}`,
        },
      });

      await setCurrentTrackingMode(newMode);

      console.log("Switched mode →", newMode);
    } catch (e) {
      console.log("Mode switch failed:", e);
    }

    return;
  }

  const alarmState = await getAlarmState();
  if (alarmState !== "tracking") return;

  // const alarmConfig = await getAlarmConfig();
  // if (!alarmConfig) {
  //   console.log("No alarm sound configured");
  //   return;
  // }

  if (dist <= activeConfig.thres) {
    await transitionAlarmStateTo("triggered");
    await triggerAlarm();

    const config = await getAlarmConfig();
    if (config?.uri) {
      startNativeAlarm(config.uri);
    }

    await transitionAlarmStateTo("ringing");
    await stopLocationTracking();
  }
});

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

export default LOCATION_TASK_NAME;
