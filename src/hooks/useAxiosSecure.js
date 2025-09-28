import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const useAxiosSecure = () => {
  const { accessToken } = useContext(AuthContext);

  const instance = axios.create({
    baseURL: "https://server-bloodbridge.vercel.app",
  });

  instance.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return instance;
};

export default useAxiosSecure;
