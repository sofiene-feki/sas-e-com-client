import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// CREATE Banner
export const createBanner = async (formData) =>
  await axios.post(`${API_BASE_URL}/create/banner`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// GET all Banners
export const getBanners = async () =>
  await axios.get(`${API_BASE_URL}/banners`);

// GET one Banner by ID
export const getBanner = async (id) =>
  await axios.get(`${API_BASE_URL}/banner/${id}`);

// UPDATE Banner
export const updateBanner = async (id, formData) =>
  await axios.put(`${API_BASE_URL}/update/banner/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// DELETE Banner
export const removeBanner = async (id) =>
  await axios.delete(`${API_BASE_URL}/remove/banner/${id}`);
