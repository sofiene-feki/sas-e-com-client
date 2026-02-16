import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: {
    priceRange: [0, 500], // default min/max
  },
  openSections: ["brand", "category", "color", "size", "priceRange"], // default open
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    toggleFilter(state, action) {
      const { sectionId, value } = action.payload;

      // Handle non-price toggles
      if (sectionId !== "priceRange") {
        const current = state.selected[sectionId] || [];
        state.selected[sectionId] = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
      }
    },

    setPriceRange(state, action) {
      // Directly set price range
      state.selected.priceRange = action.payload; // [min, max]
    },

    toggleSection(state, action) {
      const id = action.payload;
      state.openSections = state.openSections.includes(id)
        ? state.openSections.filter((x) => x !== id)
        : [...state.openSections, id];
    },

    clearAllFilters(state) {
      state.selected = { priceRange: [0, 1000] }; // reset but keep price default
    },
  },
});

export const { toggleFilter, toggleSection, clearAllFilters, setPriceRange } =
  filterSlice.actions;
export default filterSlice.reducer;
