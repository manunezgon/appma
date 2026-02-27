import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useLessons } from "../context/LessonsContext";
import { useSchedules } from "../context/SchedulesContext";
import DayPicker from "./DayPicker";
import LessonSummary from "./LessonSummary";
import SelectableList from "./SelectableList";
import TextInputField from "./TextInputField";

export default function ScheduleWizardModal({ onClose }) {
  const { lessons, loadingLessons, createLesson, updateLesson, deleteLesson } =
    useLessons();
  const {
    schedules,
    loadingSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useSchedules();

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(null); // create | editSchedule | editLesson
  const [lessonMode, setLessonMode] = useState(null); // new | existing

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [newLessonName, setNewLessonName] = useState("");
  const [newProfessorName, setNewProfessorName] = useState("");
  const [newAmountMonthly, setNewAmountMonthly] = useState("");

  const totalSteps = 5;

  const daysOfWeek = [
    { label: "Lunes", value: "MONDAY" },
    { label: "Martes", value: "TUESDAY" },
    { label: "Miércoles", value: "WEDNESDAY" },
    { label: "Jueves", value: "THURSDAY" },
    { label: "Viernes", value: "FRIDAY" },
    { label: "Sábado", value: "SATURDAY" },
    { label: "Domingo", value: "SUNDAY" },
  ];

  // --- Reset state ---
  const resetState = () => {
    setStep(1);
    setMode(null);
    setLessonMode(null);
    setSelectedLessonId(null);
    setSelectedScheduleId(null);
    setSelectedDay(null);
    setStartTime("");
    setEndTime("");
    setNewLessonName("");
    setNewProfessorName("");
    setNewAmountMonthly("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // --- Guardar horario ---
  const handleSaveSchedule = async () => {
    if (!selectedDay || !startTime || !endTime) {
      Alert.alert("Por favor completa el día, hora inicio y hora fin");
      return;
    }

    try {
      let lessonIdToUse = selectedLessonId;

      // --- Crear lesson si es nueva ---
      if (lessonMode === "new") {
        if (!newLessonName || !newProfessorName || !newAmountMonthly) {
          Alert.alert("Completa todos los datos de la lesson");
          return;
        }

        const lesson = await createLesson({
          lessonName: newLessonName,
          professorName: newProfessorName,
          amountMonthly: parseFloat(newAmountMonthly),
        });

        lessonIdToUse = lesson.id;
      }

      // --- Crear o actualizar schedule ---
      if (mode === "editSchedule") {
        await updateSchedule(selectedScheduleId, {
          lessonId: lessonIdToUse,
          dayOfWeek: selectedDay,
          startTime,
          endTime,
        });
      } else {
        await createSchedule({
          lessonId: lessonIdToUse,
          dayOfWeek: selectedDay,
          startTime,
          endTime,
        });
      }

      Alert.alert(
        mode === "editSchedule"
          ? "Horario actualizado correctamente"
          : "Horario creado correctamente",
      );

      handleClose();
    } catch (error) {
      Alert.alert(error.message || "Error guardando horario");
    }
  };

  // --- Borrar horario ---
  const handleDeleteSchedule = () => {
    Alert.alert("Eliminar horario", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSchedule(selectedScheduleId);
            Alert.alert("Horario eliminado correctamente");
            handleClose();
          } catch (error) {
            Alert.alert(error.message);
          }
        },
      },
    ]);
  };

  // --- Actualizar lessons ---
  const handleUpdateLesson = async () => {
    if (!newLessonName || !newProfessorName || !newAmountMonthly) {
      Alert.alert("Completa todos los campos");
      return;
    }

    try {
      await updateLesson(selectedLessonId, {
        lessonName: newLessonName,
        professorName: newProfessorName,
        amountMonthly: parseFloat(newAmountMonthly),
      });

      Alert.alert("Lesson actualizada correctamente");
      handleClose();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // --- Borrar lesson ---
  const handleDeleteLesson = () => {
    Alert.alert(
      "Eliminar lesson",
      "¿Estás seguro? Se borrarán también los horarios asociados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLesson(selectedLessonId);
              Alert.alert("Lesson eliminada correctamente");
              handleClose();
            } catch (error) {
              Alert.alert(error.message);
            }
          },
        },
      ],
    );
  };

  // --- Botón atras ---
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  // --- Helper para la lesson seleccionada ---
  const selectedLessonObj =
    lessonMode === "new"
      ? {
          lessonName: newLessonName,
          professorName: newProfessorName,
          amountMonthly: parseFloat(newAmountMonthly),
        }
      : mode === "editSchedule"
        ? lessons.find((l) => l.id === selectedLessonId) // traemos la lesson completa para mostrar amountMonthly
        : lessons.find((l) => l.id === selectedLessonId);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>Gestión de horarios</Text>
        <Text style={styles.stepIndicator}>
          Paso {step} de {totalSteps}
        </Text>

        {/* ---------------- STEP 1 ---------------- */}
        {step === 1 && (
          <>
            <Text style={styles.subtitle}>¿Qué quieres hacer?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setMode("create");
                setLessonMode(null);
                setSelectedLessonId(null);
                setSelectedScheduleId(null);
                setStep(2);
              }}
            >
              <Text style={styles.buttonText}>Crear horario nuevo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setMode("editSchedule");
                setLessonMode("existing");
                setSelectedLessonId(null);
                setSelectedScheduleId(null);
                setStep(2);
              }}
            >
              <Text style={styles.buttonText}>Modificar horario existente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setMode("editLesson");
                setLessonMode("existing");
                setSelectedLessonId(null);
                setSelectedScheduleId(null);
                setStep(2);
              }}
            >
              <Text style={styles.buttonText}>Modificar lesson existente</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ---------------- STEP 2 ---------------- */}
        {step === 2 && mode === "create" && (
          <>
            <Text style={styles.subtitle}>¿Qué tipo de lesson quieres?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setLessonMode("new");
                setStep(3);
              }}
            >
              <Text style={styles.buttonText}>Crear lesson nueva</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setLessonMode("existing");
                setStep(3);
              }}
            >
              <Text style={styles.buttonText}>Usar lesson existente</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && mode === "editSchedule" && (
          <>
            <Text style={styles.subtitle}>
              Selecciona un horario para modificar
            </Text>

            {loadingSchedules ? (
              <Text>Cargando horarios...</Text>
            ) : schedules.length === 0 ? (
              <Text>No hay horarios disponibles</Text>
            ) : (
              <SelectableList
                items={schedules}
                selectedId={selectedScheduleId}
                onSelect={(id) => {
                  const sched = schedules.find((s) => s.id === id);

                  setSelectedScheduleId(id);
                  setSelectedLessonId(sched.lessonId);
                  setLessonMode("existing");

                  setSelectedDay(sched.dayOfWeek);
                  setStartTime(sched.startTime);
                  setEndTime(sched.endTime);

                  setStep(3);
                }}
                renderItem={(sched) => (
                  <>
                    <Text style={{ color: "#fff" }}>
                      {sched.lessonName} - {sched.professorName}
                      {"\n"}
                      {sched.dayOfWeek} {sched.startTime}-{sched.endTime}
                    </Text>
                  </>
                )}
              />
            )}
          </>
        )}

        {step === 2 && mode === "editLesson" && (
          <>
            <Text style={styles.subtitle}>
              Selecciona una lesson para modificar
            </Text>

            {loadingLessons ? (
              <Text>Cargando lessons...</Text>
            ) : (
              <SelectableList
                items={lessons}
                selectedId={selectedLessonId}
                onSelect={(id) => {
                  const lesson = lessons.find((l) => l.id === id);

                  setSelectedLessonId(id);
                  setNewLessonName(lesson.lessonName);
                  setNewProfessorName(lesson.professorName);
                  setNewAmountMonthly(String(lesson.amountMonthly));

                  setStep(3);
                }}
                renderItem={(l) => (
                  <Text style={{ color: "#fff" }}>
                    {l.lessonName} - {l.professorName} (${l.amountMonthly})
                  </Text>
                )}
              />
            )}
          </>
        )}

        {/* ---------------- STEP 3 ---------------- */}
        {step === 3 && (
          <>
            {mode === "editLesson" && (
              <>
                <Text style={styles.subtitle}>Editar lesson</Text>

                <Text>Nombre</Text>
                <TextInputField
                  value={newLessonName}
                  onChangeText={setNewLessonName}
                />

                <Text>Profesor</Text>
                <TextInputField
                  value={newProfessorName}
                  onChangeText={setNewProfessorName}
                />

                <Text>Precio mensual</Text>
                <TextInputField
                  value={newAmountMonthly}
                  onChangeText={setNewAmountMonthly}
                  keyboardType="numeric"
                />

                <TouchableOpacity
                  style={[styles.button, { marginTop: 10 }]}
                  onPress={handleUpdateLesson}
                >
                  <Text style={styles.buttonText}>Guardar cambios</Text>
                </TouchableOpacity>
                {mode === "editLesson" && selectedLessonId && (
                  <TouchableOpacity
                    style={[styles.deleteButton, { marginTop: 10 }]}
                    onPress={handleDeleteLesson}
                  >
                    <Text style={styles.deleteButtonText}>Borrar lesson</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {mode !== "editLesson" && (
              <>
                {lessonMode === "new" && mode === "create" && (
                  <>
                    <Text style={styles.subtitle}>
                      Nombre de la nueva lesson
                    </Text>
                    <TextInputField
                      value={newLessonName}
                      onChangeText={setNewLessonName}
                      placeholder="Ej: Yoga avanzado"
                    />
                    <Text style={styles.subtitle}>Profesor</Text>
                    <TextInputField
                      value={newProfessorName}
                      onChangeText={setNewProfessorName}
                      placeholder="Nombre del profesor"
                    />
                    <Text style={styles.subtitle}>Precio mensual</Text>
                    <TextInputField
                      value={newAmountMonthly}
                      onChangeText={setNewAmountMonthly}
                      placeholder="Ej: 35"
                      keyboardType="numeric"
                    />
                  </>
                )}

                {lessonMode === "existing" && mode === "create" && (
                  <>
                    <Text style={styles.subtitle}>Selecciona una lesson</Text>
                    {loadingLessons ? (
                      <Text>Cargando lessons...</Text>
                    ) : (
                      <SelectableList
                        items={lessons}
                        selectedId={selectedLessonId}
                        onSelect={setSelectedLessonId}
                        renderItem={(l) => (
                          <Text style={{ color: "#fff" }}>
                            {l.lessonName} - {l.professorName} ($
                            {l.amountMonthly})
                          </Text>
                        )}
                      />
                    )}
                  </>
                )}

                {lessonMode === "existing" && mode === "editSchedule" && (
                  <>
                    <Text style={styles.subtitle}>Editar horario</Text>
                    <LessonSummary
                      lesson={selectedLessonObj}
                      day={selectedDay}
                      startTime={startTime}
                      endTime={endTime}
                    />
                  </>
                )}

                <TouchableOpacity
                  style={[styles.button, { marginTop: 10 }]}
                  // Paso 3 - botón "Siguiente"
                  onPress={() => {
                    if (lessonMode === "new") {
                      if (
                        !newLessonName ||
                        !newProfessorName ||
                        !newAmountMonthly
                      ) {
                        Alert.alert("Completa todos los datos de la lesson");
                        return;
                      }
                    }

                    if (lessonMode === "existing" && !selectedLessonId) {
                      Alert.alert("Selecciona una lesson");
                      return;
                    }

                    setStep(4); // pasar al día/hora
                  }}
                >
                  <Text style={styles.buttonText}>Siguiente</Text>
                </TouchableOpacity>

                {mode === "editSchedule" && (
                  <TouchableOpacity
                    style={[styles.deleteButton, { marginTop: 10 }]}
                    onPress={handleDeleteSchedule}
                  >
                    <Text style={styles.deleteButtonText}>Borrar horario</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        )}

        {/* ---------------- STEP 4 ---------------- */}
        {step === 4 && (
          <>
            <Text style={styles.subtitle}>Selecciona el día y hora</Text>
            <DayPicker
              days={daysOfWeek}
              selectedDay={selectedDay}
              onSelect={setSelectedDay}
            />
            <Text style={{ marginTop: 10 }}>Hora inicio</Text>
            <TextInputField
              value={startTime}
              onChangeText={setStartTime}
              placeholder="Ej: 18:00"
            />
            <Text>Hora fin</Text>
            <TextInputField
              value={endTime}
              onChangeText={setEndTime}
              placeholder="Ej: 19:00"
            />

            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => setStep(5)}
            >
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ---------------- STEP 5 ---------------- */}
        {step === 5 && (
          <>
            <Text style={styles.subtitle}>
              {mode === "editSchedule"
                ? "Confirmar cambios"
                : "Confirmar horario"}
            </Text>
            <LessonSummary
              lesson={selectedLessonObj}
              day={selectedDay}
              startTime={startTime}
              endTime={endTime}
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={handleSaveSchedule}
            >
              <Text style={styles.buttonText}>
                {mode === "editSchedule"
                  ? "Guardar cambios"
                  : "Guardar horario"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ---------------- Botones atrás / cancelar ---------------- */}
        <View style={styles.bottomButtons}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Text style={styles.buttonText}>Atrás</Text>
            </TouchableOpacity>
          )}
          {step > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  inner: { paddingBottom: 50 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  stepIndicator: { marginBottom: 15, color: "#fff" },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#fff",
  },
  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#1976D2",
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: { flex: 1, marginRight: 5, backgroundColor: "#757575" },
  cancelButton: { flex: 1, marginLeft: 5, backgroundColor: "#E53935" },
});
