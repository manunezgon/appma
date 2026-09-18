import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import style from "../../Styles/PaymentStyle";
import { colors } from "../../Styles/theme";

const PaymentRowComponent = ({ payment, onDelete }) => {
  const { t } = useTranslation();

  const formatMonth = (monthString) => {
    const [year, month] = monthString.split("-");
    const date = new Date(year, month - 1);

    return `${t(
      `paymentHistory.months.${date.getMonth()}`,
    )} ${date.getFullYear()}`;
  };

  const confirmDelete = useCallback(() => {
    Alert.alert(
      t("payments.deletePayment"),
      t("payments.confirmDeletePayment"),
      [
        {
          text: t("payments.cancel"),
          style: "cancel",
        },
        {
          text: t("payments.delete"),
          style: "destructive",
          onPress: () => onDelete(payment.id),
        },
      ],
    );
  }, [onDelete, payment.id, t]);

  return (
    <View style={style.paymentRow}>
      <View style={style.paymentInfo}>
        <Text style={style.modalityName}>
          {t("payments.month")}: {formatMonth(payment.monthPaid)}
        </Text>
        <Text style={style.modalityStatus}>
          {t("payments.lesson")}: {payment.lessonName} ({payment.professorName}
          )
        </Text>
      </View>
      <TouchableOpacity onPress={confirmDelete}>
        <Ionicons name="trash-outline" size={22} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );
};

export const PaymentRow = memo(PaymentRowComponent);
