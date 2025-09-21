import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { API_BASE_URL } from "../config"
import { useUser } from '../../context/usercontext';


export default function Ranking() {
  const { user } = useUser(); 
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return; 

    fetch(`${API_BASE_URL}/metrics/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching metrics", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!metrics) {
    return (
      <View style={styles.center}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        User Metrics
      </Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Metric</DataTable.Title>
          <DataTable.Title numeric>Value</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>Total Classes</DataTable.Cell>
          <DataTable.Cell numeric>{metrics.totalClasses}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Classes This Month</DataTable.Cell>
          <DataTable.Cell numeric>{metrics.classesThisMonth}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Classes This Year</DataTable.Cell>
          <DataTable.Cell numeric>{metrics.classesThisYear}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Most Attended Lesson</DataTable.Cell>
          <DataTable.Cell>{metrics.mostAttendedLesson}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Most Attended Lesson (Month)</DataTable.Cell>
          <DataTable.Cell>{metrics.mostAttendedLessonInCurrentMonth}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Most Attended Lesson (Year)</DataTable.Cell>
          <DataTable.Cell>{metrics.mostAttendedLessonInCurrentYear}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
