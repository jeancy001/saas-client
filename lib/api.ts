import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1/clinic",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const clinicId = localStorage.getItem("clinicId");

      // ✅ attach token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // optional: attach clinicId globally if backend expects it
      if (clinicId) {
        config.headers["x-clinic-id"] = clinicId;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "API Error";

    console.error("API FULL ERROR:", error?.response?.data || error);

    return Promise.reject({ message, raw: error });
  }
);

export default api;