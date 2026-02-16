import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch subcategories by parent category
export const getSubCategories = async (parentId) => {
  return await axios.get(`${API_BASE_URL}/subs`, {
    params: { parent: parentId }, // send parent id as query param
  });
};

// Create subcategory
export const createSubCategory = async (subName, parentId) => {
  return await axios.post(`${API_BASE_URL}/sub`, {
    sub: { sub: subName, parent: parentId },
  });
};

// Delete subcategory
export const deleteSubCategory = async (id) => {
  return await axios.delete(`${API_BASE_URL}/sub/${id}`);
};
