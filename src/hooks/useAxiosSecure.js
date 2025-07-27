import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";


const useAxiosSecure = () => {
  const { user } = useContext(AuthContext);
  console.log("🚀 ~ useAxiosSecure ~ accessToken:", user.accessToken);
  const instance = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  });


  useEffect(() => {
  }, [])
  

  return instance;
};

export default useAxiosSecure;