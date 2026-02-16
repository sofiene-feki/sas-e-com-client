// features/shop/shopSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: 0,
  productsPerPage: 12,
  sortOption: "default", // or some identifier matching your sortOptions
  pageSizeOption: 12, // keep consistent with productsPerPage
};

const pageOptions = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setProductsPerPage(state, action) {
      state.productsPerPage = action.payload;
      state.currentPage = 0; // reset page on page size change
    },
    setSortOption(state, action) {
      state.sortOption = action.payload;
      state.currentPage = 0; // reset page on sort change
    },
  },
});

export const { setCurrentPage, setProductsPerPage, setSortOption } =
  pageOptions.actions;
export default pageOptions.reducer;
