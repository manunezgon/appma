import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import Podium from "../../components/Ranking/Podium";
import ProgressCard from "../../components/Ranking/ProgressCard";
import RankingFilters from "../../components/Ranking/RankingFilters";
import RankingList from "../../components/Ranking/RankingList";
import { useLessons } from "../../context/LessonsContext";
import { useUser } from "../../context/UserContext";
import styles from "../../Styles/RankingStyles";
import { colors } from "../../Styles/theme";
import { getRanking } from "../../services/metricsApi";

export default function Ranking() {
  const { user, token } = useUser();
  const { lessons } = useLessons();

  const [ranking, setRanking] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedType, setSelectedType] = useState("month");
  const [loading, setLoading] = useState(false);

  const { myPosition, myClasses } = useMemo(() => {
    const index = ranking.findIndex(
      (r) => Number(r.userId) === Number(user?.id),
    );
    return {
      myPosition: index !== -1 ? index + 1 : null,
      myClasses: index !== -1 ? ranking[index].totalClasses : 0,
    };
  }, [ranking, user?.id]);

  const topThree = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  const now = new Date();

  const monthName = now.toLocaleString("en-US", { month: "long" });
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const year = now.getFullYear();

  useEffect(() => {
    if (!selectedType) return;

    const fetchRanking = async () => {
      setLoading(true);
      try {
        const data = await getRanking({ selectedType, selectedLesson }, token);
        setRanking(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [selectedType, selectedLesson, token]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        Ranking · {selectedType === "month" ? formattedMonth : year}
      </Text>

      <RankingFilters
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
        lessons={lessons}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <ProgressCard position={myPosition} classes={myClasses} />

          <Podium topThree={topThree} />

          <RankingList rest={rest} ranking={ranking} />
        </>
      )}
    </ScrollView>
  );
}
