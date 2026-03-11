import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../../context/UserContext";
import { API_BASE_URL } from "../config";

export default function Ranking() {
  const { user } = useUser();

  const [ranking, setRanking] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedType, setSelectedType] = useState("month");
  const [loading, setLoading] = useState(false);

  const myIndex = ranking.findIndex((r) => r.userId === user?.id);
  const myPosition = myIndex !== -1 ? myIndex + 1 : null;
  const myClasses = myIndex !== -1 ? ranking[myIndex].totalClasses : 0;

  const topThree = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  const now = new Date();

  const monthName = now.toLocaleString("en-US", { month: "long" });
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const year = now.getFullYear();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/lessons`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLessons();
  }, []);

  useEffect(() => {
    if (!selectedType) return;

    const fetchRanking = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/metrics/${selectedType}`;

        if (selectedLesson) {
          url += `?lessonId=${selectedLesson}`;
        }

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        const data = await res.json();
        setRanking(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [selectedType, selectedLesson]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <>
        <Text style={styles.sectionTitle}>
          Ranking · {selectedType === "month" ? formattedMonth : year}
        </Text>
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

        {loading ? (
          <ActivityIndicator size="large" color="purple" />
        ) : (
          <>
            {/* TU PROGRESO */}

            {myPosition && (
              <View style={styles.myProgressCard}>
                <Text style={styles.myProgressTitle}>Tu progreso</Text>

                <View style={styles.myProgressRow}>
                  <Text style={styles.myProgressValue}>#{myPosition}</Text>
                  <Text style={styles.myProgressLabel}>posición</Text>
                </View>

                <View style={styles.myProgressRow}>
                  <Text style={styles.myProgressValue}>{myClasses}</Text>
                  <Text style={styles.myProgressLabel}>clases</Text>
                </View>
              </View>
            )}

            {/* PODIUM */}

            {topThree[0] && (
              <View style={styles.podiumFirst}>
                <Text style={styles.podiumPlace}>🥇</Text>
                <Text style={styles.podiumName}>{topThree[0].userName}</Text>
                <Text style={styles.podiumClasses}>
                  {topThree[0].totalClasses}
                </Text>
              </View>
            )}
            <View style={styles.podiumContainer}>
              {topThree[1] && (
                <View style={styles.podiumSecond}>
                  <Text style={styles.podiumPlace}>🥈</Text>
                  <Text style={styles.podiumName}>{topThree[1].userName}</Text>
                  <Text style={styles.podiumClasses}>
                    {topThree[1].totalClasses}
                  </Text>
                </View>
              )}

              {topThree[2] && (
                <View style={styles.podiumThird}>
                  <Text style={styles.podiumPlace}>🥉</Text>
                  <Text style={styles.podiumName}>{topThree[2].userName}</Text>
                  <Text style={styles.podiumClasses}>
                    {topThree[2].totalClasses}
                  </Text>
                </View>
              )}
            </View>

            {/* LISTA RESTO */}

            <View style={styles.card}>
              {rest.map((r, index) => {
                const realIndex = index + 3;
                const previous = ranking[realIndex - 1];

                const diff = previous
                  ? previous.totalClasses - r.totalClasses
                  : 0;

                return (
                  <View key={realIndex} style={styles.row}>
                    <Text style={styles.position}>{realIndex + 1}</Text>

                    <Text style={styles.userName}>{r.userName}</Text>

                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.classes}>{r.totalClasses}</Text>

                      {diff > 0 && (
                        <Text style={styles.diffText}>
                          +{diff} para alcanzar
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E" },
  content: { padding: 16, paddingTop: 50 },

  buttonContainer: { marginTop: 40, gap: 20 },

  mainButton: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "purple",
  },

  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  backText: { color: "purple", marginBottom: 15, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },

  pickerContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#3a3a3a",
  },

  position: { width: 30, color: "#ccc", fontWeight: "bold" },

  userName: { flex: 1, color: "#ccc", fontWeight: "600" },

  classes: { color: "#ccc", fontWeight: "bold" },

  diffText: { color: "#888", fontSize: 11 },

  myProgressCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  myProgressTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },

  myProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  myProgressValue: {
    color: "purple",
    fontSize: 22,
    fontWeight: "bold",
  },

  myProgressLabel: { color: "#ccc" },

  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
    gap: 80,
  },

  podiumFirst: {
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "flex-end",
  },

  podiumSecond: {
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "flex-end",
  },

  podiumThird: {
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "flex-end",
  },

  podiumPlace: {
    fontSize: 28,
    marginBottom: 4,
  },

  podiumName: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 2,
  },

  podiumClasses: {
    color: "purple",
    fontWeight: "bold",
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    marginBottom: 15,
  },

  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },

  segmentActive: {
    backgroundColor: "purple",
  },

  segmentText: {
    color: "#ccc",
    fontWeight: "600",
  },

  segmentTextActive: {
    color: "white",
  },
});
