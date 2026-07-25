import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { useEffect, useState } from "react";
import { Modal, Switch, Text, TouchableOpacity, View } from "react-native";
import style from "../../Styles/PaymentStyle";
import { colors } from "../../Styles/theme";

export const PaymentModal = ({
  visible,
  student,
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
  const [isGlobal, setIsGlobal] = useState(false);

  useEffect(() => {
    if (!visible) {
      setIsGlobal(false);
      setSelectedLessonId(null);
      setSelectedMonth("");
    }
  }, [visible, setSelectedLessonId, setSelectedMonth]);

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
          <Text style={style.modalTitle}>Register Payment</Text>
          <Text style={style.modalSubtitle}>Student: {student?.name}</Text>

          <View style={style.globalSwitchContainer}>
            <Text style={style.globalSwitchLabel}>Global payment</Text>
            <Switch value={isGlobal} onValueChange={setIsGlobal} />
          </View>

          {!isGlobal && (
            <>
              <Text style={style.modalSubtitle}>Select lesson</Text>
              <View style={style.pickerContainer}>
                <RNPickerSelect
                  value={selectedLessonId}
                  itemKey={selectedLessonId}
                  onValueChange={setSelectedLessonId}
                  items={lessons.map((lesson) => ({
                    label: `${lesson.lessonName} (${lesson.professorName})`,
                    value: lesson.id,
                  }))}
                  placeholder={{
                    label: "Select a lesson...",
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

          <Text style={style.modalSubtitle}>Select month</Text>
          <View style={style.pickerContainer}>
            <RNPickerSelect
              value={selectedMonth}
              itemKey={selectedMonth}
              onValueChange={setSelectedMonth}
              items={months.map((month) => ({
                label: paidMonths?.includes(month.value)
                  ? `${month.label} (Paid)`
                  : month.label,
                value: month.value,
                disabled: paidMonths?.includes(month.value),
              }))}
              placeholder={{
                label: "Select a month...",
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
              registering || (!isGlobal && !selectedLessonId) || !selectedMonth
            }
          >
            <Text style={style.registerButtonText}>
              {registering ? "Registering.." : "Confirm Payment"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
