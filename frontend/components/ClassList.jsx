import { View, Text, StyleSheet, FlatList } from "react-native";

export default function ClassList({ classes }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Clases del día</Text>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.classCard}>
            <Text style={styles.className}>{item.name}</Text>
            <Text style={styles.classTime}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noClasses}>No hay clases programadas.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  classCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  className: { fontSize: 16, fontWeight: "600" },
  classTime: { fontSize: 14, color: "#555" },
  noClasses: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#999" },
});
