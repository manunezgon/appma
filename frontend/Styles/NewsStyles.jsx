import { StyleSheet } from "react-native";
import { colors, layout, radii, spacing, typography } from "./theme";

const style = StyleSheet.create({
  container: {
    ...layout.screen,
  },
  inner: {
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  logo: {
    marginTop: spacing.md,
    height: 100,
    width: "100%",
    resizeMode: "contain",
  },
  title: {
    ...typography.screenTitle,
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.screenTitle,
    margin: spacing.lg,
    paddingBottom: spacing.sm,
  },
  newsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: colors.textMuted,
  },
  carruselWrapper: {
    position: "relative",
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  carruselContainer: {
    aspectRatio: 3/2,
    width: "100%",
    borderRadius: radii.md,
    overflow: "hidden",
  },
  editButton: {
    position: "absolute",
    bottom: 30,
    right: 3,
    backgroundColor: colors.overlay,
    padding: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  pager: {
    flex: 1,
    borderRadius: radii.md,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radii.md,
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
    backgroundColor: colors.primary,
  },
  editModalContent: {
    backgroundColor: colors.cardLight,
    borderRadius: radii.md,
    width: "85%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  imagePreviewWrapper: {
  width: 120,
  aspectRatio: 3/2,
  margin: 5,
  position: "relative",
  justifyContent: "center",
  alignItems: "center",
},

imagePreview: {
  width: "100%",
  height: "100%",
  borderRadius: radii.sm,
},
  deleteImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.overlayDanger,
    borderRadius: radii.lg,
    padding: 3,
    zIndex: 10,
  },
  reorderButtonsContainer: {
    position: "absolute",
    bottom: 2,
    right: 2,
    flexDirection: "row",
    backgroundColor: colors.overlaySoft,
    borderRadius: 6,
    padding: 2,
  },
  reorderButton: {
    marginHorizontal: 2,
    padding: 4,
    backgroundColor: colors.overlayControl,
    borderRadius: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButton: {
  width: 120,
  aspectRatio: 3 / 2,
  borderRadius: radii.sm,
  backgroundColor: colors.surface,
  justifyContent: "center",
  alignItems: "center",
  margin: 5,
},
  saveButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    alignSelf: "center",
  },
  closeModalButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },

  nextClassContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.xl, borderLeftWidth: 3, borderLeftColor: colors.primary, }, nextClassIcon: { width: 42, height: 42, borderRadius: radii.sm, backgroundColor: colors.overlaySoft, justifyContent: "center", alignItems: "center", marginRight: spacing.md, }, nextClassContent: { flex: 1, }, nextClassLabel: { fontSize: 11, fontWeight: "700", color: colors.textSubtle, letterSpacing: 0.8, marginBottom: 3, }, nextClassName: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 3, }, nextClassInfo: { fontSize: 13, color: colors.textMuted, marginBottom: 2, }, nextClassProfessor: { fontSize: 12, color: colors.textSubtle, },
  
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    borderRadius: radii.md,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  message: {
    fontSize: 15,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 6,
    color: colors.textMuted,
  },
  date: {
    fontSize: 12,
    color: colors.textSubtle,
  },
  deleteButton: {
    padding: 6,
    alignSelf: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    ...layout.modalOverlay,
  },
  modalContent: {
    backgroundColor: colors.cardLight,
    padding: spacing.xl,
    borderRadius: radii.md,
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
