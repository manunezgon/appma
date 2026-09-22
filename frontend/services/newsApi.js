import { apiRequest } from "./apiClient";
import { File } from "expo-file-system";

export const getAnnouncements = (token) =>
  apiRequest("/announcements", { token });

export const createAnnouncementRequest = (message, token) =>
  apiRequest("/announcements", {
    method: "POST",
    token,
    body: JSON.stringify({ message }),
  });

export const deleteAnnouncementRequest = (id, token) =>
  apiRequest(`/announcements/${id}`, {
    method: "DELETE",
    token,
  });

export const getCarouselImages = (token) =>
  apiRequest("/carousel", { token });

export const uploadCarouselImageRequest = (asset, token) => {
  const formData = new FormData();
  const file = asset.file ?? new File(asset.uri);
  formData.append("file", file);

  return apiRequest("/carousel/upload", {
    method: "POST",
    token,
    body: formData,
  });
};

export const deleteCarouselImageRequest = (imageId, token) =>
  apiRequest(`/carousel/${imageId}`, {
    method: "DELETE",
    token,
  });

export const reorderCarouselImagesRequest = (orderedIds, token) =>
  apiRequest("/carousel/reorder", {
    method: "PUT",
    token,
    body: JSON.stringify(orderedIds),
  });
