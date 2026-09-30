import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import {
  FlatList,
  Modal,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";

import { PaymentRow } from "./PaymentRow";
import { createPaymentStyles } from "../../Styles/PaymentStyle";
import { useTheme } from "../../context/ThemeContext";

export const PaymentModal = ({
  visible,
  mode,
  student,
  payments,
  onDelete,
  onRegister,
  onBack,
  loadingPayments,
  lessons,
  months,
  paidMonths,
  selectedLessonId,
  setSelectedLessonId,
  selectedMonth,
  setSelectedMonth,
  onConfirm,
  registering,
  onClose,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const style = createPaymentStyles(colors);

  const [isGlobal, setIsGlobal] = useState(false);

  const handleConfirm = () => {
    onConfirm({
      lessonId: selectedLessonId,
      monthPaid: selectedMonth,
      isGlobal,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={style.modalOverlay}>
        <View style={style.modalContent}>
          {mode === "student" && (
            <>
              <Text style={style.modalTitle}>{student?.name}</Text>

              {loadingPayments ? (
                <Text style={style.loadingText}>
                  {t("payments.loadingPayments")}
                </Text>
              ) : payments.length === 0 ? (
                <Text style={style.noPaymentsText}>
                  {t("payments.noPayments")}
                </Text>
              ) : (
                <FlatList
                  data={payments}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <PaymentRow payment={item} onDelete={onDelete} />
                  )}
                  style={style.paymentsList}
                />
              )}

              <TouchableOpacity
                style={style.registerButton}
                onPress={onRegister}
              >
                <Text style={style.registerButtonText}>
                  {t("payments.registerPayment")}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {mode === "register" && (
            <>
              <Text style={style.modalTitle}>
                {t("payments.registerPayment")}
              </Text>

              <Text style={style.modalSubtitle}>
                {t("payments.student")}: {student?.name}
              </Text>

              <View style={style.globalSwitchContainer}>
                <Text style={style.globalSwitchLabel}>
                  {t("payments.globalPayment")}
                </Text>

                <Switch value={isGlobal} onValueChange={setIsGlobal} />
              </View>

              {!isGlobal && (
                <>
                  <Text style={style.modalSubtitle}>
                    {t("payments.selectLesson")}
                  </Text>

                  <View style={style.pickerContainer}>
                    <RNPickerSelect
                      value={selectedLessonId}
                      onValueChange={setSelectedLessonId}
                      items={lessons.map((lesson) => ({
                        label: `${lesson.lessonName} (${lesson.professorName})`,
                        value: lesson.id,
                      }))}
                      placeholder={{
                        label: t("payments.selectLessonPlaceholder"),
                        value: null,
                        color: colors.textSubtle,
                      }}
                      useNativeAndroidPickerStyle={false}
                      Icon={() => (
                        <Ionicons
                          name="chevron-down"
                          size={20}
                          color={colors.text}
                        />
                      )}
                      style={{
                        inputIOS: style.picker,
                        inputAndroid: style.picker,
                        placeholder: {
                          color: colors.textSubtle,
                        },
                        iconContainer: {
                          top: 14,
                          right: 12,
                        },
                      }}
                    />
                  </View>
                </>
              )}

              <Text style={style.modalSubtitle}>
                {t("payments.selectMonth")}
              </Text>

              <View style={style.pickerContainer}>
                <RNPickerSelect
                  value={selectedMonth}
                  onValueChange={setSelectedMonth}
                  items={months.map((month) => ({
                    label: paidMonths?.includes(month.value)
                      ? `${month.label} (${t("payments.paid")})`
                      : month.label,
                    value: month.value,
                    disabled: paidMonths?.includes(month.value),
                  }))}
                  placeholder={{
                    label: t("payments.selectMonthPlaceholder"),
                    value: "",
                    color: colors.textSubtle,
                  }}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => (
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={colors.text}
                    />
                  )}
                  style={{
                    inputIOS: style.picker,
                    inputAndroid: style.picker,
                    placeholder: {
                      color: colors.textSubtle,
                    },
                    iconContainer: {
                      top: 14,
                      right: 12,
                    },
                  }}
                />
              </View>

              <TouchableOpacity
                style={style.registerButton}
                onPress={handleConfirm}
                disabled={
                  registering ||
                  (!isGlobal && !selectedLessonId) ||
                  !selectedMonth
                }
              >
                <Text style={style.registerButtonText}>
                  {registering
                    ? t("payments.registering")
                    : t("payments.confirmPayment")}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={style.closeButton}
            onPress={mode === "register" ? onBack : onClose}
          >
            <Ionicons
              name={mode === "register" ? "arrow-back" : "close"}
              size={28}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
