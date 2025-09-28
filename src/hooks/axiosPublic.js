import axios from "axios";

const useAxiosPublic = () => {
  const instance = axios.create({
    baseURL: "https://server-bloodbridge.vercel.app",
  });

  return instance;
};

export default useAxiosPublic