import { useState } from "react";
import { Alert } from "react-native";
import { useLessons } from "../context/LessonsContext";
import { useSchedules } from "../context/SchedulesContext";

export function useScheduleWizard(onClose) {
  const { lessons, loadingLessons, createLesson, updateLesson, deleteLesson } = useLessons();
  const { schedules, loadingSchedules, createSchedule, updateSchedule, deleteSchedule } = useSchedules();

  // --- State ---
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

  // --- Helper: reset all state ---
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

  // --- Helper: show error message ---
  const showError = (message) => Alert.alert(message || "An error occurred");

  // --- Save schedule ---
  const handleSaveSchedule = async () => {
    if (!selectedDay || !startTime || !endTime) {
      Alert.alert("Please complete day, start time, and end time");
      return;
    }

    try {
      let lessonId = selectedLessonId;

      // Create new lesson if needed
      if (lessonMode === "new") {
        if (!newLessonName || !newProfessorName || !newAmountMonthly) {
          Alert.alert("Please complete all lesson fields");
          return;
        }

        const amount = parseFloat(newAmountMonthly);
        if (isNaN(amount)) {
          Alert.alert("Monthly amount must be a valid number");
          return;
        }

        const lesson = await createLesson({
          lessonName: newLessonName,
          professorName: newProfessorName,
          amountMonthly: amount,
        });

        lessonId = lesson.id;
      }

      // Create or update schedule
      if (mode === "editSchedule") {
        await updateSchedule(selectedScheduleId, { lessonId, dayOfWeek: selectedDay, startTime, endTime });
        Alert.alert("Schedule updated successfully");
      } else {
        await createSchedule({ lessonId, dayOfWeek: selectedDay, startTime, endTime });
        Alert.alert("Schedule created successfully");
      }

      handleClose();
    } catch (error) {
      showError(error.message);
    }
  };

  // --- Delete schedule ---
  const handleDeleteSchedule = () => {
    Alert.alert("Delete schedule", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSchedule(selectedScheduleId);
            Alert.alert("Schedule deleted successfully");
            handleClose();
          } catch (error) {
            showError(error.message);
          }
        },
      },
    ]);
  };

  // --- Update lesson ---
  const handleUpdateLesson = async () => {
    if (!newLessonName || !newProfessorName || !newAmountMonthly) {
      Alert.alert("Please complete all fields");
      return;
    }

    const amount = parseFloat(newAmountMonthly);
    if (isNaN(amount)) {
      Alert.alert("Monthly amount must be a valid number");
      return;
    }

    try {
      await updateLesson(selectedLessonId, {
        lessonName: newLessonName,
        professorName: newProfessorName,
        amountMonthly: amount,
      });

      Alert.alert("Lesson updated successfully");
      handleClose();
    } catch (error) {
      showError(error.message);
    }
  };

  // --- Delete lesson ---
  const handleDeleteLesson = () => {
    Alert.alert(
      "Delete lesson",
      "All associated schedules will also be deleted. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLesson(selectedLessonId);
              Alert.alert("Lesson deleted successfully");
              handleClose();
            } catch (error) {
              showError(error.message);
            }
          },
        },
      ],
    );
  };

  // --- Go back one step ---
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  // --- Selected lesson object helper ---
  const selectedLessonObj =
    lessonMode === "new"
      ? { lessonName: newLessonName, professorName: newProfessorName, amountMonthly: parseFloat(newAmountMonthly) }
      : lessons.find((l) => l.id === selectedLessonId);

  return {
    // State
    step,
    mode,
    lessonMode,
    selectedLessonId,
    selectedScheduleId,
    selectedDay,
    startTime,
    endTime,
    newLessonName,
    newProfessorName,
    newAmountMonthly,

    // Setters
    setStep,
    setMode,
    setLessonMode,
    setSelectedLessonId,
    setSelectedScheduleId,
    setSelectedDay,
    setStartTime,
    setEndTime,
    setNewLessonName,
    setNewProfessorName,
    setNewAmountMonthly,

    // Actions
    handleClose,
    handleSaveSchedule,
    handleDeleteSchedule,
    handleUpdateLesson,
    handleDeleteLesson,
    goBack,

    // Data
    lessons,
    schedules,
    loadingLessons,
    loadingSchedules,
    selectedLessonObj,
  };
}