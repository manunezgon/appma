import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E" },
  content: { padding: 16, paddingTop: 50 },

  buttonContainer: { marginTop: 40, gap: 20 },

  mainButton: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "purple",
  },

  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  backText: { color: "purple", marginBottom: 15, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },

  pickerContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#3a3a3a",
  },

  position: { width: 30, color: "#ccc", fontWeight: "bold" },

  userName: { flex: 1, color: "#ccc", fontWeight: "600" },

  classes: { color: "#ccc", fontWeight: "bold" },

  diffText: { color: "#888", fontSize: 11 },

  myProgressCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  myProgressTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },

  myProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  myProgressValue: {
    color: "purple",
    fontSize: 22,
    fontWeight: "bold",
  },

  myProgressLabel: { color: "#ccc" },

  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
    gap: 80,
  },

  podiumFirst: {
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "flex-end",
  },

  podiumSecond: {
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "flex-end",
  },

  podiumThird: {
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "flex-end",
  },

  podiumPlace: {
    fontSize: 28,
    marginBottom: 4,
  },

  podiumName: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 2,
  },

  podiumClasses: {
    color: "purple",
    fontWeight: "bold",
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    marginBottom: 15,
  },

  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },

  segmentActive: {
    backgroundColor: "purple",
  },

  segmentText: {
    color: "#ccc",
    fontWeight: "600",
  },

  segmentTextActive: {
    color: "white",
  },
});

export default styles;
