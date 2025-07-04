import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://leetcode-backend-fc74.onrender.com/api/v1" : "/api/v1",
  withCredentials: true,
});
