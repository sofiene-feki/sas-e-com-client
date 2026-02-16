import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.productId === newItem.productId &&
          item.selectedSize === newItem.selectedSize &&
          item.selectedColor === newItem.selectedColor
      );

      state.totalQuantity++;
      if (!existingItem) {
        state.items.push({ ...newItem, quantity: 1 });
      } else {
        existingItem.quantity++;
      }

      // ✅ Use selectedSizePrice if available
      state.totalPrice = state.items.reduce(
        (total, item) =>
          total +
          (item.selectedSizePrice > 0 ? item.selectedSizePrice : item.price) *
            item.quantity,
        0
      );
    },

    removeItem(state, action) {
      const { productId, selectedSize, selectedColor } = action.payload;
      const index = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );
      if (index !== -1) {
        state.totalQuantity -= state.items[index].quantity;
        state.items.splice(index, 1);
        state.totalPrice = state.items.reduce(
          (total, item) =>
            total +
            (item.selectedSizePrice > 0 ? item.selectedSizePrice : item.price) *
              item.quantity,
          0
        );
      }
    },

    increaseQuantity(state, action) {
      const { productId, selectedSize, selectedColor } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.productId === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );
      if (existingItem) {
        existingItem.quantity++;
        state.totalQuantity++;
        state.totalPrice +=
          existingItem.selectedSizePrice > 0
            ? existingItem.selectedSizePrice
            : existingItem.price;
      }
    },

    decreaseQuantity(state, action) {
      const { productId, selectedSize, selectedColor } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.productId === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity--;
          state.totalQuantity--;
          state.totalPrice -=
            existingItem.selectedSizePrice > 0
              ? existingItem.selectedSizePrice
              : existingItem.price;
        } else {
          state.items = state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
              )
          );
          state.totalQuantity--;
          state.totalPrice = state.items.reduce(
            (total, item) =>
              total +
              (item.selectedSizePrice > 0
                ? item.selectedSizePrice
                : item.price) *
                item.quantity,
            0
          );
        }
      }
    },

    updateItemOptions(state, action) {
      const { productId, selectedSize, selectedColor } = action.payload;

      const existingItem = state.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        if (selectedSize != null) existingItem.selectedSize = selectedSize;
        if (selectedColor != null) existingItem.selectedColor = selectedColor;

        // Optional: update selectedSizePrice based on the new size
        if (
          selectedSize != null &&
          Array.isArray(existingItem.sizes) &&
          existingItem.sizes.length > 0
        ) {
          const sizeObj = existingItem.sizes.find((s) => s.id === selectedSize);
          existingItem.selectedSizePrice = sizeObj?.price ?? existingItem.price;
        }

        // Recalculate total price
        state.totalPrice = state.items.reduce(
          (total, item) =>
            total +
            (item.selectedSizePrice > 0 ? item.selectedSizePrice : item.price) *
              item.quantity,
          0
        );
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  updateItemOptions,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
