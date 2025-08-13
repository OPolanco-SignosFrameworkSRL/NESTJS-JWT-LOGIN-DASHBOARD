import axios from "axios";
import settings from "./settings";


const api = axios.create({

  baseURL: settings.baseAPI
  
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

export default api;