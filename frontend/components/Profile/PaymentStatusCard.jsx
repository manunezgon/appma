import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../Styles/theme";
import styles from "../../Styles/ProfileStyles";

export default function PaymentStatusCard({ payment, month, onHistoryPress }) {
  const formatMonth = (monthString) => {
    const [year, monthNumber] = monthString.split("-");
    const date = new Date(Number(year), Number(monthNumber) - 1);

    return date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getPaymentModality = () => {
    if (!payment) {
      return "Not paid";
    }

    if (payment.type === "GLOBAL") {
      return "Global Pass";
    }

    return `${payment.lessonName}`;
  };

  const isPaid = !!payment;


  return (
    <View style={styles.paymentBox}>
      <View style={styles.paymentInfo}>
        <View>
          <Text style={styles.paymentMonth}>{formatMonth(month)}</Text>

          <Text
            style={[
              styles.paymentModality,
              isPaid
                ? styles.paymentModalityPaid
                : styles.paymentModalityPending,
            ]}
          >
            {getPaymentModality()}
          </Text>
        </View>

        <View
          style={[
            styles.paymentStatusIcon,
            isPaid ? styles.paymentStatusPaid : styles.paymentStatusPending,
          ]}
        >
          <Ionicons
            name={isPaid ? "checkmark" : "close"}
            size={16}
            color={colors.text}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.paymentHistoryButton}
        onPress={onHistoryPress}
      >
        <Text style={styles.paymentHistoryText}>View payment history</Text>

        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
}
