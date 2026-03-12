import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "./Styles";

export default function RankingFilters({
  selectedType,
  setSelectedType,
  selectedLesson,
  setSelectedLesson,
  lessons,
}) {
  return (
    <>
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedType === "month" && styles.segmentActive,
          ]}
          onPress={() => setSelectedType("month")}
        >
          <Text
            style={[
              styles.segmentText,
              selectedType === "month" && styles.segmentTextActive,
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedType === "year" && styles.segmentActive,
          ]}
          onPress={() => setSelectedType("year")}
        >
          <Text
            style={[
              styles.segmentText,
              selectedType === "year" && styles.segmentTextActive,
            ]}
          >
            Year
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedLesson}
          dropdownIconColor="white"
          onValueChange={(itemValue) => setSelectedLesson(itemValue)}
          style={{ color: "white" }}
        >
          <Picker.Item label="Todas las clases" value={null} />
          {lessons.map((lesson) => (
            <Picker.Item
              key={lesson.id}
              label={lesson.lessonName}
              value={lesson.id}
            />
          ))}
        </Picker>
      </View>
    </>
  );
}