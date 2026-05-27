import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Modal from "react-native-modal";

import styles from "../../Styles/LessonStyles.jsx";

export default function PaymentErrorModal({
  visible,
  message,
  onClose,
}) {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
    >
      <View style={styles.errorModal}>
        <View style={styles.modalHeader}>
          <Text style={styles.Content}>
            {message ||
              "Please pay the current month to access this class."}
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