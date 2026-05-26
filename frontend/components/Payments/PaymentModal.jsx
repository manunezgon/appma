import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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
                <Picker
                  selectedValue={selectedLessonId}
                  onValueChange={setSelectedLessonId}
                  style={style.picker}
                >
                  <Picker.Item label="Select a lesson..." value={null} />
                  {lessons.map((lesson) => (
                    <Picker.Item
                      key={lesson.id}
                      label={`${lesson.lessonName} (${lesson.professorName})`}
                      value={lesson.id}
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <Text style={style.modalSubtitle}>Select month</Text>
          <View style={style.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={setSelectedMonth}
              style={style.picker}
            >
              <Picker.Item label="Select a month..." value="" />
              {months.map((month) => {
                const isPaid = paidMonths?.includes(month.value);

                return (
                  <Picker.Item
                    key={month.value}
                    label={isPaid ? `${month.label} (Paid)` : month.label}
                    value={month.value}
                    enabled={!isPaid}
                  />
                );
              })}
            </Picker>
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
