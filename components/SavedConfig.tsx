import { Config, deleteConfig, getConfigs } from "@/storage/configStorage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CreateConfig } from "./CreateConfig";
import { SavedConfigCard } from "./SavedConfigCard";

export function SavedConfig() {
  const [showPopup, setShowPopup] = useState(false);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);

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
