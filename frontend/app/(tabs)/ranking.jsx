import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { API_BASE_URL } from "../config";
import { useUser } from '../../context/usercontext';

export default function Ranking() {
  const { user } = useUser(); 
  const [monthlyRanking, setMonthlyRanking] = useState([]);
  const [yearlyRanking, setYearlyRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchRanking = async () => {
      try {
        const [monthRes, yearRes] = await Promise.all([
          fetch(`${API_BASE_URL}/metrics/month`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch(`${API_BASE_URL}/metrics/year`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        const monthData = await monthRes.json();
        const yearData = await yearRes.json();

        setMonthlyRanking(monthData);
        setYearlyRanking(yearData);
      } catch (err) {
        console.error("Error fetching ranking", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [user?.token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        Monthly Ranking
      </Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>User</DataTable.Title>
          <DataTable.Title numeric>Total Classes</DataTable.Title>
        </DataTable.Header>
        {monthlyRanking.map((r, i) => (
          <DataTable.Row key={i}>
            <DataTable.Cell>{r.userName}</DataTable.Cell>
            <DataTable.Cell numeric>{r.totalClasses}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>

      <Text variant="titleLarge" style={{ marginVertical: 16 }}>
        Yearly Ranking
      </Text>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>User</DataTable.Title>
          <DataTable.Title numeric>Total Classes</DataTable.Title>
        </DataTable.Header>
        {yearlyRanking.map((r, i) => (
          <DataTable.Row key={i}>
            <DataTable.Cell>{r.userName}</DataTable.Cell>
            <DataTable.Cell numeric>{r.totalClasses}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
