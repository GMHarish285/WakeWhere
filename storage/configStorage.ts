import AsyncStorage from "@react-native-async-storage/async-storage";

export type Config = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  thres: number;
};

const CONFIG_KEY = "configs";

export async function getConfigs(): Promise<Config[]> {
  try {
    const data = await AsyncStorage.getItem(CONFIG_KEY);

    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    throw new Error("Failed to load configs.", { cause: e });
  }
}

export async function saveConfigs(configs: Config[]) {
  try {
    await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(configs));
  } catch (e) {
    throw new Error("Failed to save configs.", { cause: e });
  }
}

export async function addConfig(config: Config) {
  try {
    const configs = await getConfigs();
    configs.push(config);
    await saveConfigs(configs);
  } catch (e) {
    throw new Error("Failed to add config.", { cause: e });
  }
}

export async function updateConfig(updatedConfig: Config) {
  try {
    const configs = await getConfigs();
    const updatedConfigs = configs.map((config) =>
      config.id === updatedConfig.id ? updatedConfig : config,
    );
    await saveConfigs(updatedConfigs);
  } catch (e) {
    throw new Error("Failed to update config.", { cause: e });
  }
}

export async function deleteConfig(id: string) {
  try {
    const configs = await getConfigs();
    const updatedConfigs = configs.filter((config) => config.id !== id);
    await saveConfigs(updatedConfigs);
  } catch (e) {
    throw new Error("Failed to delete config.", { cause: e });
  }
}

const ACTIVE_CONFIG_KEY = "activeConfig";

export async function saveActiveConfig(state: Config) {
  await AsyncStorage.setItem(ACTIVE_CONFIG_KEY, JSON.stringify(state));
}

export async function getActiveConfig(): Promise<Config | null> {
  const data = await AsyncStorage.getItem(ACTIVE_CONFIG_KEY);
  if (!data) return null;
  return JSON.parse(data);
}

export async function clearActiveConfig() {
  await AsyncStorage.removeItem(ACTIVE_CONFIG_KEY);
}


const TRACKING_STATE_KEY = "trackingState";

export type TrackingState = {
  lat: number;
  lon: number;
  dist: number;
};

export async function saveTrackingState(state: TrackingState) {
  await AsyncStorage.setItem(TRACKING_STATE_KEY, JSON.stringify(state));
}

export async function getTrackingState(): Promise<TrackingState | null> {
  const data = await AsyncStorage.getItem(TRACKING_STATE_KEY);
  if (!data) return null;
  return JSON.parse(data);
}

export async function clearTrackingState() {
  await AsyncStorage.removeItem(TRACKING_STATE_KEY);
}

const ALARM_TRIGGERED_KEY = "alarmTriggered";

export async function setAlarmTriggered(value: boolean) {
  await AsyncStorage.setItem(ALARM_TRIGGERED_KEY, JSON.stringify(value));
}

export async function getAlarmTriggered(): Promise<boolean> {
  const data = await AsyncStorage.getItem(ALARM_TRIGGERED_KEY);
  return data ? JSON.parse(data) : false;
}

export async function clearAlarmTriggered() {
  await AsyncStorage.removeItem(ALARM_TRIGGERED_KEY);
}