import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from "../app/config";
import { useUser } from "../context/UserContext";

export function useNewsData() {
  const { user } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJson = useCallback(
    async (url, options = {}) => {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${user?.token}` },
        ...options,
      });
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      return res.json();
    },
    [user]
  );

  const fetchAnnouncements = useCallback(async () => {
    try {
      const data = await fetchJson(`${API_BASE_URL}/announcements`);
      setAnnouncements(
        Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : []
      );
    } catch (err) {
      console.error(err);
      setAnnouncements([]);
    }
  }, [fetchJson]);

  const fetchCarouselImages = useCallback(async () => {
    try {
      const data = await fetchJson(`${API_BASE_URL}/carousel`);
      setCarouselImages(data.sort((a, b) => a.position - b.position));
    } catch (err) {
      console.error(err);
      setCarouselImages([]);
    }
  }, [fetchJson]);

  const createAnnouncement = useCallback(
    async (message) => {
      if (!message.trim()) return;
      try {
        await fetchJson(
          `${API_BASE_URL}/announcements?message=${encodeURIComponent(message)}`,
          { method: "POST" }
        );
        await fetchAnnouncements();
      } catch (err) {
        console.error(err);
      }
    },
    [fetchJson, fetchAnnouncements]
  );

  const addImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) return;
    const localUri = result.assets[0].uri;
    const formData = new FormData();
    formData.append("file", {
      uri: localUri,
      type: "image/jpeg",
      name: "carousel.jpg",
    });
    try {
      await fetch(`${API_BASE_URL}/carousel/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });
      await fetchCarouselImages();
    } catch (err) {
      console.error(err);
    }
  }, [user, fetchCarouselImages]);

  const deleteImage = useCallback(
    async (imageId) => {
      try {
        await fetch(`${API_BASE_URL}/carousel/${imageId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setCarouselImages((prev) =>
          prev.filter((img) => img.id !== imageId)
        );
      } catch (err) {
        console.error(err);
        await fetchCarouselImages();
      }
    },
    [user, fetchCarouselImages]
  );

  const reorderImages = useCallback(
    async (orderedIds) => {
      try {
        await fetch(`${API_BASE_URL}/carousel/reorder`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(orderedIds),
        });
        await fetchCarouselImages();
      } catch (err) {
        console.error("Error al reordenar:", err);
      }
    },
    [user, fetchCarouselImages]
  );

  return {
    announcements,
    carouselImages,
    loading,
    fetchAnnouncements,
    fetchCarouselImages,
    createAnnouncement,
    addImage,
    deleteImage,
    reorderImages,
  };
}