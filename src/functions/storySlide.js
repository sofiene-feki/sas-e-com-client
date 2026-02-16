import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Create a new story slide (with video upload)
export const createStorySlide = async (formData) =>
  await axios.post(`${API_BASE_URL}/story-slide/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ✅ Get all story slides
export const getStorySlides = async () =>
  await axios.get(`${API_BASE_URL}/story-slides`);

// ✅ Get a single story slide by ID
export const getStorySlide = async (id) =>
  await axios.get(`${API_BASE_URL}/story-slide/${id}`);

// ✅ Update a story slide (with optional new video upload)
export const updateStorySlide = async (id, formData) =>
  await axios.put(`${API_BASE_URL}/story-slide/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ✅ Delete a story slide
export const deleteStorySlide = async (id) =>
  await axios.delete(`${API_BASE_URL}/story-slide/${id}`);
