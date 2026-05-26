import { memo, useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../../Styles/LessonStyles.jsx";
import defaultProfileImg from "../../app/assets/images/white_logo_circle.png";

const ClassItem = ({
  item,
  userRole,
  onEnroll,
  onDeleteClass,
  onTakeAttendance,
}) => {
  const handleEnroll = useCallback(() => {
    onEnroll(item.id, item.isException);
  }, [item.id, item.isException, onEnroll]);

  const handleDelete = useCallback(() => {
    onDeleteClass(item);
  }, [item, onDeleteClass]);

  const handleAttendance = useCallback(() => {
    onTakeAttendance(item);
  }, [item, onTakeAttendance]);

  return (
    <View style={styles.classCard}>
      <View style={styles.rowBetween}>
        <View style={styles.leftContainer}>
          <Text style={styles.className}>{item.lessonName}</Text>
          <Text style={styles.professorName}>{item.professorName}</Text>
        </View>

        <View style={styles.centerContainer}>
          <Text style={styles.classTime}>{item.time}</Text>
        </View>

        <View style={styles.rightContainer}>
          {userRole === "ADMIN" ? (
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={handleAttendance}>
                <Ionicons name="clipboard-outline" size={28} color="#69188E" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash-outline" size={28} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.enrollButton,
                item.isEnrolled && styles.enrollButtonDisabled,
              ]}
              disabled={item.isEnrolled || item.isPast}
              onPress={handleEnroll}
            >
              <Ionicons
                name={
                  item.isEnrolled
                    ? "checkmark-circle"
                    : item.isPast
                      ? "time-outline"
                      : "add-circle"
                }
                size={30}
                color={
                  item.isEnrolled
                    ? "#00923aff"
                    : item.isPast
                      ? "#555555"
                      : "#69188E"
                }
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {item.students?.length > 0 && (
        <View style={styles.studentRow}>
          {item.students.map((s) => (
            <Image
              key={s.id}
              source={
                s.profileImageUrl
                  ? { uri: s.profileImageUrl }
                  : defaultProfileImg
              }
              style={styles.studentAvatar}
            />
          ))}
        </View>
      )}
    </View>
  );
};

function areEqual(prev, next) {
  return (
    prev.item.id === next.item.id &&
    prev.item.isEnrolled === next.item.isEnrolled &&
    prev.item.isPast === next.item.isPast &&
    prev.item.students?.length === next.item.students?.length &&
    prev.userRole === next.userRole
  );
}

export default memo(ClassItem);
