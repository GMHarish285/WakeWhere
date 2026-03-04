import { Alert, FlatList, StyleSheet, Text } from "react-native";
import { SavedItem } from "../types/SavedItem";
import { SavedDestinationItem } from "./SavedDestinationItem";

type Props = {
  items: SavedItem[];
  activeSavedId: string | null;
  onUse: (item: SavedItem) => void;
  onDelete: (item: SavedItem) => void;
};


export function SavedDestinationList({ items, activeSavedId, onUse, onDelete }: Props) {
  function confirmDelete(item: SavedItem) {
    Alert.alert(
      "Delete Destination",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(item),
        },
      ]
    );
  }

  if (items.length === 0) {
    return <Text style={styles.empty}>No Saved Destinations</Text>;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SavedDestinationItem
          item={item}
          selected={item.id === activeSavedId}
          onUse={() => onUse(item)}
          onDelete={() => confirmDelete(item)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  empty: {
    marginTop: 10,
    color: "#777",
    textAlign: "center",
  },
});
