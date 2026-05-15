import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SavedItem } from "../types/SavedItem";

type Props = {
  item: SavedItem;
  selected: boolean;
  onUse: () => void;
  onDelete: () => void;
};

export function SavedDestinationItem({
  item,
  selected,
  onUse,
  onDelete,
}: Props) {
  return (
    <View style={[styles.container, selected && styles.selected]}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>
        {item.latitude}, {item.longitude}, {item.threshold}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity onPress={onUse}>
          <Text style={styles.action}>Use</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.action}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: "center",
  },
  title: { fontWeight: "600", marginBottom: 4 },
  row: { flexDirection: "row", gap: 20, marginTop: 6 },
  action: { color: "blue", fontWeight: "600" },
  selected: {
    borderColor: "blue",
    backgroundColor: "#e6f2ff",
  },
});
