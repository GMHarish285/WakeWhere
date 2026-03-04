import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type CreateConfigPopupProps = {
  visible: boolean;
  onClose: () => void;
};

export function CreateConfig({ visible, onClose }: CreateConfigPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 items-center justify-center">
        <View className="bg-white w-[90%] rounded-xl p-5 gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold">Create Config</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} />
            </Pressable>
          </View>

          <View className="gap-3">
            <View className="gap-1">
              <Text className="text-gray-600">Name</Text>
              <TextInput
                placeholder="Config name"
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </View>

            <View className="gap-1">
              <Text className="text-gray-600">Latitude</Text>
              <TextInput
                placeholder="Latitude"
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </View>

            <View className="gap-1">
              <Text className="text-gray-600">Longitude</Text>
              <TextInput
                placeholder="Longitude"
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </View>

            <View className="gap-1">
              <Text className="text-gray-600">Threshold (m)</Text>
              <TextInput
                placeholder="Threshold distance"
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </View>
          </View>

          <View className="flex-row gap-3 mt-2">
            <Pressable className="flex-1 bg-blue-500 py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Track</Text>
            </Pressable>

            <Pressable className="flex-1 bg-green-500 py-3 rounded-lg items-center">
              <Text className="text-white font-semibold">Save & Track</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
