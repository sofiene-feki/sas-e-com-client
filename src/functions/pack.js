import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// CREATE Pack
export const createPack = async (formData) =>
  await axios.post(`${API_BASE_URL}/pack/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// GET all Packs
export const getPacks = async () => await axios.get(`${API_BASE_URL}/packs`);

// GET one Pack by ID
export const getPack = async (id) =>
  await axios.get(`${API_BASE_URL}/pack/${id}`);

// UPDATE Pack
export const updatePack = async (id, formData) =>
  await axios.put(`${API_BASE_URL}/pack/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// DELETE Pack
export const removePack = async (id) =>
  await axios.delete(`${API_BASE_URL}/pack/${id}`);

export const getPacksByCategory = async ({
  category,
  page,
  itemsPerPage,
  sort,
}) => {
  return await axios
    .post(`${API_BASE_URL}/pack/category`, {
      category,
      page,
      itemsPerPage,
      sort,
    })
    .then((res) => res.data);
};
