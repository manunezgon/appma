import { Text, TouchableOpacity, Alert } from "react-native";
import TextInputField from "../TextInputField";
import LessonSummary from "../LessonSummary";
import SelectableList from "../SelectableList";
import style from "./Styles.jsx";

export default function Step3Lesson({
  mode,
  lessonMode,
  selectedLessonObj,
  selectedDay,
  startTime,
  endTime,
  lessons,
  loadingLessons,
  selectedLessonId,
  newLessonName,
  newProfessorName,
  newAmountMonthly,
  setNewLessonName,
  setNewProfessorName,
  setNewAmountMonthly,
  setSelectedLessonId,
  setStep,
  handleUpdateLesson,
  handleDeleteLesson,
  handleDeleteSchedule,
}) {
  // --- Validate and go to Step 4 ---
  const handleNext = () => {
    if (lessonMode === "new") {
      if (!newLessonName || !newProfessorName || !newAmountMonthly) {
        Alert.alert("Please fill in all lesson details");
        return;
      }
    }

    if (lessonMode === "existing" && !selectedLessonId) {
      Alert.alert("Please select a lesson");
      return;
    }

    setStep(4);
  };

  // --- Edit Lesson Mode ---
  if (mode === "editLesson") {
    return (
      <>
        <Text style={style.subtitle}>Edit Lesson</Text>

        <Text>Name</Text>
        <TextInputField value={newLessonName} onChangeText={setNewLessonName} />

        <Text>Instructor</Text>
        <TextInputField value={newProfessorName} onChangeText={setNewProfessorName} />

        <Text>Monthly Price</Text>
        <TextInputField
          value={newAmountMonthly}
          onChangeText={setNewAmountMonthly}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[style.button, { marginTop: 10 }]}
          onPress={handleUpdateLesson}
        >
          <Text style={style.buttonText}>Save Changes</Text>
        </TouchableOpacity>

        {selectedLessonId && (
          <TouchableOpacity
            style={[style.deleteButton, { marginTop: 10 }]}
            onPress={handleDeleteLesson}
          >
            <Text style={style.deleteButtonText}>Delete Lesson</Text>
          </TouchableOpacity>
        )}
      </>
    );
  }

  return (
    <>
      {/* --- New Lesson Form --- */}
      {lessonMode === "new" && (
        <>
          <Text style={style.subtitle}>New Lesson Name</Text>
          <TextInputField
            value={newLessonName}
            onChangeText={setNewLessonName}
            placeholder="e.g. Advanced Yoga"
          />

          <Text style={style.subtitle}>Instructor</Text>
          <TextInputField
            value={newProfessorName}
            onChangeText={setNewProfessorName}
            placeholder="Instructor name"
          />

          <Text style={style.subtitle}>Monthly Price</Text>
          <TextInputField
            value={newAmountMonthly}
            onChangeText={setNewAmountMonthly}
            placeholder="e.g. 35"
            keyboardType="numeric"
          />
        </>
      )}

      {/* --- Select Existing Lesson for Creation --- */}
      {lessonMode === "existing" && mode === "create" && (
        <>
          <Text style={style.subtitle}>Select a lesson</Text>
          {loadingLessons ? (
            <Text>Loading lessons...</Text>
          ) : (
            <SelectableList
              items={lessons}
              selectedId={selectedLessonId}
              onSelect={setSelectedLessonId}
              renderItem={(l) => (
                <Text style={{ color: "#fff" }}>
                  {l.lessonName} - {l.professorName} (${l.amountMonthly})
                </Text>
              )}
            />
          )}
        </>
      )}

      {/* --- Edit Schedule View --- */}
      {lessonMode === "existing" && mode === "editSchedule" && (
        <>
          <Text style={style.subtitle}>Edit Schedule</Text>
          <LessonSummary
            lesson={selectedLessonObj}
            day={selectedDay}
            startTime={startTime}
            endTime={endTime}
          />
        </>
      )}

      {/* --- Next Button --- */}
      <TouchableOpacity
        style={[style.button, { marginTop: 10 }]}
        onPress={handleNext}
      >
        <Text style={style.buttonText}>Next</Text>
      </TouchableOpacity>

      {/* --- Delete Schedule Button --- */}
      {mode === "editSchedule" && (
        <TouchableOpacity
          style={[style.deleteButton, { marginTop: 10 }]}
          onPress={handleDeleteSchedule}
        >
          <Text style={style.deleteButtonText}>Delete Schedule</Text>
        </TouchableOpacity>
      )}
    </>
  );
}