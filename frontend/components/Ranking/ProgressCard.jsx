import { Text, View } from "react-native";
import styles from "./Styles";

export default function ProgressCard({ position, classes }) {
  if (position == null) return null;
  return (
    <View style={styles.myProgressCard}>
      <Text style={styles.myProgressTitle}>Tu progreso</Text>

      <View style={styles.myProgressRow}>
        <Text style={styles.myProgressValue}>#{position}</Text>
        <Text style={styles.myProgressLabel}>posición</Text>
      </View>

      <View style={styles.myProgressRow}>
        <Text style={styles.myProgressValue}>{classes}</Text>
        <Text style={styles.myProgressLabel}>clases</Text>
      </View>
    </View>
  );
}
