import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EditProfileModal from "../../components/Profile/EditProfileModal.jsx";
import styles from "../../components/Profile/Styles.jsx";
import { useUser } from "../../context/UserContext";
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
        "Debes introducir tu contraseña actual (mínimo 6 caracteres) para guardar cambios",
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
        Alert.alert("Error al actualizar perfil");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error al actualizar perfil");
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      Alert.alert(
        "Rellena la contraseña actual y una nueva de mínimo 6 caracteres",
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
        Alert.alert("Contraseña actualizada");
        setOldPassword("");
        setNewPassword("");
        setModalVisible(false);
      } else {
        const text = await res.text();
        console.error("Error backend:", text);
        Alert.alert("Error al actualizar contraseña");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error al actualizar contraseña");
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
          <Image
            source={
              user.profileImageUrl ? { uri: user.profileImageUrl } : profilePic
            }
            style={styles.profileImage}
          />
          <View style={styles.headerText}>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <TouchableOpacity onPress={pickProfileImage}>
            <Text style={{ color: "#69188E", marginTop: 5 }}>Change Photo</Text>
          </TouchableOpacity>
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
