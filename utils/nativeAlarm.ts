import { NativeModules } from "react-native";

const { AlarmModule } = NativeModules;

export function startNativeAlarm(uri: string) {
  AlarmModule.startAlarm(uri);
}

export function stopNativeAlarm() {
  AlarmModule.stopAlarm();
}