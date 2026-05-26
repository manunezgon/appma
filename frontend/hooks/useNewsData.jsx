import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { API_BASE_URL } from "../app/config";
import { useUser } from "../context/UserContext";

export function useNewsData() {
  const { token } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJson = useCallback(
    async (url, options = {}) => {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        ...options,
      });
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      return res.json();
    },
    [token],
  );

  const fetchAnnouncements = useCallback(async () => {
    try {
      const data = await fetchJson(`${API_BASE_URL}/announcements`);
      setAnnouncements(
        Array.isArray(data)
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [],
      );
    } catch (err) {
      console.error(err);
      setAnnouncements([]);
    }
  }, [fetchJson]);

  const fetchCarouselImages = useCallback(async () => {
    try {
      const data = await fetchJson(`${API_BASE_URL}/carousel`);
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
  }, [fetchJson]);

  const createAnnouncement = useCallback(
    async (message) => {
      if (!message.trim()) return;
      try {
        await fetchJson(
          `${API_BASE_URL}/announcements?message=${encodeURIComponent(message)}`,
          { method: "POST" },
        );
        await fetchAnnouncements();
      } catch (err) {
        console.error(err);
      }
    },
    [fetchJson, fetchAnnouncements],
  );

  const deleteAnnouncement = useCallback(
    async (id) => {
      try {
        const res = await fetch(`${API_BASE_URL}/announcements/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Error deleting announcement");
        }

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
      aspect: [16, 9], 
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
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      await fetchCarouselImages();
    } catch (err) {
      console.error(err);
      await fetchCarouselImages(); 
    }
  }, [token, fetchCarouselImages]);

  const deleteImage = useCallback(
    async (imageId) => {
      try {
        await fetch(`${API_BASE_URL}/carousel/${imageId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
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
        await fetch(`${API_BASE_URL}/carousel/reorder`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderedIds),
        });
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
