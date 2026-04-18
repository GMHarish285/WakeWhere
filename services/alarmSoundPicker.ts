import * as DocumentPicker from "expo-document-picker";
import { AlarmConfig } from "@/storage/alarmConfigStorage";

export async function pickAlarmSound(): Promise<AlarmConfig | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return null;

    const file = result.assets[0];

    return {
      uri: file.uri,
      name: file.name,
    };
  } catch (e) {
    console.log("Error picking sound:", e);
    return null;
  }
}
