import axios from 'axios';

const axiosAPI = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

axiosAPI.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = localStorage.getItem('language') ?? 'en';
  return config;
});

export const uploadSingle = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosAPI.post('/upload', { file }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response?.data;
};

export default axiosAPI;
