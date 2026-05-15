import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  latitude: string;
  longitude: string;
  threshold: string;
  editable: boolean;
  latitudeValid: boolean;
  longitudeValid: boolean;
  thresholdValid: boolean;
  setLatitude: (v: string) => void;
  setLongitude: (v: string) => void;
  setThreshold: (v: string) => void;
};

export function DestinationInputs({
  latitude,
  longitude,
  threshold,
  editable,
  latitudeValid,
  longitudeValid,
  thresholdValid,
  setLatitude,
  setLongitude,
  setThreshold,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Enter Destination</Text>

      <TextInput
        editable={editable}
        style={[
          styles.input,
          !latitudeValid && styles.errorInput,
          !editable && styles.lockedInput,
        ]}
        placeholder="latitude"
        keyboardType="numeric"
        value={latitude}
        onChangeText={setLatitude}
      />
      {!latitudeValid && (
        <Text style={styles.errorText}>
          Latitude must be between -90 and 90
        </Text>
      )}

      <TextInput
        editable={editable}
        style={[
          styles.input,
          !longitudeValid && styles.errorInput,
          !editable && styles.lockedInput,
        ]}
        placeholder="longitude"
        keyboardType="numeric"
        value={longitude}
        onChangeText={setLongitude}
      />
      {!longitudeValid && (
        <Text style={styles.errorText}>
          Longitude must be between -180 and 180
        </Text>
      )}

      <TextInput
        editable={editable}
        style={[
          styles.input,
          !thresholdValid && styles.errorInput,
          !editable && styles.lockedInput,
        ]}
        placeholder="threshold"
        keyboardType="numeric"
        value={threshold}
        onChangeText={setThreshold}
      />
      {!thresholdValid && (
        <Text style={styles.errorText}>
          Threshold must be a number and greater than 0
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: "100%", alignItems: "center", marginBottom: 10 },
  title: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
  input: {
    width: "90%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  errorInput: {
    borderColor: "red",
  },
  lockedInput: {
    backgroundColor: "#f0f0f0",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 6,
  },
});
