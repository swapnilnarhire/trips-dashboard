import axios from "axios";

const axiosInstance = (
  baseURL = "http://localhost:3000/",
  token,
  contentType = "application/json;charset=utf-8"
) => {
  const instance = axios.create({
    baseURL,
    timeout: 60000,
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
    },
  });

  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
};

export const fetchTrips2 = async () => {
  const path = `/getActiveGateways`;
  const res = await axiosInstance().get(path);
  return res && res.data ? res.data : null;
};

export const fetchTrips = async (data) => {
  const path = `/api/getTrips`;
  const res = await axiosInstance().post(path, data);
  return res && res.data ? res.data : null;
};
