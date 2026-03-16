import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1E1E1E",
  },
  content: { padding: 16, paddingTop: 50 },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
    justifyContent: "center",
    textAlign: "center",
    paddingBottom: 30,
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#555555",
    borderRadius: 8,
    marginBottom: 15,
  },

  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },

  segmentActive: {
    backgroundColor: "#69188E",
  },

  segmentText: {
    color: "#CCCCCC",
  },

  segmentTextActive: {
    color: "#CCCCCC",
    fontWeight: "600",
  },

  pickerContainer: {
    backgroundColor: "#555555",
    borderRadius: 10,
    marginBottom: 15,
  },

myProgressCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },

  myProgressTitle: {
    color: "#cccccc",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    textTransform: "uppercase",
    marginBottom: 10,
  },

  myProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "center", 
    paddingVertical: 4,
  },

  myProgressValue: {
    color: "#69188E",
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
    fontSize: 30,
    marginBottom: 5,
  },

  podiumName: {
    color: "#cccccc",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 14,
    marginBottom: 2,
  },

  podiumClasses: {
    color: "#555555",
    fontWeight: "bold",
  },

  rankingCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

    rankingRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#555555",
  },

position: { width: 30, color: "#ccc", fontWeight: "bold" },

  userName: { flex: 1, color: "#ccc", fontWeight: "600" },

  classes: { color: "#ccc", fontWeight: "bold" },

  diffText: { color: "#555555", fontSize: 11 },
});

export default styles;
