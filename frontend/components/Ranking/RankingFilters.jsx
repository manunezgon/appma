import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../Styles/theme";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../../Styles/RankingStyles";

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
        <RNPickerSelect
          value={selectedLesson}
          itemKey={selectedLesson}
          onValueChange={setSelectedLesson}
          items={lessons.map((lesson) => ({
            label: lesson.lessonName,
            value: lesson.id,
          }))}
          placeholder={{
            label: "All lessons",
            value: null,
            color: colors.textSubtle,
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => (
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.text}
            />
          )}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
            placeholder: {
              color: colors.textSubtle,
            },
            iconContainer: {
              top: 14,
              right: 12,
            },
          }}
        />
      </View>
    </>
  );
}
