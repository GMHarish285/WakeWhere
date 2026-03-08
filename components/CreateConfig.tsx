import { addConfig, Config, updateConfig } from "@/storage/configStorage";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type CreateConfigPopupProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: () => void;
  config?: Config | null;
};

export function CreateConfig({
  visible,
  onClose,
  onCreate,
  config,
}: CreateConfigPopupProps) {
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [thres, setThres] = useState("");

  const [nameErr, setNameErr] = useState("");
  const [latErr, setLatErr] = useState("");
  const [lonErr, setLonErr] = useState("");
  const [thresErr, setThresErr] = useState("");

  async function handleSave() {
    let hasErr = false;

    setNameErr("");
    setLatErr("");
    setLonErr("");
    setThresErr("");

    if (name.trim() === "") {
      setNameErr("Name cannot be empty");
      hasErr = true;
    }

    const latNum = Number(lat);
    if (lat.trim() === "") {
      setLatErr("Latitude is required");
      hasErr = true;
    } else if (isNaN(latNum)) {
      setLatErr("Latitude must be a number");
      hasErr = true;
    } else if (latNum < -90 || latNum > 90) {
      setLatErr("Latitude must be between -90 and 90");
      hasErr = true;
    }

    const lonNum = Number(lon);
    if (lon.trim() === "") {
      setLonErr("Longitude is required");
      hasErr = true;
    } else if (isNaN(lonNum)) {
      setLonErr("Longitude must be a number");
      hasErr = true;
    } else if (lonNum < -180 || lonNum > 180) {
      setLonErr("Longitude must be between -180 and 180");
      hasErr = true;
    }

    const thresNum = Number(thres);
    if (thres.trim() === "") {
      setThresErr("Threshold is required");
      hasErr = true;
    } else if (isNaN(thresNum)) {
      setThresErr("Threshold must be a number");
      hasErr = true;
    } else if (thresNum <= 0) {
      setThresErr("Threshold must be greater than 0");
      hasErr = true;
    }

    if (hasErr) return;

    const configData: Config = {
      id: config?.id ?? Date.now().toString(),
      name,
      lat: latNum,
      lon: lonNum,
      thres: thresNum,
    };

    if (config) await updateConfig(configData);
    else await addConfig(configData);

    setName("");
    setLat("");
    setLon("");
    setThres("");

    onCreate();
    onClose();
  }

  useEffect(() => {
    if (config) {
      setName(config.name);
      setLat(config.lat.toString());
      setLon(config.lon.toString());
      setThres(config.thres.toString());
    } else {
      setName("");
      setLat("");
      setLon("");
      setThres("");
    }
  }, [config, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 items-center justify-center">
        <View className="bg-white w-[90%] rounded-xl p-6 gap-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold">Create Config</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={30} />
            </Pressable>
          </View>

          <View className="gap-3">
            <View className="gap-1">
              <Text className="text-gray-600">Name</Text>
              <TextInput
                placeholder="Config name"
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={name}
                onChangeText={setName}
              />
              {nameErr ? (
                <Text className="text-red-500 text-xs">{nameErr}</Text>
              ) : null}
            </View>

            <View className="gap-1">
              <Text className="text-gray-600">Latitude</Text>
              <TextInput
                placeholder="Latitude"
                className="border border-gray-300 rounded-lg px-3 py-2"
                keyboardType="numeric"
                value={lat}
                onChangeText={setLat}
              />
              {latErr ? (
                <Text className="text-red-500 text-xs">{latErr}</Text>
              ) : null}
            </View>

            <View className="gap-1">
              <Text className="text-gray-600">Longitude</Text>
              <TextInput
                placeholder="Longitude"
                className="border border-gray-300 rounded-lg px-3 py-2"
                keyboardType="numeric"
                value={lon}
                onChangeText={setLon}
              />
              {lonErr ? (
                <Text className="text-red-500 text-xs">{lonErr}</Text>
              ) : null}
            </View>

            <View className="gap-1">
              <Text className="text-gray-600">Threshold (m)</Text>
              <TextInput
                placeholder="Threshold distance"
                className="border border-gray-300 rounded-lg px-3 py-2"
                keyboardType="numeric"
                value={thres}
                onChangeText={setThres}
              />
              {thresErr ? (
                <Text className="text-red-500 text-xs">{thresErr}</Text>
              ) : null}
            </View>
          </View>

          <View className="flex-row gap-3 mt-3">
            <Pressable className="flex-1 bg-blue-600 py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Track</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              className="flex-1 bg-green-600 py-3 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
