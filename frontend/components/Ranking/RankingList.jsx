import { View, Text } from "react-native";
import styles from "./Styles";

export default function RankingList({ rest, ranking }) {
  return (
    <View style={styles.rankingCard}>
      {rest.map((r, index) => {
        const realIndex = index + 3;
        const previous = ranking[realIndex - 1];

        const diff = previous ? previous.totalClasses - r.totalClasses : 0;

        return (
          <View key={realIndex} style={styles.rankingRow}>
            <Text style={styles.position}>{realIndex + 1}</Text>

            <Text style={styles.userName}>{r.userName}</Text>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.classes}>{r.totalClasses}</Text>

              {diff > 0 && (
                <Text style={styles.diffText}>+{diff} to move up</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
