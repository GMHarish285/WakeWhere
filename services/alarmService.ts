import { getAlarmConfig } from "@/storage/alarmConfigStorage";
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
} from "expo-audio";
import { Vibration } from "react-native";

let player: AudioPlayer | null = null;
let isPlaying = false;

export async function startAlarm() {
  if (isPlaying) return;

  try {
    isPlaying = true;

    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    });

    const uri = await getAlarmConfig();

    player = createAudioPlayer(uri);

    await player.play();

    Vibration.vibrate([500, 1000], true);
  } catch (e) {
    console.log("Alarm start error:", e);
  }
}

export async function stopAlarmSound() {
  try {
    isPlaying = false;

    if (player) {
      await player.pause();
      player = null;
    }

    Vibration.cancel();
  } catch (e) {
    console.log("Alarm stop error:", e);
  }
}
