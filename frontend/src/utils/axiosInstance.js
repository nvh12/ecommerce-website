import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu bị 403 và chưa retry lần nào
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/auth/refresh");
        // console.log("Refresh token thành công");
        toast.success("Phiên đăng nhập đã được làm mới thành công");
        return axiosInstance(originalRequest); // Retry request cũ
      } catch (refreshError) {
        // console.error("Refresh token thất bại");

        toast.error("Phiên đăng nhập đã hết, vui lòng đăng nhập lại");

        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');

        setTimeout(() => {
          window.location.href = "/";
        }, 2000); 

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
