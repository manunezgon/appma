import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import styles from "./Styles.jsx";

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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "profile" && styles.tabActive]}
              onPress={() => setActiveTab("profile")}
            >
              <Text style={styles.tabText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === "password" && styles.tabActive]}
              onPress={() => setActiveTab("password")}
            >
              <Text style={styles.tabText}>Password</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalScroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {activeTab === "profile" && (
              <>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={editName}
                  onChangeText={setEditName}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
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
                  placeholder="Phone"
                  value={editPhone}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  autoComplete="current-password"
                  returnKeyType="done"
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={handleSaveProfile} style={[styles.button, styles.saveButton]}>
                    <Text style={styles.buttonText}>Save changes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {activeTab === "password" && (
              <>
                <Text style={styles.modalTitle}>Change Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry
                  autoComplete="current-password"
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoComplete="new-password"
                  returnKeyType="done"
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={handleChangePassword} style={[styles.button, styles.saveButton]}>
                    <Text style={styles.buttonText}>Update Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                    <Text style={styles.buttonText}>Cancel</Text>
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