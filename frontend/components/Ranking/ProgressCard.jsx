import { Text, View } from "react-native";
import styles from "../../Styles/RankingStyles";
import { useTranslation } from "../../hooks/useTranslation";

export default function ProgressCard({ position, classes }) {
  const { t } = useTranslation();

  if (position == null) return null;
  
  return (
    <View style={styles.myProgressCard}>
      <Text style={styles.myProgressTitle}>{t("ranking.yourProgress")}</Text>

      <View style={styles.myProgressRow}>
        <Text style={styles.myProgressLabel}>TOP</Text>
        <Text style={styles.myProgressValue}>#{position}</Text>
      </View>

      <View style={styles.myProgressRow}>
        <Text style={styles.myProgressLabel}>{classes}</Text>
        <Text style={styles.myProgressLabel}>
          {t("ranking.attendedClasses")}
        </Text>
      </View>
    </View>
  );
}
