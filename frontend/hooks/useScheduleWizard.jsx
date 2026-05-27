import { useState } from "react";
import { Alert } from "react-native";
import { useLessons } from "../context/LessonsContext";
import { useSchedules } from "../context/SchedulesContext";

export function useScheduleWizard(onClose) {
  const { lessons, loadingLessons, createLesson, updateLesson, deleteLesson } = useLessons();
  const { schedules, loadingSchedules, createSchedule, updateSchedule, deleteSchedule } = useSchedules();


  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(null); 
  const [lessonMode, setLessonMode] = useState(null); 

  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [newLessonName, setNewLessonName] = useState("");
  const [newProfessorName, setNewProfessorName] = useState("");
  const [newAmountMonthly, setNewAmountMonthly] = useState("");

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

  const showError = (message) => Alert.alert(message || "An error occurred");

  const handleSaveSchedule = async () => {
    if (!selectedDay || !startTime || !endTime) {
      Alert.alert("Please complete day, start time, and end time");
      return;
    }

    try {
      let lessonId = selectedLessonId;

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

  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const selectedLessonObj =
    lessonMode === "new"
      ? { lessonName: newLessonName, professorName: newProfessorName, amountMonthly: parseFloat(newAmountMonthly) }
      : lessons.find((l) => l.id === selectedLessonId);

  return {
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

    handleClose,
    handleSaveSchedule,
    handleDeleteSchedule,
    handleUpdateLesson,
    handleDeleteLesson,
    goBack,

    lessons,
    schedules,
    loadingLessons,
    loadingSchedules,
    selectedLessonObj,
  };
}