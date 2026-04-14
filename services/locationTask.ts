import {
  getActiveConfig,
  getAlarmTriggered,
  saveTrackingState,
  setAlarmTriggered,
} from "@/storage/configStorage";
import * as TaskManager from "expo-task-manager";
import { stopLocationTracking } from "./locationService";
import {
  clearTrackingNotification,
  triggerAlarm,
  updateTrackingNotification,
} from "./notifeeService";

const LOCATION_TASK_NAME = "background-location-task";

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

  await updateTrackingNotification(dist);

  const alreadyTriggered = await getAlarmTriggered();

  if (dist <= activeConfig.thres && !alreadyTriggered) {
    await setAlarmTriggered(true);
    await triggerAlarm();
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
