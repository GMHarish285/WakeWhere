import { Text, View } from "react-native";

export function SavedConfigCard() {
  return (
    <View>
      <View>
        <Text>Saved config name</Text>
      </View>
      <View className="flex-row">
        <Text>Latitude</Text>
        <Text>Longitude</Text>
      </View>
      <View>
        <Text>Threshold</Text>
      </View>
      <View className="flex-row">
        <Text>Start tracking</Text>
        <Text>Delete</Text>
      </View>
    </View>
  );
}
