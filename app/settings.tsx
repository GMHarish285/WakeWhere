import { pickAlarmSound } from "@/services/alarmSoundPicker";
import {
  AlarmConfig,
  clearAlarmConfig,
  getAlarmConfig,
  saveAlarmConfig,
} from "@/storage/alarmConfigStorage";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Settings() {
  const [alarm, setAlarm] = useState<AlarmConfig | null>(null);

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

      <Pressable onPress={handlePick} className="bg-blue-600 p-3 rounded-lg">
        <Text className="text-white text-center">Choose Sound</Text>
      </Pressable>

      {alarm && (
        <>
          <Text>Selected: {alarm.name}</Text>

          <Pressable
            onPress={handleClear}
            className="bg-red-500 p-3 rounded-lg"
          >
            <Text className="text-white text-center">Clear</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
