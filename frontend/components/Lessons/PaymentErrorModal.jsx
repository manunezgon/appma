import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";

import { createLessonStyles } from "../../Styles/LessonStyles.jsx";
import { useTheme } from "../../context/ThemeContext";

export default function PaymentErrorModal({
  visible,
  message,
  onClose,
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = createLessonStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.errorModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.Content}>
              {message || t("payments.payCurrentMonth")}
            </Text>

            <Ionicons
              name="close"
              size={28}
              style={styles.closenonpaidIcon}
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
