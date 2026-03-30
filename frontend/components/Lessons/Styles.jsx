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

  adminModal: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
  },

  titleCenter: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  modeButton: {
    backgroundColor: "#3a3a3a",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },

  modeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444",
  },

  picker: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderRadius: 8,
    marginBottom: 12,
  },

  saveButton: {
    backgroundColor: "#69188E",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

   classContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  classCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#CCCCCC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flex: 1,
  },
  centerContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  adminButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  editButton: {
    paddingHorizontal: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555555",
  },
  professorName: {
    fontSize: 14,
    color: "#555555",
  },
  classTime: {
    fontSize: 14,
    color: "#555555",
    marginRight: 10,
  },
  enrollButton: {
    padding: 5,
  },
  enrollButtonDisabled: {
    opacity: 0.5,
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

  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noClasses: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#F5F5F5",
  },

calendarContainer: {
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
  },
  todayButton: {
    backgroundColor: "#69188E",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  todayText: {
    color: "#CCCCCC",
    fontWeight: "600",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  dayBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#555555",
    width: 45,
  },
  selectedBox: {
    backgroundColor: "#69188E",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0A0A0A",
  },
  dateText: {
    fontSize: 16,
    color: "#CCCCCC",
  },
  activeText: {
    color: "#CCCCCC",
  },
});


export default styles;
