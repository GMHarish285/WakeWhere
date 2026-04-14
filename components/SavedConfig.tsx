import { startLocationTracking } from "@/services/locationService";
import { Config, deleteConfig, getConfigs } from "@/storage/configStorage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CreateConfig } from "./CreateConfig";
import { SavedConfigCard } from "./SavedConfigCard";

const TRACKING_STATUS_UPDATE_INTERVAL = 5000;

type SavedConfigProps = {
  setActiveConfig: (config: Config) => void;
  // setDist: (distance: number) => void;
  // setCurrentLat: (distance: number) => void;
  // setCurrentLon: (distance: number) => void;
  // onStopPolling: (fn: () => void) => void;
  activeConfig: Config | null;
};

export function SavedConfig({
  setActiveConfig,
  // setDist,
  // setCurrentLat,
  // setCurrentLon,
  // onStopPolling,
  activeConfig,
}: SavedConfigProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  // const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function loadConfigs() {
    const configs = await getConfigs();
    setConfigs(configs);
  }

  useEffect(() => {
    loadConfigs();
  }, []);

  async function handleDeleteConfig(id: string) {
    await deleteConfig(id);
    loadConfigs();
  }

  async function handleEditConfig(config: Config) {
    setEditingConfig(config);
    setShowPopup(true);
  }

  // function stopPolling() {
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //     intervalRef.current = null;
  //   }
  // }

  function handleStartTracking(config: Config) {
    setActiveConfig(config);
    startLocationTracking(config);

    // if (intervalRef.current) {
    //   clearInterval(intervalRef.current);
    // }

    // intervalRef.current = setInterval(async () => {
    //   const state = await getTrackingState();
    //   if (!state) return;

    //   setCurrentLat(state.lat);
    //   setCurrentLon(state.lon);
    //   setDist(state.dist);
    // }, TRACKING_STATUS_UPDATE_INTERVAL);

    // onStopPolling(() => {
    //   if (intervalRef.current) {
    //     clearInterval(intervalRef.current);
    //     intervalRef.current = null;
    //   }
    // });
  }

  return (
    <View className="border border-gray-200 bg-white rounded-xl p-4 gap-5">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold">Saved Configs</Text>

        <Pressable
          className="bg-green-600 p-2 rounded-lg"
          onPress={() => setShowPopup(true)}
        >
          <Ionicons name="add" size={25} color="white" />
        </Pressable>
      </View>

      {/* <SavedConfigCard />
      <SavedConfigCard />
      <SavedConfigCard /> */}

      {configs.map((config) => (
        <SavedConfigCard
          key={config.id}
          config={config}
          onDelete={() => handleDeleteConfig(config.id)}
          onEdit={() => handleEditConfig(config)}
          onStart={() => handleStartTracking(config)}
          disabled={!!activeConfig} // TODO: disable only current tracking config ensuring no race conditions occur in backend
        />
      ))}

      <CreateConfig
        visible={showPopup}
        onClose={() => {
          setShowPopup(false);
          setEditingConfig(null);
        }}
        onCreate={loadConfigs}
        config={editingConfig}
      />
    </View>
  );
}
