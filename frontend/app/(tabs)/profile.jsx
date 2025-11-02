import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/usercontext';
import { API_BASE_URL } from "../config.jsx";
import CreateScheduleModal from "../../components/CreateScheduleModal.jsx";

export default function Profile() {
  const { user, setUser, logout, token } = useUser();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [createScheduleModalVisible, setCreateScheduleModalVisible] = useState(false);
  const [editScheduleModalVisible, setEditScheduleModalVisible] = useState(false);

  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
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
      console.error('Error refrescando usuario:', err);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!currentPassword || currentPassword.length < 6) {
      Alert.alert('Debes introducir tu contraseña actual (mínimo 6 caracteres) para guardar cambios');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
        setCurrentPassword('');
        setModalVisible(false);    
      } else {
        const text = await res.text();
        console.error('Error backend:', text);
        Alert.alert('Error al actualizar perfil');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error al actualizar perfil');
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      Alert.alert('Rellena la contraseña actual y una nueva de mínimo 6 caracteres');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id}/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (res.ok) {
        Alert.alert('Contraseña actualizada');
        setOldPassword('');
        setNewPassword('');
        setModalVisible(false);    
      } else {
        const text = await res.text();
        console.error('Error backend:', text);
        Alert.alert('Error al actualizar contraseña');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error al actualizar contraseña');
    }
  };

  if (!user) return (
    <View style={styles.container}>
      <Text style={styles.title}>Cargando perfil...</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Rol:</Text>
        <Text style={styles.value}>{user.role}</Text>

        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{user.phone}</Text>
      </View>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Ajustes</Text>
      </TouchableOpacity>

      {user?.role === "ADMIN" && (
        <TouchableOpacity onPress={() => setScheduleModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Gestionar horarios</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.logoutButton]}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>

      {/* Settings modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>

              <View style={styles.modalInner}>
                {/* Profile settings */}
                <TextInput style={styles.input} placeholder="Nombre" value={editName} onChangeText={setEditName} />
                <TextInput style={styles.input} placeholder="Email" value={editEmail} onChangeText={setEditEmail} />
                <TextInput style={styles.input} placeholder="Teléfono (opcional, mínimo 9 caracteres)" value={editPhone} onChangeText={setEditPhone} keyboardType="phone-pad" />
                <TextInput style={styles.input} placeholder="Contraseña actual" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
                <TouchableOpacity onPress={handleSaveProfile} style={styles.button}>
                  <Text style={styles.buttonText}>Guardar cambios</Text>
                </TouchableOpacity>

                <View style={styles.separator} />

                {/* Password settings */}
                <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
                <TextInput style={styles.input} placeholder="Contraseña actual" secureTextEntry value={oldPassword} onChangeText={setOldPassword} />
                <TextInput style={styles.input} placeholder="Nueva contraseña" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
                <TouchableOpacity onPress={handleChangePassword} style={styles.button}>
                  <Text style={styles.buttonText}>Actualizar contraseña</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.button, styles.cancelButton]}>
                  <Text style={styles.buttonText}>Cerrar ajustes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

          </View>
        </View>
      </Modal>

      {/* Schedule modal */}
      <Modal
        visible={scheduleModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalInner}>
                <Text style={styles.modalTitle}>Gestión de horarios</Text>

                <TouchableOpacity onPress={() => { setScheduleModalVisible(false); setCreateScheduleModalVisible(true); }} style={styles.button}>
                  <Text style={styles.buttonText}>Crear horario nuevo</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setScheduleModalVisible(false); setEditScheduleModalVisible(true); }} style={styles.button}>
                  <Text style={styles.buttonText}>Modificar horario existente</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setScheduleModalVisible(false)} style={[styles.button, styles.cancelButton]}>
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* New schedule */}
      <CreateScheduleModal
        visible={createScheduleModalVisible}
        onClose={() => setCreateScheduleModalVisible(false)}
        token={token}
      />

      {/* Modify schedule */}
      <Modal
        visible={editScheduleModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEditScheduleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalInner}>
                <Text style={styles.modalTitle}>Modificar horario existente</Text>
                {/* Aquí más adelante pondremos los inputs / picker para editar */}
                <TouchableOpacity
                  onPress={() => setEditScheduleModalVisible(false)}
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    fontWeight: 'bold' 
  },
  infoBox: { 
    width: '90%', 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    marginBottom: 20, 
    backgroundColor: '#f9f9f9' 
  },
  label: { 
    fontSize: 14, 
    color: '#555', 
    marginTop: 10 
  },
  value: { 
    fontSize: 16, 
    color: '#000' 
  },
  button: { 
    backgroundColor: '#69188E', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    width: '70%', 
    marginTop: 10 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    textAlign: 'center' 
  },
  logoutButton: { 
    backgroundColor: '#aaa', 
    marginTop: 20 
  },
  cancelButton: { 
    backgroundColor: '#aaa', 
    marginTop: 10 
  },
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    width: '90%', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  separator: { 
    marginVertical: 15 
  },
  modalScroll: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalInner: { 
    width: '100%', 
    alignItems: 'center' 
  },
  input: { 
    width: '90%', 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 10, 
    marginVertical: 5 
  },
});
