import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedItem } from "../types/SavedItem";

const SAVED_DESTINATIONS_KEY = "SAVED_DESTINATIONS";

export async function loadSavedItems(): Promise<SavedItem[]> {
  const data = await AsyncStorage.getItem(SAVED_DESTINATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveSavedItems(items: SavedItem[]) {
  await AsyncStorage.setItem(SAVED_DESTINATIONS_KEY, JSON.stringify(items));
}
