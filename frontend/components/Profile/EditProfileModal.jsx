import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createProfileStyles } from "../../Styles/ProfileStyles.jsx";
import { useTranslation } from "../../hooks/useTranslation";
import { useTheme } from "../../context/ThemeContext";

export default function EditProfileModal({
  visible,
  onClose,
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  editPhone,
  setEditPhone,
  currentPassword,
  setCurrentPassword,
  handleSaveProfile,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  handleChangePassword,
}) {
  const [activeTab, setActiveTab] = useState("profile");

  const { t } = useTranslation();

  const { colors } = useTheme();
  const styles = createProfileStyles(colors);

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
                activeTab === "profile" && styles.tabActive,
              ]}
              onPress={() => setActiveTab("profile")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "profile" && styles.activeTabText,
                ]}
              >
                {t("profile.editProfileTab")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "password" && styles.tabActive,
              ]}
              onPress={() => setActiveTab("password")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "password" && styles.activeTabText,
                ]}
              >
                {t("profile.passwordTab")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalScroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {activeTab === "profile" && (
              <>
                <Text style={styles.modalTitle}>
                  {t("profile.editProfile")}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("profile.name")}
                  placeholderTextColor={colors.textMuted}
                  value={editName}
                  onChangeText={setEditName}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.input}
                  placeholder={t("profile.email")}
                  placeholderTextColor={colors.textMuted}
                  value={editEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setEditEmail}
                  textContentType="emailAddress"
                  autoComplete="email"
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.input}
                  placeholder={t("profile.phone")}
                  placeholderTextColor={colors.textMuted}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.input}
                  placeholder={t("profile.currentPassword")}
                  placeholderTextColor={colors.textMuted}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  autoComplete="current-password"
                  returnKeyType="done"
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    style={[styles.button, styles.saveButton]}
                  >
                    <Text style={styles.primaryButtonText}>
                      {t("profile.saveChanges")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onClose}
                    style={[styles.button, styles.cancelButton]}
                  >
                    <Text style={styles.buttonText}>{t("profile.cancel")}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {activeTab === "password" && (
              <>
                <Text style={styles.modalTitle}>
                  {t("profile.changePassword")}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("profile.currentPassword")}
                  placeholderTextColor={colors.textMuted}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry
                  autoComplete="current-password"
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.input}
                  placeholder={t("profile.newPassword")}
                  placeholderTextColor={colors.textMuted}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoComplete="new-password"
                  returnKeyType="done"
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={handleChangePassword}
                    style={[styles.button, styles.saveButton]}
                  >
                    <Text style={styles.primaryButtonText}>
                      {t("profile.updatePassword")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onClose}
                    style={[styles.button, styles.cancelButton]}
                  >
                    <Text style={styles.buttonText}>{t("profile.cancel")}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
