// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import viewSlice from "./ui/viewSlice";
import filterSlice from "./shopFilters/filtreSlice";
import pageOptions from "./shopFilters/pageOptions";
import cartSlice from "./cart/cartSlice";
import cartDrawer from "./ui/cartDrawer";
import userSlice from "./user/userSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Persist config for cart slice
const cartPersistConfig = {
  key: "cart",
  storage,
  // whitelist: ['items'], // optionally whitelist specific parts of the cart state
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice);

const userPersistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(userPersistConfig, userSlice);

export const store = configureStore({
  reducer: {
    view: viewSlice,
    filters: filterSlice,
    pageOptions: pageOptions,
    cart: persistedCartReducer, // use persisted reducer here
    cartDrawer: cartDrawer,
    user: persistedUserReducer, // Assuming you have a user slice for authentication
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
