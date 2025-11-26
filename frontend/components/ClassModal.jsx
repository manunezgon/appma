import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";

export default function ClassModal({ visible, onClose, onSubmit, initialData = {}, lessons = [] }) {
  const [day, setDay] = useState(initialData.dayOfWeek || "MONDAY");
  const [startTime, setStartTime] = useState(initialData.startTime || "");
  const [endTime, setEndTime] = useState(initialData.endTime || "");
  const [lessonId, setLessonId] = useState(initialData.lessonId || (lessons[0]?.id || ""));

  useEffect(() => {
    setDay(initialData.dayOfWeek || "MONDAY");
    setStartTime(initialData.startTime || "");
    setEndTime(initialData.endTime || "");
    setLessonId(initialData.lessonId || (lessons[0]?.id || ""));
  }, [initialData]);

  const handleSave = () => {
    if (!startTime || !endTime || !lessonId) return;
    onSubmit({ dayOfWeek: day, startTime, endTime, lessonId });
    onClose();
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modal}>
        <Text style={styles.label}>Día de la semana</Text>
        <Picker selectedValue={day} onValueChange={setDay}>
          {["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"].map(d => (
            <Picker.Item label={d} value={d} key={d} />
          ))}
        </Picker>

        <Text style={styles.label}>Hora inicio (HH:mm)</Text>
        <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} placeholder="09:00" />

        <Text style={styles.label}>Hora fin (HH:mm)</Text>
        <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} placeholder="10:00" />

        <Text style={styles.label}>Lección</Text>
        <Picker selectedValue={lessonId} onValueChange={setLessonId}>
          {lessons.map(lesson => (
            <Picker.Item label={lesson.lessonName} value={lesson.id} key={lesson.id} />
          ))}
        </Picker>

        <Button title="Guardar" onPress={handleSave} />
        <Button title="Cancelar" onPress={onClose} color="gray" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { backgroundColor: "#fff", padding: 20, borderRadius: 12 },
  label: { marginTop: 10, marginBottom: 4, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 10 }
});
