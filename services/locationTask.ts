import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from "expo-task-manager";
import { Alert } from "react-native";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    // console.log("Location task error:", error);
    return;
  }

  if (!data) return;

  const { locations } = data as any;
  const location = locations[0];

  const lat = location.coords.latitude;
  const lon = location.coords.longitude;

  const configJSON = await AsyncStorage.getItem("activeConfig");

  if (!configJSON) return;

  const config = JSON.parse(configJSON);

  const dist = calculateDistance(lat, lon, config.lat, config.lon);

  //   console.log("BG distance:", dist);

  if (dist <= config.thres) {
    Alert.alert("Destination reached");
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
