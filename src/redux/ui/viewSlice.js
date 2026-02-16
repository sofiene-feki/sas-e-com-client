// src/features/ui/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  view: "grid", // 'grid' or 'list'
};

const viewSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGridView: (state) => {
      state.view = "grid";
    },
    setListView: (state) => {
      state.view = "list";
    },
    toggleView: (state) => {
      state.view = state.view === "grid" ? "list" : "grid";
    },
  },
});

export const { setGridView, setListView, toggleView } = viewSlice.actions;

export default viewSlice.reducer;
