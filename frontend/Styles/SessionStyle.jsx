import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  sectionHeaderContainer: { paddingTop: 20, paddingBottom: 10 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
    justifyContent: "center",
    textAlign: "center",
  },
  classCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#CCCCCC",
  },
  className: { fontSize: 16, fontWeight: "600" },
  professorName: { fontSize: 14, color: "#555" },
  date: { fontSize: 14, color: "#555" },
  time: { fontSize: 14, color: "#555" },
  noClasses: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#CCCCCC",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: { padding: 5 },
  loading: { textAlign: "center", marginTop: 50 }
});

export default styles;
