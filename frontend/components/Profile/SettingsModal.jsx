import { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../Styles/ProfileStyles.jsx";
import { colors } from "../../Styles/theme";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "../../hooks/useTranslation";

export default function SettingsModal({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState("theme");
  const { language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      setSelectedLanguage(language);
    }
  }, [visible, language]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "theme" && styles.tabActive,
              ]}
              onPress={() => setActiveTab("theme")}
            >
              <Text style={styles.tabText}>{t("settings.theme")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "language" && styles.tabActive,
              ]}
              onPress={() => setActiveTab("language")}
            >
              <Text style={styles.tabText}>{t("settings.language")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalScroll}>
            {activeTab === "theme" && (
              <>
                <Text style={styles.modalTitle}>
                  {t("settings.chooseTheme")}
                </Text>
                <TouchableOpacity style={styles.settingsOption}>
                  <View style={styles.settingsOptionIcon}>
                    <Ionicons
                      name="sunny-outline"
                      size={22}
                      color={colors.text}
                    />
                  </View>

                  <View style={styles.settingsOptionContent}>
                    <Text style={styles.settingsOptionTitle}>
                      {t("settings.light")}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingsOption}>
                  <View style={styles.settingsOptionIcon}>
                    <Ionicons
                      name="moon-outline"
                      size={22}
                      color={colors.text}
                    />
                  </View>

                  <View style={styles.settingsOptionContent}>
                    <Text style={styles.settingsOptionTitle}>
                      {t("settings.dark")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            {activeTab === "language" && (
              <>
                <Text style={styles.modalTitle}>
                  {t("settings.chooseLanguage")}
                </Text>
                <TouchableOpacity
                  style={styles.settingsOption}
                  onPress={() => setSelectedLanguage("es")}
                >
                  <View style={styles.settingsOptionIcon}>
                    <Text style={{ fontSize: 22 }}>🇪🇸</Text>
                  </View>

                  <View style={styles.settingsOptionContent}>
                    <Text style={styles.settingsOptionTitle}>Español</Text>
                  </View>
                  {selectedLanguage === "es" && (
                    <View style={styles.settingsOptionIcon}>
                      <Ionicons
                        name="checkmark"
                        size={22}
                        color={colors.text}
                      />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.settingsOption}
                  onPress={() => setSelectedLanguage("en")}
                >
                  <View style={styles.settingsOptionIcon}>
                    <Text style={{ fontSize: 22 }}>🇬🇧</Text>
                  </View>

                  <View style={styles.settingsOptionContent}>
                    <Text style={styles.settingsOptionTitle}>English</Text>
                  </View>
                  {selectedLanguage === "en" && (
                    <View style={styles.settingsOptionIcon}>
                      <Ionicons
                        name="checkmark"
                        size={22}
                        color={colors.text}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => {
                setLanguage(selectedLanguage);
                onClose();
              }}
              style={[styles.button, styles.saveButton]}
            >
              <Text style={styles.buttonText}>{t("settings.save")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>{t("settings.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
