import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5001/api" : '/api', // change to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if using cookies/JWT
});
