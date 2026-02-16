import axios from "axios";

//const API_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create a new product
export const productCreate = async (formData) => {
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  return await axios.post(`${API_BASE_URL}/product/create`, formData, config);
};

// Get a single product by slug
export const getProduct = async (slug) => {
  return await axios.get(`${API_BASE_URL}/product/${slug}`);
};

// Update a product by slug (multipart for files)
export const updateProduct = async (slug, formData) => {
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  return await axios.put(
    `${API_BASE_URL}/product/update/${slug}`,
    formData,
    config,
  );
};

// List products with optional filters, pagination, and sorting
export const getProducts = async ({
  page = 0,
  itemsPerPage = 12,
  sort = "Dernières Nouveautés",
  filters = {},
} = {}) => {
  return await axios.post(`${API_BASE_URL}/products`, {
    page,
    itemsPerPage,
    sort,
    filters,
  });
};

// Delete a product by slug
export const removeProduct = async (slug) => {
  return await axios.delete(`${API_BASE_URL}/product/${slug}`);
};

// Search products by query with optional filters
export const searchProducts = async ({
  query = "",
  page = 0,
  itemsPerPage = 12,
} = {}) => {
  return await axios.post(`${API_BASE_URL}/products/search`, {
    query,
    page,
    itemsPerPage,
  });
};
export const getNewArrivals = async (filter) => {
  try {
    return await axios.get(`${API_BASE_URL}/products/new-arrivals/${filter}`);
  } catch (error) {
    console.error("❌ Error fetching new arrivals:", error);
    throw error;
  }
};

export const getBestSellers = async () => {
  try {
    return await axios.get(`${API_BASE_URL}/products/best-sellers`);
  } catch (error) {
    console.error("❌ Error fetching new arrivals:", error);
    throw error;
  }
};

export const getAllProductTitles = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/titles`);
  return data;
};

// ✅ Get product details by slug
export const getProductBySlug = async (slug) => {
  const { data } = await axios.get(`${API_BASE_URL}/specialOffre/${slug}`);
  return data;
};

// ✅ Set product of the year
export const setProductOfTheYear = async (slug) => {
  const { data } = await axios.put(
    `${API_BASE_URL}/product/specialOffre/${slug}`,
  );
  return data;
};

export const getProductOfTheYear = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/getProductOfTheYear`);
  return data;
};

export const getProductsByCategory = async ({
  category,
  page = 0,
  itemsPerPage = 12,
  sort = "new",
  filters = {},
}) => {
  return await axios.post(`${API_BASE_URL}/products/category/${category}`, {
    page,
    itemsPerPage,
    sort,
    filters,
  });
};

// export const searchProducts = async (
//   query,
//   page,
//   sort,
//   itemsPerPage,
//   filters = {}
// ) =>
//   await axios.post(`${API_BASE_URL}/products/search/${query}`, {
//     page,
//     itemsPerPage,
//     sort,
//     filters,
//   });

// export const getProductsByCategory = async (
//   category,
//   page,
//   sort,
//   itemsPerPage,
//   filters = {}
// ) => {
//   return await axios.post(`${API_BASE_URL}/products/category/${category}`, {
//     page,
//     itemsPerPage,
//     sort,
//     filters,
//   });
// };

// export const getNewArrivals = async (limit) =>
//   await axios.get(`${API_BASE_URL}/products/newArrivals/${limit}`);
// export const getBestSellers = async (limit) =>
//   await axios.get(`${API_BASE_URL}/products/bestSellers/${limit}`);
// export const getProductTitlesByCategories = async () => {
//   return await axios.get(`${API_BASE_URL}/products/titles`);
// };

// export const getProductByTitle = async (title) => {
//   return await axios.get(`${API_BASE_URL}/products/title/${title}`);
// };

// export const saveProductOfTheYear = (productTitle) => {
//   return axios.post(`${API_BASE_URL}/products/saveProductOfTheYear`, {
//     title: productTitle,
//   });
// };

// export const getProductTitlesWithDetails = async () => {
//   return await axios.get(`${API_BASE_URL}/products/productOrder`);
// };

// export const getProductOfTheYear = async () => {
//   return await axios.get(`${API_BASE_URL}/products/productOfTheYear`);
// };

// Get dynamic product filters (colors & sizes)
export const getProductFilters = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/products/filters`);
    return data; // { colors: [...], sizes: [...] }
  } catch (error) {
    console.error("❌ Error fetching product filters:", error);
    throw error;
  }
};
