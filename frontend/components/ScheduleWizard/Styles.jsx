import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  inner: {
    paddingBottom: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
    justifyContent: "center",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#CCCCCC",
    justifyContent: "center",
    textAlign: "center",
    padding: 20,
    textTransform: "uppercase",
  },
  subtitle2: {
    fontSize: 15,
    color: "#CCCCCC",
    justifyContent: "center",
    textAlign: "center",
    padding: 5,
  },
  button: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#555555",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#CCCCCC",
    justifyContent: "center",
    textAlign: "center",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 50,
    marginTop: 20,
  },
  midButtons: {
    marginTop: 20,
  },
  deleteButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#E53935",
  },
  backButton: {
    flex: 1,
    backgroundColor: "#757575",
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#69188E",
  },
  inputField: {
    backgroundColor: "#ccc",
    color: "#1E1E1E",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  selectableItem: {
    padding: 10,
    marginVertical: 3,
    borderRadius: 8,
    backgroundColor: "#3E3E3E",
  },
  selectableItemText: {
    color: "#fff",
  },
  selectedItem: { backgroundColor: "#69188E" },
  classContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  classNameContainer: { flexShrink: 1 },
  className: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  professorName: { fontSize: 14, color: "#aaa", marginTop: 2 },
  startTimeEndTime: { fontSize: 14, color: "#fff" },
  amount: { fontSize: 14, color: "#fff" },
  summary: {
    backgroundColor: "#3E3E3E",
    padding: 15,
  },
  summaryText: { fontSize: 14, color: "#fff", marginBottom: 5 },
});

export default style;
