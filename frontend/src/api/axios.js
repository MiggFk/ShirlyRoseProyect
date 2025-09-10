import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // tu backend
});

export default api;
