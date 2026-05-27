import { apiRequest } from "./apiClient";

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
  formData.append("file", {
    uri: file.uri,
    name: "profile.jpg",
    type: "image/jpeg",
  });

  return apiRequest(`/users/${userId}/upload-image`, {
    method: "POST",
    token,
    body: formData,
  });
};
