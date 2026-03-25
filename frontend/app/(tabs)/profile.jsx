import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import EditProfileModal from "../../components/Profile/EditProfileModal.jsx";
import { useUser } from "../../context/UserContext";
import styles from "../../Styles/ProfileStyles.jsx";
import profilePic from "../assets/images/white_logo_circle.png";
import { API_BASE_URL } from "../config.jsx";

export default function Profile() {
  const { user, setUser, logout, token, updateProfileImage } = useUser();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditEmail(user.email || "");
      setEditPhone(user.phone || "");
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const refreshUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Error refrescando usuario:", err);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentPassword || currentPassword.length < 6) {
      Alert.alert(
        "You must enter your current password (minimum 6 characters) to save changes",
      );
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone.length >= 9 ? editPhone : undefined,
          password: currentPassword,
        }),
      });

      if (res.ok) {
        await refreshUser();
        setCurrentPassword("");
        setModalVisible(false);
      } else {
        const text = await res.text();
        console.error("Error backend:", text);
        Alert.alert("Error updating profile");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error updating profile");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      Alert.alert(
        "Please fill in the current password and a new password with at least 6 characters",
      );
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/users/${user.id}/update-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        },
      );

      if (res.ok) {
        Alert.alert("Password updated");
        setOldPassword("");
        setNewPassword("");
        setModalVisible(false);
      } else {
        const text = await res.text();
        console.error("Error backend:", text);
        Alert.alert("Error updating password");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error updating password");
    }
  };

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      updateProfileImage(file);
    }
  };

  if (!user)
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading profile...</Text>
      </View>
    );
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={pickProfileImage}>
            <View style={{ position: "relative" }}>
              <Image
                source={
                  user.profileImageUrl
                    ? { uri: user.profileImageUrl }
                    : profilePic
                }
                style={styles.profileImage}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#69188E",
                  borderRadius: 12,
                  padding: 4,
                }}
              >
                <Ionicons name="add" size={16} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.name}>{user.name}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user.phone || "-"}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Edit profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.button, styles.logoutButton]}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <EditProfileModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editName={editName}
        setEditName={setEditName}
        editEmail={editEmail}
        setEditEmail={setEditEmail}
        editPhone={editPhone}
        setEditPhone={setEditPhone}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        handleSaveProfile={handleSaveProfile}
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        handleChangePassword={handleChangePassword}
      />
    </>
  );
}
