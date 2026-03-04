import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  inner: {
    paddingBottom: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  stepIndicator: {
    marginBottom: 15,
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#fff",
  },
  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#1976D2",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#E53935",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#757575",
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: "#E53935",
    padding: 10,
    borderRadius: 8,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  inputField: {
    backgroundColor: "#2E2E2E",
    color: "#fff",
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
});

export default style;