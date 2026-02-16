import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getStoreSettings = async () => {
    return await axios.get(`${API_BASE_URL}/store-settings`);
};

export const updateStoreSettings = async (formData) => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    return await axios.put(`${API_BASE_URL}/store-settings`, formData, config);
};
