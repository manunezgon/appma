import { Alert, Text, TouchableOpacity, View } from "react-native";
import LessonSummary from "./LessonSummary.jsx";
import SelectableList from "./SelectableList.jsx";
import style from "./Styles.jsx";
import TextInputField from "./TextInputField.jsx";

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

        <Text style={style.subtitle2}>Name</Text>
        <TextInputField
          value={newLessonName}
          onChangeText={setNewLessonName}
          style={style.inputField}
        />

        <Text style={style.subtitle2}>Instructor</Text>
        <TextInputField
          value={newProfessorName}
          onChangeText={setNewProfessorName}
          style={style.inputField}
        />

        <Text style={style.subtitle2}>Monthly Price</Text>
        <TextInputField
          value={newAmountMonthly}
          onChangeText={setNewAmountMonthly}
          keyboardType="numeric"
          style={style.inputField}
        />
        <View style={style.midButtons}>
          <TouchableOpacity
            style={[style.button, style.saveButton]}
            onPress={handleUpdateLesson}
          >
            <Text style={style.buttonText}>Save Changes</Text>
          </TouchableOpacity>

          {selectedLessonId && (
            <TouchableOpacity style={style.button} onPress={handleDeleteLesson}>
              <Text style={style.buttonText}>Delete Lesson</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }

  return (
    <>
      {/* --- New Lesson Form --- */}
      {lessonMode === "new" && (
        <>
          <Text style={style.subtitle}>Create New Lesson</Text>
          <Text style={style.subtitle2}>New Lesson Name</Text>
          <TextInputField
            value={newLessonName}
            onChangeText={setNewLessonName}
            placeholder="e.g. Advanced Yoga"
            style={style.inputField}
          />

          <Text style={style.subtitle2}>Instructor</Text>
          <TextInputField
            value={newProfessorName}
            onChangeText={setNewProfessorName}
            placeholder="Instructor name"
            style={style.inputField}
          />

          <Text style={style.subtitle2}>Monthly Price</Text>
          <TextInputField
            value={newAmountMonthly}
            onChangeText={setNewAmountMonthly}
            placeholder="e.g. 35"
            keyboardType="numeric"
            style={style.inputField}
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
                <View style={style.classContainer}>
                  {/* Left side */}
                  <View style={style.classNameContainer}>
                    <Text style={style.className}>{l.lessonName}</Text>
                    <Text style={style.professorName}>{l.professorName}</Text>
                  </View>

                  {/* Right side */}
                  <Text style={style.amount}>{l.amountMonthly}€</Text>
                </View>
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
          style={[style.button, style.deleteButton]}
          onPress={handleDeleteSchedule}
        >
          <Text style={style.buttonText}>Delete Schedule</Text>
        </TouchableOpacity>
      )}
    </>
  );
}
