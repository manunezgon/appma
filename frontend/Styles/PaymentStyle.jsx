import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    color: "#fff",
  },
  loadingText: {
    color: "#ccc",
    marginTop: 10,
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2A2A2A",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    position: "relative",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  modalSubtitle: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 10,
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    color: "#fff",
    width: "100%",
  },
  registerButton: {
    marginTop: 15,
    backgroundColor: "#00923aff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  globalSwitchContainer: {
    alignItems: "center",
    marginVertical: 12,
  },

  globalSwitchLabel: {
    fontSize: 15,
    color: "#cccccc",
  },
  paymentRow: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentInfo: {
    flex: 1,
  },
  modalityName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalityStatus: {
    color: "#888",
    fontSize: 12,
    marginTop: 3,
  },
  card: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#555",
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noPaymentsText: {
    color: "#888",
    marginTop: 10,
  },
  paymentsList: {
    width: "100%",
    marginTop: 15,
  },
});

export default style;
