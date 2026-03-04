import { Text, TouchableOpacity } from "react-native";
import SelectableList from "../SelectableList";
import style from "./Styles.jsx";

export default function Step2Select({
  mode,
  lessonMode,
  lessons,
  schedules,
  loadingLessons,
  loadingSchedules,
  selectedLessonId,
  selectedScheduleId,
  setSelectedLessonId,
  setSelectedScheduleId,
  setLessonMode,
  setSelectedDay,
  setStartTime,
  setEndTime,
  setStep,
  setNewLessonName,
  setNewProfessorName,
  setNewAmountMonthly,
}) {
  // --- Create Mode: choose between new or existing lesson ---
  if (mode === "create") {
    return (
      <>
        <Text style={style.subtitle}>Which type of lesson do you want?</Text>

        <TouchableOpacity
          style={style.button}
          onPress={() => {
            setLessonMode("new");
            setStep(3);
          }}
        >
          <Text style={style.buttonText}>Create New Lesson</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.button}
          onPress={() => {
            setLessonMode("existing");
            setStep(3);
          }}
        >
          <Text style={style.buttonText}>Use Existing Lesson</Text>
        </TouchableOpacity>
      </>
    );
  }

  // --- Edit Schedule Mode: select schedule to edit ---
  if (mode === "editSchedule") {
    return (
      <>
        <Text style={style.subtitle}>Select a schedule to edit</Text>

        {loadingSchedules ? (
          <Text>Loading schedules...</Text>
        ) : schedules.length === 0 ? (
          <Text>No schedules available</Text>
        ) : (
          <SelectableList
            items={schedules}
            selectedId={selectedScheduleId}
            onSelect={(id) => {
              const sched = schedules.find((s) => s.id === id);
              if (!sched) return; // safety check

              setSelectedScheduleId(id);
              setSelectedLessonId(sched.lessonId);
              setLessonMode("existing");

              setSelectedDay(sched.dayOfWeek);
              setStartTime(sched.startTime);
              setEndTime(sched.endTime);

              setStep(3);
            }}
            renderItem={(sched) => (
              <Text style={{ color: "#fff" }}>
                {sched.lessonName} - {sched.professorName}
                {"\n"}
                {sched.dayOfWeek} {sched.startTime}-{sched.endTime}
              </Text>
            )}
          />
        )}
      </>
    );
  }

  // --- Edit Lesson Mode: select lesson to edit ---
  if (mode === "editLesson") {
    return (
      <>
        <Text style={style.subtitle}>Select a lesson to edit</Text>

        {loadingLessons ? (
          <Text>Loading lessons...</Text>
        ) : (
          <SelectableList
            items={lessons}
            selectedId={selectedLessonId}
            onSelect={(id) => {
              const lesson = lessons.find((l) => l.id === id);
              if (!lesson) return; // safety check

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
    );
  }

  return null;
}
