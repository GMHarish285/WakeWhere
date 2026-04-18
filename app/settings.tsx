import { pickAlarmSound } from "@/services/alarmSoundPicker";
import {
  AlarmConfig,
  clearAlarmConfig,
  getAlarmConfig,
  saveAlarmConfig,
} from "@/storage/alarmConfigStorage";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Settings() {
  const [alarm, setAlarm] = useState<AlarmConfig | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useAudioPlayer(alarm?.uri ?? null);

  function togglePlay() {
    if (!alarm) return;

    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  }

  useEffect(() => {
    setIsPlaying(false);
  }, [alarm?.uri]);

  useEffect(() => {
    const sub = player.addListener("playbackStatusUpdate", (status) => {
      if (!status.playing) {
        setIsPlaying(false);
      }
    });

    return () => sub.remove();
  }, [player]);

  useEffect(() => {
    loadSound();
  }, []);

  async function loadSound() {
    const alarmConfig = await getAlarmConfig();
    setAlarm(alarmConfig);
  }

  async function handlePick() {
    const alarmConfig = await pickAlarmSound();
    if (alarmConfig) {
      player.pause();
      setAlarm(alarmConfig);
      await saveAlarmConfig(alarmConfig);
    }
  }

  async function handleClear() {
    await clearAlarmConfig();
    setAlarm(null);
  }

  return (
    <View className="flex-1 p-4 gap-4">
      <Text className="text-lg font-bold">Alarm Sound</Text>

      {!alarm ? (
        <Pressable onPress={handlePick} className="bg-blue-600 p-3 rounded-lg">
          <Text className="text-white text-center font-semibold">
            Choose Sound
          </Text>
        </Pressable>
      ) : (
        <View className="bg-neutral-900 p-4 rounded-xl gap-4">
          {/* File + play */}
          <View className="flex-row items-center justify-between">
            <Text numberOfLines={1} className="text-white flex-1 mr-3">
              {alarm.name}
            </Text>

            <Pressable
              onPress={togglePlay}
              className="bg-neutral-700 px-3 py-2 rounded-lg"
            >
              <Text className="text-white text-lg">
                {player.playing ? "Pause" : "Play"}
              </Text>
            </Pressable>
          </View>

          {/* Actions */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handlePick}
              className="flex-1 bg-blue-600 p-2 rounded-lg"
            >
              <Text className="text-white text-center font-medium">
                Change Sound
              </Text>
            </Pressable>

            <Pressable
              onPress={handleClear}
              className="flex-1 bg-red-500 p-2 rounded-lg"
            >
              <Text className="text-white text-center font-medium">Clear</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
