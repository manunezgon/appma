import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from "../app/config.jsx";

export default function CreateScheduleModal({ visible, onClose, token }) {
  const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
  fetch(`${API_BASE_URL}/lessons`, {
    headers: {
      Authorization: `Bearer ${token}` 
    }
  })
    .then(res => res.json())
    .then(data => {
      setLessons(data);
      if (data.length > 0) setSelectedLesson(data[0].id);
    })
    .catch(err => console.error(err));
}, []);


  const handleSave = async () => {
    if (!selectedLesson) {
      Alert.alert("Selecciona una lección");
      return;
    }

    if (endTime <= startTime) {
      Alert.alert("La hora de fin debe ser posterior a la de inicio");
      return;
    }

    try {
      const payload = {
        dayOfWeek,
        startTime: startTime.getHours().toString().padStart(2,'0') + ':' + startTime.getMinutes().toString().padStart(2,'0'),
        endTime: endTime.getHours().toString().padStart(2,'0') + ':' + endTime.getMinutes().toString().padStart(2,'0'),
        lessonId: selectedLesson
      };

      const res = await fetch(`${API_BASE_URL}/scheduleTemplates`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });


      if (res.ok) {
        Alert.alert("Horario creado");
        onClose();
      } else {
        const text = await res.text();
        console.error("Error backend:", text);
        Alert.alert("Error al crear horario");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error al crear horario");
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <Text style={styles.modalTitle}>Crear horario nuevo</Text>

            {/* Día de la semana */}
            <Text style={styles.label}>Día de la semana:</Text>
            <Picker selectedValue={dayOfWeek} onValueChange={setDayOfWeek} style={styles.picker}>
              {["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"].map(day => (
                <Picker.Item key={day} label={day} value={day} />
              ))}
            </Picker>

            {/* Hora de inicio */}
            <Text style={styles.label}>Hora de inicio:</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timeButton}>
              <Text>{startTime.toTimeString().substring(0,5)}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowStartPicker(false);
                  if (date) setStartTime(date);
                }}
              />
            )}

            {/* Hora de fin */}
            <Text style={styles.label}>Hora de fin:</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timeButton}>
              <Text>{endTime.toTimeString().substring(0,5)}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (date) setEndTime(date);
                }}
              />
            )}

            {/* Lección */}
            <Text style={styles.label}>Lección:</Text>
            <Picker selectedValue={selectedLesson} onValueChange={setSelectedLesson} style={styles.picker}>
              {lessons.map(lesson => (
                <Picker.Item
                key={lesson.id}
                label={`${lesson.lessonName} - ${lesson.professorName}`}
                value={lesson.id}
                />
              ))}
            </Picker>

            <TouchableOpacity onPress={handleSave} style={[styles.button, {marginTop: 20}]}>
              <Text style={styles.buttonText}>Guardar horario</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' },
  modalContent: { width:'90%', backgroundColor:'#fff', padding:20, borderRadius:10 },
  modalScroll: { flexGrow:1, justifyContent:'center', alignItems:'center' },
  modalTitle: { fontSize:20, fontWeight:'bold', marginBottom:10 },
  label: { fontSize:16, marginTop:10 },
  picker: { width:'90%' },
  timeButton: { width:'90%', padding:12, borderWidth:1, borderColor:'#ccc', borderRadius:8, marginTop:5 },
  button: { backgroundColor:'#69188E', paddingVertical:12, paddingHorizontal:20, borderRadius:8, width:'70%', marginTop:10 },
  buttonText: { color:'#fff', textAlign:'center', fontSize:16 },
  cancelButton: { backgroundColor:'#aaa' }
});
