import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import style from "../../Styles/NewsStyles";

export default function CarouselEditorModal({
  visible,
  onClose,
  images = [],
  onAdd,
  onDelete,
  onReorder,
}) {
  const [localImages, setLocalImages] = useState(images);

  useEffect(() => {
    if (visible) setLocalImages(images);
  }, [visible]);

  const moveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= localImages.length) return;
    const newImages = [...localImages];
    [newImages[index], newImages[newIndex]] = [
      newImages[newIndex],
      newImages[index],
    ];
    setLocalImages(newImages);
  };

  const handleDelete = (index) => {
    Alert.alert(
      "Borrar imagen",
      "¿Estás seguro de que quieres borrar esta imagen?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: () => {
            const newImages = [...localImages];
            newImages.splice(index, 1);
            setLocalImages(newImages);
            onDelete(index);
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={style.modalOverlay}>
        <View style={style.editModalContent}>
          <TouchableOpacity onPress={onClose} style={style.closeModalButton}>
            <Ionicons name="close" size={30} color="#69188E" />
          </TouchableOpacity>

          <View style={style.imagesContainer}>
            {localImages.map((img, idx) => (
              <View key={img.id} style={style.imagePreviewWrapper}>
                <Image
                  source={{ uri: img.imageUrl }}
                  style={style.imagePreview}
                />

                <View style={style.reorderButtonsContainer}>
                  <TouchableOpacity
                    style={style.reorderButton}
                    onPress={() => moveImage(idx, -1)}
                  >
                    <Ionicons name="arrow-up-outline" size={16} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={style.reorderButton}
                    onPress={() => moveImage(idx, +1)}
                  >
                    <Ionicons
                      name="arrow-down-outline"
                      size={16}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={style.deleteImageButton}
                  onPress={() => handleDelete(idx)}
                >
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={style.addImageButton} onPress={onAdd}>
              <Ionicons name="add-outline" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={style.saveButton}
            onPress={() => {
              if (onReorder) onReorder(localImages.map((img) => img.id));
              onClose();
            }}
          >
            <Text style={style.text}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
