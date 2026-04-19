import { SavedConfig } from "@/components/SavedConfig";
import { TrackingStatus } from "@/components/TrackingStatus";
import { stopLocationTracking } from "@/services/locationService";
import { registerNotifeeEvents } from "@/services/notifeeEvents";
import { setupNotifeeChannels } from "@/services/notifeeService";
import { getAlarmState } from "@/storage/alarmStateStorage";
import {
  Config,
  getActiveConfig,
  getTrackingState,
} from "@/storage/configStorage";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

registerNotifeeEvents();

export default function Index() {
  const [activeConfig, setActiveConfig] = useState<Config | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [currentLat, setCurrentLat] = useState<number | null>(null);
  const [currentLon, setCurrentLon] = useState<number | null>(null);
  // const [stopPollingFn, setStopPollingFn] = useState<(() => void) | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function checkAlarmState() {
      const state = await getAlarmState();

      if (state === "ringing") {
        console.log("Alarm was ringing, restore UI");
      }
    }

    checkAlarmState();
  }, []);

  useEffect(() => {
    async function loadTrackingState() {
      const config = await getActiveConfig();
      if (config) {
        setActiveConfig(config);
        const state = await getTrackingState();
        if (state) {
          setCurrentLat(state.lat);
          setCurrentLon(state.lon);
          setDistance(state.dist);
        } else {
          setActiveConfig(null);
          return;
        }

        startPolling();
      }
    }

    loadTrackingState();
  }, []);

  function startPolling() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      getTrackingState().then((state) => {
        if (!state) {
          setActiveConfig(null);
          setDistance(null);
          setCurrentLat(null);
          setCurrentLon(null);

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          return;
        }

        setCurrentLat(state.lat);
        setCurrentLon(state.lon);
        setDistance(state.dist);
      });
    }, 5000);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setupNotifeeChannels();
  }, []);

  function handleStopTracking() {
    stopLocationTracking();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // if (stopPollingFn) {
    //   stopPollingFn();
    // }

    setActiveConfig(null);
    setDistance(null);
    setCurrentLat(null);
    setCurrentLon(null);
  }

  async function handleStartTracking(config: Config) {
    setActiveConfig(config);

    const state = await getTrackingState();
    if (state) {
      setCurrentLat(state.lat);
      setCurrentLon(state.lon);
      setDistance(state.dist);
    }

    startPolling();
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
          setActiveConfig={handleStartTracking}
          // setDist={setDistance}
          // setCurrentLat={setCurrentLat}
          // setCurrentLon={setCurrentLon}
          // onStopPolling={(fn) => setStopPollingFn(() => fn)}
          activeConfig={activeConfig}
        />
      </ScrollView>
    </View>
  );
}
