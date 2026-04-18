import AsyncStorage from "@react-native-async-storage/async-storage";

export type AlarmConfig = {
  uri: string;
  name: string;
};

const ALARM_CONFIG_KEY = "alarmSoundUri";

export async function saveAlarmConfig(alarmConfig: AlarmConfig) {
  await AsyncStorage.setItem(ALARM_CONFIG_KEY, JSON.stringify(alarmConfig));
}

export async function getAlarmConfig(): Promise<AlarmConfig | null> {
  const data = await AsyncStorage.getItem(ALARM_CONFIG_KEY);
  if (!data) return null;
  return JSON.parse(data);
}

export async function clearAlarmConfig() {
  await AsyncStorage.removeItem(ALARM_CONFIG_KEY);
}
