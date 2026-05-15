import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActiveTrip } from "../types/ActiveTrip";

const ACTIVE_TRIP_KEY = "ACTIVE_TRIP";

export async function saveActiveTrip(trip: ActiveTrip) {
  await AsyncStorage.setItem(ACTIVE_TRIP_KEY, JSON.stringify(trip));
}

export async function loadActiveTrip(): Promise<ActiveTrip | null> {
  const data = await AsyncStorage.getItem(ACTIVE_TRIP_KEY);
  return data ? JSON.parse(data) : null;
}

export async function clearActiveTrip() {
  await AsyncStorage.removeItem(ACTIVE_TRIP_KEY);
}
