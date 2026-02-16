import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getbrands = async () => await axios.get(`${API_BASE_URL}/brands`);

export const getbrand = async (slug) =>
  await axios.get(`${API_BASE_URL}/brand/${slug}`);

export const removebrand = async (slug) =>
  await axios.delete(`${API_BASE_URL}/brand/${slug}`, {});

export const updatebrand = async (slug, brand) =>
  await axios.put(`${API_BASE_URL}/brand/${slug}`, { brand });

export const createbrand = async (brand) =>
  await axios.post(`${API_BASE_URL}/brand`, { brand });
