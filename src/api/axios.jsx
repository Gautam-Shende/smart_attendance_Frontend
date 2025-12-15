import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-attendace-backend.onrender.com/",
});

export default api;
