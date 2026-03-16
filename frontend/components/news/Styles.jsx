import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  inner: {
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CCCCCC",
    textTransform: "uppercase",
    textAlign: "center",
    margin: 15,
  },
  newsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#CCCCCC",
  },
  carruselWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  carruselContainer: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  editButton: {
    position: "absolute",
    bottom: 30,
    right: 3,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  pager: {
    flex: 1,
    borderRadius: 10,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#69188E",
  },
  editModalContent: {
    backgroundColor: "#CCCCCC",
    borderRadius: 10,
    width: "80%",
    paddingInline: 10,
    paddingBottom: 20,
    paddingTop: 10,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  deleteImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "rgba(255,0,0,0.8)",
    borderRadius: 12,
    padding: 3,
    zIndex: 10,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButton: {
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    color: "#fff",
  },
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: "#69188E",
  },
  message: {
    fontSize: 15,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 6,
    color: "#cccccc",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  deleteButton: {
    padding: 6,
    alignSelf: "flex-end",
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
});

export default style;
