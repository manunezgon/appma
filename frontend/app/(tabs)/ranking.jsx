import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_BASE_URL } from "../config";
import { useUser } from "../../context/UserContext";

export default function Ranking() {
  const { user } = useUser();

  const [ranking, setRanking] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch lessons
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

  // Fetch ranking
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

  const renderRanking = () =>
    ranking.map((r, index) => (
      <View key={index} style={styles.row}>
        <Text style={[styles.position, index < 3 && styles.topPosition]}>
          {index + 1}
        </Text>
        <Text style={[styles.userName, index < 3 && styles.topText]}>
          {r.userName}
        </Text>
        <Text style={[styles.classes, index < 3 && styles.topText]}>
          {r.totalClasses}
        </Text>
      </View>
    ));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!selectedType && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setSelectedType("month")}
          >
            <Text style={styles.buttonText}>Monthly Ranking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setSelectedType("year")}
          >
            <Text style={styles.buttonText}>Yearly Ranking</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedType && (
        <>
          <TouchableOpacity
            onPress={() => {
              setSelectedType(null);
              setSelectedLesson(null);
            }}
          >
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>
            {selectedType === "month"
              ? "Monthly Ranking"
              : "Yearly Ranking"}
          </Text>

          {/* DROPDOWN */}
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
            <View style={styles.card}>{renderRanking()}</View>
          )}
        </>
      )}
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
  classes: { width: 40, textAlign: "right", color: "#ccc", fontWeight: "bold" },
  topPosition: { color: "purple" },
  topText: { color: "#fff" },
});