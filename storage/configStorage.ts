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
