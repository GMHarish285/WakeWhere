import AsyncStorage from "@react-native-async-storage/async-storage";
import { Accuracy } from "expo-location";

export const TRACKING_MODES = {
  FAR: {
    accuracy: Accuracy.Low,
    distanceInterval: 500,
    timeInterval: 20000,
  },
  MID: {
    accuracy: Accuracy.Balanced,
    distanceInterval: 100,
    timeInterval: 10000,
  },
  NEAR: {
    accuracy: Accuracy.High,
    distanceInterval: 10,
    timeInterval: 3000,
  },
  VERY_NEAR: {
    accuracy: Accuracy.Highest,
    distanceInterval: 4,
    timeInterval: 1000,
  },
} as const;
export type TrackingMode = keyof typeof TRACKING_MODES;

const TRACKING_MODE_KEY = "tracking_mode";

export async function getCurrentTrackingMode(): Promise<TrackingMode | null> {
  const mode = await AsyncStorage.getItem(TRACKING_MODE_KEY);

  if (mode && mode in TRACKING_MODES) {
    return mode as TrackingMode;
  }

  return null;
}

export async function setCurrentTrackingMode(trackingMode: TrackingMode) {
  await AsyncStorage.setItem(TRACKING_MODE_KEY, trackingMode);
}

export async function clearTrackingMode() {
  await AsyncStorage.removeItem(TRACKING_MODE_KEY);
}
