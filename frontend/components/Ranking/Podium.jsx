import { View, Text } from "react-native";
import styles from "./Styles";

export default function Podium({ topThree }) {
  if (!topThree.length) return null;

  return (
    <>
      {topThree[0] && (
        <View style={styles.podiumFirst}>
          <Text style={styles.podiumPlace}>🥇</Text>
          <Text style={styles.podiumName}>{topThree[0].userName}</Text>
          <Text style={styles.podiumClasses}>{topThree[0].totalClasses}</Text>
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
    </>
  );
}