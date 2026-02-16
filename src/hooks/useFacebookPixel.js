// src/hooks/useFacebookPixel.js
import { useCallback } from "react";
import { fbTrack } from "../service/fbPixel";

/**
 * Centralized Facebook Pixel event tracker
 * Handles ViewContent, AddToCart, InitiateCheckout, Purchase
 * and automatically normalizes data structure.
 */
export const useFacebookPixel = () => {
  // ✅ ViewContent
  const trackViewContent = useCallback((product) => {
    if (!product?._id) return;
    fbTrack("ViewContent", {
      content_ids: [product._id],
      content_name: product.Title,
      content_category: product.Category?.name || "Unknown",
      content_brand: product.Brand || "Generic",
      content_type: "product",
      value: product.Price,
      currency: "TND",
    });
  }, []);

  // ✅ AddToCart
  const trackAddToCart = useCallback((product, finalPrice) => {
    fbTrack("AddToCart", {
      content_ids: [product._id],
      content_name: product.Title,
      content_category: product.Category?.name || "Unknown",
      content_brand: product.Brand || "Generic",
      content_type: "product",
      value: finalPrice,
      currency: "TND",
    });
  }, []);

  // ✅ InitiateCheckout
  const trackInitiateCheckout = useCallback((cartItems, subtotal) => {
    fbTrack("InitiateCheckout", {
      num_items: cartItems.length,
      contents: cartItems.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
        item_price: item.price,
      })),
      value: subtotal,
      currency: "TND",
    });
  }, []);

  // ✅ Purchase
  const trackPurchase = useCallback((cartItems, total) => {
    fbTrack("Purchase", {
      content_ids: cartItems.map((i) => i.productId),
      contents: cartItems.map((i) => ({
        id: i.productId,
        quantity: i.quantity,
        item_price: i.price,
      })),
      content_type: "product",
      value: total,
      currency: "TND",
    });
  }, []);

  return {
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
  };
};
