import { apiRequest } from "./apiClient";
import { File } from "expo-file-system";

export const getUsers = (token) => apiRequest("/users", { token });

export const getCurrentUser = (token) => apiRequest("/users/me", { token });

export const loginRequest = ({ email, password }) =>
  apiRequest("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerRequest = ({ name, email, password, phone }) =>
  apiRequest("/users/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });

export const updateUserRequest = (userId, userData, token) =>
  apiRequest(`/users/${userId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(userData),
  });

export const updatePasswordRequest = (userId, passwordData, token) =>
  apiRequest(`/users/${userId}/update-password`, {
    method: "POST",
    token,
    body: JSON.stringify(passwordData),
  });

export const uploadProfileImageRequest = (userId, file, token) => {
  const formData = new FormData();
  const imageFile = file.file ?? new File(file.uri);
  formData.append("file", imageFile);

  return apiRequest(`/users/${userId}/upload-image`, {
    method: "POST",
    token,
    body: formData,
  });
};
