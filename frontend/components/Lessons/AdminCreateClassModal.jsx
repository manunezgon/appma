import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";

export default function AdminCreateClassModal({
  visible,
  onClose,

  createMode,
  setCreateMode,

  lessonsList,
  selectedLessonId,
  setSelectedLessonId,

  newStartTime,
  setNewStartTime,
  newEndTime,
  setNewEndTime,

  newLessonName,
  setNewLessonName,
  newProfessorName,
  setNewProfessorName,

  onCreateExisting,
  onCreateNew,
}) {
  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.adminModal}>
        <Text style={styles.Title}>Crear Clase</Text>

        {/* Selección modo */}
        {!createMode && (
          <>
            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => setCreateMode("new")}
            >
              <Text style={styles.modeButtonText}>Crear nueva clase</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeButton}
              onPress={() => setCreateMode("existing")}
            >
              <Text style={styles.modeButtonText}>
                Usar clase existente
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Crear nueva lesson */}
        {createMode === "new" && (
          <>
            <TextInput
              placeholder="Nombre de la clase"
              placeholderTextColor="#888"
              value={newLessonName}
              onChangeText={setNewLessonName}
              style={styles.input}
            />

            <TextInput
              placeholder="Profesor"
              placeholderTextColor="#888"
              value={newProfessorName}
              onChangeText={setNewProfessorName}
              style={styles.input}
            />

            <TextInput
              placeholder="Hora inicio (HH:MM)"
              placeholderTextColor="#888"
              value={newStartTime}
              onChangeText={setNewStartTime}
              style={styles.input}
            />

            <TextInput
              placeholder="Hora fin (HH:MM)"
              placeholderTextColor="#888"
              value={newEndTime}
              onChangeText={setNewEndTime}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={onCreateNew}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Guardar
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Usar lesson existente */}
        {createMode === "existing" && (
          <>
            <Picker
              selectedValue={selectedLessonId}
              onValueChange={(value) => setSelectedLessonId(value)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona una clase" value={null} />

              {lessonsList.map((lesson) => (
                <Picker.Item
                  key={lesson.id}
                  label={`${lesson.lessonName} - ${lesson.professorName}`}
                  value={lesson.id}
                />
              ))}
            </Picker>

            <TextInput
              placeholder="Hora inicio (HH:MM)"
              placeholderTextColor="#888"
              value={newStartTime}
              onChangeText={setNewStartTime}
              style={styles.input}
            />

            <TextInput
              placeholder="Hora fin (HH:MM)"
              placeholderTextColor="#888"
              value={newEndTime}
              onChangeText={setNewEndTime}
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={onCreateExisting}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Guardar
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  adminModal: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
  },

  Title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  modeButton: {
    backgroundColor: "#3a3a3a",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },

  modeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444",
  },

  picker: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderRadius: 8,
    marginBottom: 12,
  },

  saveButton: {
    backgroundColor: "#6C3BFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});