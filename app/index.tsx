import { SavedConfig } from "@/components/SavedConfig";
import { TrackingStatus } from "@/components/TrackingStatus";
import { stopLocationTracking } from "@/services/locationService";
import { Config } from "@/storage/configStorage";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function Index() {
  const [activeConfig, setActiveConfig] = useState<Config | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  function handleStopTracking() {
    stopLocationTracking();
    setActiveConfig(null);
    setDistance(null);
  }

  return (
    <View className="flex-1 bg-gray-100 px-4 py-2 gap-5">
      <ScrollView
        className="flex-1 p-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
      >
        <TrackingStatus config={activeConfig} dist={distance} onStop={handleStopTracking} />

        <SavedConfig
          setActiveConfig={setActiveConfig}
          setDistance={setDistance}
        />
      </ScrollView>
    </View>
  );
}
