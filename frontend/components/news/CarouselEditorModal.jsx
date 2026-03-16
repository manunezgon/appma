import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Modal, TouchableOpacity, View } from "react-native";
import style from "./Styles";

export default function CarouselEditorModal({
  visible,
  onClose,
  images = [],
  onAdd,
  onDelete,
}) {
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
            {images.map((img, idx) => (
              <View key={idx} style={{ position: "relative" }}>
                <Image source={img} style={style.imagePreview} />
                <TouchableOpacity
                  style={style.deleteImageButton}
                  onPress={() => onDelete(idx)}
                >
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={style.addImageButton} onPress={onAdd}>
              <Ionicons name="add-outline" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
