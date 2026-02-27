import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import DayPicker from "./DayPicker";
import LessonSummary from "./LessonSummary";
import SelectableList from "./SelectableList";
import TextInputField from "./TextInputField";

export default function ScheduleWizardModal({
  visible,
  onClose,
  token,
  API_BASE_URL,
}) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(null); // create | editSchedule | editLesson
  const [lessonMode, setLessonMode] = useState(null); // new | existing

  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState(null);
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
    setSelectedLesson(null);
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

  // --- Fetch lessons ---
  const fetchLessons = async () => {
    setLoadingLessons(true);
    try {
      const res = await fetch(`${API_BASE_URL}/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLessons(data);
      } else Alert.alert("Error cargando las lessons");
    } catch (err) {
      console.error(err);
      Alert.alert("Error del servidor");
    } finally {
      setLoadingLessons(false);
    }
  };

  useEffect(() => {
    if (visible && (lessonMode === "existing" || mode === "editLesson")) {
      fetchLessons();
    }
  }, [visible, lessonMode, mode]);

  // --- Fetch schedules ---
  const fetchSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const res = await fetch(`${API_BASE_URL}/scheduleTemplates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      } else Alert.alert("Error cargando los horarios");
    } catch (err) {
      console.error(err);
      Alert.alert("Error del servidor");
    } finally {
      setLoadingSchedules(false);
    }
  };

  useEffect(() => {
    if (visible && mode === "editSchedule") fetchSchedules();
  }, [visible, mode]);

  // --- Guardar horario ---
  const handleSaveSchedule = async () => {
    if (!selectedDay || !startTime || !endTime) {
      Alert.alert("Por favor completa el día, hora inicio y hora fin");
      return;
    }

    try {
      let lessonIdToUse = selectedLesson;

      if (lessonMode === "new") {
        const resLesson = await fetch(`${API_BASE_URL}/lessons/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lessonName: newLessonName,
            professorName: newProfessorName,
            amountMonthly: parseFloat(newAmountMonthly),
          }),
        });
        if (!resLesson.ok) {
          Alert.alert("Error creando la lesson");
          return;
        }
        const lessonData = await resLesson.json();
        lessonIdToUse = lessonData.id;
      }

      const url =
        mode === "editSchedule"
          ? `${API_BASE_URL}/scheduleTemplates/${selectedLesson}`
          : `${API_BASE_URL}/scheduleTemplates`;

      const method = mode === "editSchedule" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId: lessonIdToUse,
          dayOfWeek: selectedDay,
          startTime,
          endTime,
        }),
      });

      if (res.ok) {
        Alert.alert(
          mode === "editSchedule"
            ? "Horario actualizado correctamente"
            : "Horario creado correctamente",
        );
        handleClose();
      } else Alert.alert("Error guardando horario");
    } catch (err) {
      console.error(err);
      Alert.alert("Error del servidor");
    }
  };

  // --- Borrar horario ---

  const handleDeleteSchedule = async () => {
    Alert.alert(
      "Eliminar horario",
      "¿Estás seguro de que quieres eliminar este horario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(
                `${API_BASE_URL}/scheduleTemplates/${selectedLesson}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (res.ok) {
                Alert.alert("Horario eliminado correctamente");
                handleClose();
              } else {
                Alert.alert("Error eliminando el horario");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error del servidor");
            }
          },
        },
      ],
    );
  };

  // --- Actualizar lessons ---
  const handleUpdateLesson = async () => {
    if (!newLessonName || !newProfessorName || !newAmountMonthly) {
      Alert.alert("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/lessons/${selectedLesson}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonName: newLessonName,
          professorName: newProfessorName,
          amountMonthly: parseFloat(newAmountMonthly),
        }),
      });

      if (res.ok) {
        Alert.alert("Lesson actualizada correctamente");
        handleClose();
      } else {
        Alert.alert("Error actualizando lesson");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error del servidor");
    }
  };

  // --- Borrar lesson ---
  const handleDeleteLesson = async () => {
    Alert.alert(
      "Eliminar lesson",
      "¿Estás seguro de que quieres eliminar esta lesson? Se borrarán también todos los horarios asociados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(
                `${API_BASE_URL}/lessons/${selectedLesson}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (res.ok) {
                Alert.alert("Lesson eliminada correctamente");
                handleClose();
              } else {
                Alert.alert("Error eliminando la lesson");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error del servidor");
            }
          },
        },
      ],
    );
  };

  // --- Botón atras ---
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  // --- Helpers para obtener la lesson seleccionada ---
  const selectedLessonObj =
    lessonMode === "new"
      ? {
          lessonName: newLessonName,
          professorName: newProfessorName,
          amountMonthly: newAmountMonthly,
        }
      : mode === "create"
        ? lessons.find((l) => l.id === selectedLesson)
        : mode === "editSchedule"
          ? schedules.find((s) => s.id === selectedLesson)
          : lessons.find((l) => l.id === selectedLesson);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
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
                    setStep(2);
                  }}
                >
                  <Text style={styles.buttonText}>Crear horario nuevo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setMode("editSchedule");
                    setStep(2);
                  }}
                >
                  <Text style={styles.buttonText}>
                    Modificar horario existente
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setMode("editLesson");
                    setLessonMode("existing");
                    setStep(2);
                  }}
                >
                  <Text style={styles.buttonText}>
                    Modificar lesson existente
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* ---------------- STEP 2 ---------------- */}
            {step === 2 && mode === "create" && (
              <>
                <Text style={styles.subtitle}>
                  ¿Qué tipo de lesson quieres?
                </Text>
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
                    selectedId={selectedLesson}
                    onSelect={(id) => {
                      const sched = schedules.find((s) => s.id === id);
                      setSelectedLesson(id);
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
                    selectedId={selectedLesson}
                    onSelect={(id) => {
                      const lesson = lessons.find((l) => l.id === id);

                      setSelectedLesson(id);
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
                    {mode === "editLesson" && selectedLesson && (
                      <TouchableOpacity
                        style={[styles.deleteButton, { marginTop: 10 }]}
                        onPress={handleDeleteLesson}
                      >
                        <Text style={styles.deleteButtonText}>
                          Borrar lesson
                        </Text>
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
                        <Text style={styles.subtitle}>
                          Selecciona una lesson
                        </Text>
                        {loadingLessons ? (
                          <Text>Cargando lessons...</Text>
                        ) : (
                          <SelectableList
                            items={lessons}
                            selectedId={selectedLesson}
                            onSelect={setSelectedLesson}
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
                      onPress={() => setStep(lessonMode === "new" ? 4 : 4)}
                    >
                      <Text style={styles.buttonText}>Siguiente</Text>
                    </TouchableOpacity>

                    {mode === "editSchedule" && (
                      <TouchableOpacity
                        style={[styles.deleteButton, { marginTop: 10 }]}
                        onPress={handleDeleteSchedule}
                      >
                        <Text style={styles.deleteButtonText}>
                          Borrar horario
                        </Text>
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
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  container: { backgroundColor: "#fff", borderRadius: 10, maxHeight: "90%" },
  inner: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  stepIndicator: { marginBottom: 15 },
  subtitle: { fontSize: 16, fontWeight: "bold", marginVertical: 8 },
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
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
