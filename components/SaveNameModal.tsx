import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  name: string;
  setName: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function SaveNameModal({
  visible,
  name,
  setName,
  onCancel,
  onSave,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Destination Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.row}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.action}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave}>
              <Text style={styles.action}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
  input: {
    width: "90%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  row: { flexDirection: "row", gap: 20 },
  action: { color: "blue", fontWeight: "600" },
});
