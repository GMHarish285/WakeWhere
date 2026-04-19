import AsyncStorage from "@react-native-async-storage/async-storage";

export type AlarmState =
  | "idle"
  | "tracking"
  | "triggered"
  | "ringing"
  | "stopped";

const KEY = "ALARM_STATE";

export async function getAlarmState(): Promise<AlarmState> {
  const state = await AsyncStorage.getItem(KEY);
  return (state as AlarmState) || "idle";
}

export async function setAlarmState(state: AlarmState) {
  await AsyncStorage.setItem(KEY, state);
}
