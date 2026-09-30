import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { createProfileStyles } from "../../Styles/ProfileStyles";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

export default function PaymentStatusCard({ payment, month, onHistoryPress }) {
  const { t } = useTranslation();

    const { colors } = useTheme();
    const styles = createProfileStyles(colors);

  const formatMonth = (monthString) => {
    const [year, monthNumber] = monthString.split("-");

    return `${t(`paymentHistory.months.${Number(monthNumber) - 1}`)} ${year}`;
  };

  const getPaymentModality = () => {
    if (!payment) {
      return t("paymentHistory.notPaid");
    }

    if (payment.type === "GLOBAL") {
      return t("paymentHistory.globalPass");
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
        <Text style={styles.paymentHistoryText}>
          {t("paymentHistory.viewHistory")}
        </Text>
        
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
}
