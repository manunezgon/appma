import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../context/UserContext";
import { usePayments } from "../../context/PaymentsContext";
import styles from "../../Styles/PaymentHistoryStyles";
import { colors } from "../../Styles/theme";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function PaymentHistoryModal({ visible, onClose }) {
  const { user } = useUser();
  const { payments, loadingPayments, fetchPaymentsByUser } = usePayments();

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (visible && user?.id) {
      fetchPaymentsByUser(user.id);
    }
  }, [visible, user?.id, fetchPaymentsByUser]);

  const getPaymentForMonth = (monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, "0");
    const monthString = `${currentYear}-${month}`;

    return payments.find(
      (payment) => payment.monthPaid === monthString,
    );
  };

  const getPaymentLabel = (payment) => {
    if (!payment) {
      return "Not paid";
    }

    if (payment.type === "GLOBAL") {
      return "Global Pass";
    }

    return `${payment.lessonName}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>Payment History {currentYear}</Text>
          </View>

          {loadingPayments ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.loader}
            />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.historyScroll}
            >
              <View style={styles.historyList}>
                {MONTHS.map((monthName, index) => {
                  const payment = getPaymentForMonth(index);
                  const isPaid = !!payment;

                  return (
                    <View key={monthName} style={styles.paymentRow}>
                      <Text style={styles.month}>{monthName}</Text>

                      <View style={styles.modalityContainer}>
                        <Text
                          style={[
                            styles.modality,
                            isPaid
                              ? styles.modalityPaid
                              : styles.modalityPending,
                          ]}
                        >
                          {getPaymentLabel(payment)}
                        </Text>
                        <View
                          style={[
                            styles.statusIcon,
                            isPaid ? styles.statusPaid : styles.statusPending,
                          ]}
                        >
                          <Ionicons
                            name={isPaid ? "checkmark" : "close"}
                            size={14}
                            color={colors.text}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
