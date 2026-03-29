import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")

      if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    let message = "Unexpected API error"

    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        message = error.response.data
      } else if (error.response.data.message) {
        message = error.response.data.message
      } else {
        message = JSON.stringify(error.response.data)
      }
    } else if (error.message) {
      message = error.message
    }

    console.error("API Error:", message)

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
      original: error,
    })
  }
)

export default api