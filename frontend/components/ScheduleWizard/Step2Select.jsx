import { Text, TouchableOpacity, View } from "react-native";
import SelectableList from "./SelectableList.jsx";
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
  const weekOrder = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

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

  if (mode === "editSchedule") {
    if (loadingSchedules) return <Text>Loading schedules...</Text>;
    if (!schedules.length) return <Text>No schedules available</Text>;

    const schedulesByDay = schedules.reduce((acc, s) => {
      acc[s.dayOfWeek] = acc[s.dayOfWeek] || [];
      acc[s.dayOfWeek].push(s);
      return acc;
    }, {});

    Object.keys(schedulesByDay).forEach((day) => {
      schedulesByDay[day].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      );
    });

    return (
      <>
        {Object.entries(schedulesByDay)
          .sort(
            ([dayA], [dayB]) =>
              weekOrder.indexOf(dayA) - weekOrder.indexOf(dayB),
          )
          .map(([day, daySchedules]) => (
            <View key={day}>
              <Text style={style.subtitle}>{day}</Text>
              <SelectableList
                items={daySchedules}
                selectedId={selectedScheduleId}
                onSelect={(id) => {
                  const sched = schedules.find((s) => s.id === id);
                  if (!sched) return;

                  setSelectedScheduleId(id);
                  setSelectedLessonId(sched.lessonId);
                  setLessonMode("existing");

                  setSelectedDay(sched.dayOfWeek);
                  setStartTime(sched.startTime);
                  setEndTime(sched.endTime);

                  setStep(3);
                }}
                renderItem={(sched) => (
                  <View style={style.classContainer}>
                    <View style={style.classNameContainer}>
                      <Text style={style.className}>{sched.lessonName}</Text>
                      <Text style={style.professorName}>
                        {sched.professorName}
                      </Text>
                    </View>

                    <Text style={style.startTimeEndTime}>
                      {sched.startTime} - {sched.endTime}
                    </Text>
                  </View>
                )}
              />
            </View>
          ))}
      </>
    );
  }

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
              if (!lesson) return; 

              setSelectedLessonId(id);
              setNewLessonName(lesson.lessonName);
              setNewProfessorName(lesson.professorName);
              setNewAmountMonthly(String(lesson.amountMonthly));

              setStep(3);
            }}
            renderItem={(l) => (
              <View style={style.classContainer}>
                <View style={style.classNameContainer}>
                  <Text style={style.className}>{l.lessonName}</Text>
                  <Text style={style.professorName}>{l.professorName}</Text>
                </View>

                <Text style={style.amount}>{l.amountMonthly}€</Text>
              </View>
            )}
          />
        )}
      </>
    );
  }

  return null;
}
