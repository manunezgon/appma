import { Text, View } from "react-native";
import styles from "../../Styles/RankingStyles";

export default function ProgressCard({ position, classes }) {
  if (position == null) return null;
  return (
    <View style={styles.myProgressCard}>
      <Text style={styles.myProgressTitle}>Your Progress</Text>

      <View style={styles.myProgressRow}>
        <Text style={styles.myProgressLabel}>TOP</Text>
        <Text style={styles.myProgressValue}>#{position}</Text>
      </View>

      <View style={styles.myProgressRow}>
        <Text style={styles.myProgressLabel}>{classes}</Text>
        <Text style={styles.myProgressLabel}>Attended classes</Text>
      </View>
    </View>
  );
}
