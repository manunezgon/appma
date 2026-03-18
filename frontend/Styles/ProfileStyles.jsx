import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    color: "#CCCCCC",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 10,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#69188E",
  },

  headerText: {
    marginLeft: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#CCCCCC",
  },

  infoBox: {
    width: "80%",
    borderRadius: 10,
    backgroundColor: "#3E3E3E",
    padding: 15,
    marginBottom: 30,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  label: {
    fontSize: 15,
    color: "#AAAAAA",
  },

  value: {
    fontSize: 15,
    color: "#CCCCCC",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    width: "80%",
    marginBottom: 50,
  },

  button: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#69188E",
  },

  buttonText: {
    textAlign: "center",
    color: "#cccccc",
    paddingVertical: 4,
  },

  saveButton: {
    backgroundColor: "#69188E",
  },

  cancelButton: {
    backgroundColor: "#555555",
  },

  logoutButton: {
    backgroundColor: "#555555",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#2E2E2E",
    borderRadius: 10,
    padding: 20,
  },

  tabsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#3E3E3E",
    borderRadius: 8,
    overflow: "hidden",
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  tabActive: {
    backgroundColor: "#69188E",
    borderRadius: 8,
  },

  tabText: {
    fontSize: 14,
    color: "#cccccc",
  },

  modalScroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },

  input: {
    width: "100%",
    backgroundColor: "#3E3E3E",
    color: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#555555",
    marginVertical: 15,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 20,
  },
});

export default styles;
