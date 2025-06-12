import axios from "axios";

const SERVER_API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: SERVER_API_BASE_URL,
  withCredentials: true,
});

// // Adds Authorization header to every request
// api.interceptors.request.use((config) => {
//   const token = Cookies.get("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
