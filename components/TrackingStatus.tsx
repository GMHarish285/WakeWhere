import { Text, View } from "react-native";

export function TrackingStatus() {
  return (
    <View>
      <View>
        <Text>Config name</Text>
      </View>
      <View className="flex-row">
        <Text>Latitude</Text>
        <Text>Longitude</Text>
      </View>
      <View>
        <Text>Threshold</Text>
      </View>
      <View>
        <Text>Distance</Text>
      </View>
      <View className="">
        <Text>Stop tracking</Text>
      </View>
    </View>
  );
}
