import { SavedConfig } from "@/components/SavedConfig";
import { TrackingStatus } from "@/components/TrackingStatus";
import { stopLocationTracking } from "@/services/locationService";
import { Config } from "@/storage/configStorage";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function Index() {
  const [activeConfig, setActiveConfig] = useState<Config | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [currentLat, setCurrentLat] = useState<number | null>(null);
  const [currentLon, setCurrentLon] = useState<number | null>(null);
  const [stopPollingFn, setStopPollingFn] = useState<(() => void) | null>(null);

  function handleStopTracking() {
    stopLocationTracking();
    if (stopPollingFn) {
      stopPollingFn();
    }
    setActiveConfig(null);
    setDistance(null);
    setCurrentLat(null);
    setCurrentLon(null);
  }

  return (
    <View className="flex-1 bg-gray-100 px-4 py-2 gap-5">
      <ScrollView
        className="flex-1 p-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
      >
        <TrackingStatus
          config={activeConfig}
          dist={distance}
          lat={currentLat}
          lon={currentLon}
          onStop={handleStopTracking}
        />

        <SavedConfig
          setActiveConfig={setActiveConfig}
          setDist={setDistance}
          setCurrentLat={setCurrentLat}
          setCurrentLon={setCurrentLon}
          onStopPolling={(fn) => setStopPollingFn(() => fn)}
        />
      </ScrollView>
    </View>
  );
}
