import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import { useState, useMemo } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useUser } from "../../context/UserContext";
import { useTranslation } from "../../hooks/useTranslation";
import { createNewsStyles } from "../../Styles/NewsStyles";
import { useTheme } from "../../context/ThemeContext";

export default function AnnouncementCard({ announcement, onDelete }) {
  const { t, language } = useTranslation();
    const { colors } = useTheme();
    const style = createNewsStyles(colors);
  const { user } = useUser();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { width } = useWindowDimensions();
  const source = useMemo(
    () => ({ html: announcement.message }),
    [announcement.message],
  );

  const tagsStyles = useMemo(
    () => ({
      body: style.message,
      p: {
        marginTop: 0,
        marginBottom: 8,
      },
      strong: {
        fontWeight: "700",
      },
      b: {
        fontWeight: "700",
      },
      em: {
        fontStyle: "italic",
      },
      i: {
        fontStyle: "italic",
      },
    }),
    [],
  );

  return (
    <View style={style.card}>
      <RenderHTML
        contentWidth={width - 40}
        source={source}
        tagsStyles={tagsStyles}
      />

      <Text style={style.date}>
        {new Date(announcement.createdAt).toLocaleString(
          language === "es" ? "es-ES" : "en-US",
        )}
      </Text>

      {user?.role === "ADMIN" && (
        <TouchableOpacity
          onPress={() => setConfirmVisible(true)}
          style={style.deleteButton}
        >
          <Ionicons name="trash-outline" size={25} color={colors.danger} />
        </TouchableOpacity>
      )}

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={style.modalOverlay}>
          <View style={style.modalContent}>
            <Text style={style.modalText}>{t("news.deleteAnnouncement")}</Text>
            <View style={style.modalButtons}>
              <TouchableOpacity onPress={() => setConfirmVisible(false)}>
                <Ionicons name="close" size={28} color={colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity onPress={onDelete}>
                <Ionicons
                  name="trash-outline"
                  size={28}
                  color={colors.danger}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
