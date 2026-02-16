import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1️⃣ Get all categories
export const getCategories = async () =>
  await axios.get(`${API_BASE_URL}/categories`);

// 2️⃣ Get a single category by slug
export const getCategory = async (slug) =>
  await axios.get(`${API_BASE_URL}/category/${slug}`);

// 3️⃣ Delete a category by ID
export const removeCategory = async (id) =>
  await axios.delete(`${API_BASE_URL}/category/${id}`);

// 4️⃣ Update category (name + optional image)
export const updateCategory = async (slug, { name, imageFile }) => {
  const formData = new FormData();
  formData.append("name", name);
  if (imageFile) formData.append("image", imageFile); // only append if exists

  return await axios.put(`${API_BASE_URL}/category/${slug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 5️⃣ Create category (name + optional image)
export const createCategory = async ({ name, imageFile }) => {
  const formData = new FormData();
  formData.append("name", name);
  if (imageFile) formData.append("image", imageFile);

  return await axios.post(`${API_BASE_URL}/category`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 6️⃣ Get subcategories for a category
export const getCategorySubs = async (_id) =>
  await axios.get(`${API_BASE_URL}/category/subs/${_id}`);
