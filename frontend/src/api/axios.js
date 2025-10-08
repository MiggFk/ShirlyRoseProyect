import axios from "axios";

const api = axios.create({
  baseURL: "https://shirlyroseproyect.onrender.com/api", // tu backend
});

export default api;
