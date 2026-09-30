import { useState } from "react";
import { Alert } from "react-native";
import { useLessons } from "../context/LessonsContext";
import { useSchedules } from "../context/SchedulesContext";
import { useTranslation } from "../hooks/useTranslation";

export function useScheduleWizard(onClose) {
  const { t } = useTranslation();

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

  const showError = (message) =>
    Alert.alert(message || t("scheduleManagement.error"));

  const handleSaveSchedule = async () => {
    if (!selectedDay || !startTime || !endTime) {
      Alert.alert(t("scheduleManagement.completeDayTime"));
      return;
    }

    try {
      let lessonId = selectedLessonId;

      if (lessonMode === "new") {
        if (!newLessonName || !newProfessorName || !newAmountMonthly) {
          Alert.alert(t("scheduleManagement.completeLessonFields"));
          return;
        }

        const amount = parseFloat(newAmountMonthly);
        if (isNaN(amount)) {
          Alert.alert(t("scheduleManagement.invalidAmount"));
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
        await updateSchedule(selectedScheduleId, {
          lessonId,
          dayOfWeek: selectedDay,
          startTime,
          endTime,
        });
        Alert.alert(t("scheduleManagement.scheduleUpdated"));
      } else {
        await createSchedule({
          lessonId,
          dayOfWeek: selectedDay,
          startTime,
          endTime,
        });
        Alert.alert(t("scheduleManagement.scheduleCreated"));
      }

      handleClose();
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDeleteSchedule = () => {
    Alert.alert(
      t("scheduleManagement.deleteSchedule"),
      t("scheduleManagement.confirmDeleteSchedule"),
      [
        { text: t("scheduleManagement.cancel"), style: "cancel" },
        {
          text: t("scheduleManagement.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSchedule(selectedScheduleId);
              Alert.alert(t("scheduleManagement.scheduleDeleted"));
              handleClose();
            } catch (error) {
              showError(error.message);
            }
          },
        },
      ],
    );
  };

  const handleUpdateLesson = async () => {
    if (!newLessonName || !newProfessorName || !newAmountMonthly) {
      Alert.alert(t("scheduleManagement.completeAllFields"));
      return;
    }

    const amount = parseFloat(newAmountMonthly);
    if (isNaN(amount)) {
      Alert.alert(t("scheduleManagement.invalidAmount"));
      return;
    }

    try {
      await updateLesson(selectedLessonId, {
        lessonName: newLessonName,
        professorName: newProfessorName,
        amountMonthly: amount,
      });

      Alert.alert(t("scheduleManagement.lessonUpdated"));
      handleClose();
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDeleteLesson = () => {
    Alert.alert(
      t("scheduleManagement.deleteLesson"),
      t("scheduleManagement.confirmDeleteLesson"),
      [
        { text: t("scheduleManagement.cancel"), style: "cancel" },
        {
          text: t("scheduleManagement.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteLesson(selectedLessonId);
              Alert.alert(t("scheduleManagement.lessonDeleted"));
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
      ? {
          lessonName: newLessonName,
          professorName: newProfessorName,
          amountMonthly: parseFloat(newAmountMonthly),
        }
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
