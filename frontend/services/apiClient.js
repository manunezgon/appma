import { API_BASE_URL } from "../config/api";

export class ApiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const buildUrl = (path) =>
  path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

export const apiRequest = async (path, { token, headers, ...options } = {}) => {
  const body = options.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(buildUrl(path), {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      typeof data === "string" ? data : data?.error || data?.message;

    throw new ApiError(message || "Request failed", {
      status: res.status,
      body: data,
    });
  }

  return data;
};

export const toDateParam = (date) => date.toISOString().split("T")[0];
