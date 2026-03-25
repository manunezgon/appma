import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E", paddingTop: 50 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  errorModal: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
  },
  Title: { color: "#fff", fontWeight: "bold", fontSize: 22 },
  Content: { color: "#ccc", fontWeight: "bold", textAlign: "center" },
  closenonpaidIcon: { color: "#69188E" },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#69188E",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
});

export default styles;
