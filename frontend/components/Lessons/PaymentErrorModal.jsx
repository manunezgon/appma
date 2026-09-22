import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import Modal from "react-native-modal";

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
    <Modal isVisible={visible} onBackdropPress={onClose}>
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
    </Modal>
  );
}