import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { useUser } from "../context/UserContext";
import {
  createAnnouncementRequest,
  deleteAnnouncementRequest,
  deleteCarouselImageRequest,
  getAnnouncements,
  getCarouselImages,
  reorderCarouselImagesRequest,
  uploadCarouselImageRequest,
} from "../services/newsApi";

export function useNewsData() {
  const { token } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const data = await getAnnouncements(token);
      setAnnouncements(
        Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [],
      );
    } catch (err) {
      console.error(err);
      setAnnouncements([]);
    }
  }, [token]);

  const fetchCarouselImages = useCallback(async () => {
    try {
      const data = await getCarouselImages(token);
      setCarouselImages(
        Array.isArray(data)
          ? data
              .map((img) => ({
                id: img.id,
                imageUrl:
                  typeof img.imageUrl === "string"
                    ? img.imageUrl
                    : img.imageUrl?.uri,
                position: img.position,
              }))
              .sort((a, b) => a.position - b.position)
          : [],
      );
    } catch (err) {
      console.error(err);
      setCarouselImages([]);
    }
  }, [token]);

  const createAnnouncement = useCallback(
    async (message) => {
      if (!message.trim()) return;
      try {
        await createAnnouncementRequest(message, token);
        await fetchAnnouncements();
      } catch (err) {
        console.error(err);
      }
    },
    [fetchAnnouncements, token],
  );

  const deleteAnnouncement = useCallback(
    async (id) => {
      try {
        await deleteAnnouncementRequest(id, token);
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error("deleteAnnouncement error:", err);
      }
    },
    [token],
  );

  const addImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2], 
      quality: 0.8,
    });

    if (result.canceled) return;

    const localUri = result.assets[0].uri;

    const tempId = Date.now();

    setCarouselImages((prev) => [
      ...prev,
      {
        id: tempId,
        imageUrl: localUri,
        uploading: true,
      },
    ]);

    try {
      await uploadCarouselImageRequest(localUri, token);
      await fetchCarouselImages();
    } catch (err) {
      console.error(err);
      await fetchCarouselImages(); 
    }
  }, [token, fetchCarouselImages]);

  const deleteImage = useCallback(
    async (imageId) => {
      try {
        await deleteCarouselImageRequest(imageId, token);
        setCarouselImages((prev) => prev.filter((img) => img.id !== imageId));
      } catch (err) {
        console.error(err);
        await fetchCarouselImages();
      }
    },
    [token, fetchCarouselImages],
  );

  const reorderImages = useCallback(
    async (orderedIds) => {
      try {
        await reorderCarouselImagesRequest(orderedIds, token);
        await fetchCarouselImages();
      } catch (err) {
        console.error("Error al reordenar:", err);
      }
    },
    [token, fetchCarouselImages],
  );

  return {
    announcements,
    carouselImages,
    loading,
    fetchAnnouncements,
    deleteAnnouncement,
    fetchCarouselImages,
    createAnnouncement,
    addImage,
    deleteImage,
    reorderImages,
  };
}
