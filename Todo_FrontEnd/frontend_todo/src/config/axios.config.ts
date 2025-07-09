import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:7161/api",
    timeout: 1500,
});

export default axiosInstance;