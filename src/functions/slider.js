import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createSliderImage = async (formData) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return await axios.post(`${API_BASE_URL}/slider/create`, formData, config);
};

export const getSliderImages = async () => {
  return await axios.get(`${API_BASE_URL}/slider`);
};

export const updateSliderImage = async (id, formData) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return await axios.put(`${API_BASE_URL}/slider/${id}`, formData, config);
};

export const removeSliderImage = async (id) => {
  return await axios.delete(`${API_BASE_URL}/slider/delete/${id}`);
};
