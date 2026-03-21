import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"

// -----------------------------
// Professional Axios instance
// -----------------------------
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
})

// -----------------------------
// Request Interceptor
// -----------------------------
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token if exists
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    // Ensure all dynamic paths are lowercase
    if (config.url) {
      config.url = config.url.toLowerCase()
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// -----------------------------
// Response Interceptor
// -----------------------------
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    // Extract a clean message
    const message =
      error.response?.data?.message || // API message
      JSON.stringify(error.response?.data) || // raw API data fallback
      error.message || // Axios error
      "Unexpected API error"

    console.error("API Error:", message)

    // Return a structured object instead of raw Axios error
    return Promise.reject({
      ...error,
      message,
      status: error.response?.status,
      data: error.response?.data,
    })
  }
)

export default api