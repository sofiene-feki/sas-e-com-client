import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  updateItemOptions,
} from "../../redux/cart/cartSlice";
import { closeCart } from "../../redux/ui/cartDrawer";
import {
  CreditCardIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import emptyCart from "../../assets/emptyCart.png";
import CustomDialog from "../ui/Dialog";
import { useFacebookPixel } from "../../hooks/useFacebookPixel";
import { sendServerEvent } from "../../functions/fbCapi";

const formatPrice = (price) => {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 3,
  }).format(price);
};

export default function CartDrawer() {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.cartDrawer.isCartOpen);
  const items = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const { trackInitiateCheckout } = useFacebookPixel();

  const handleCheckoutClick = () => {
    if (items.length === 0) return;

    // Client-side Pixel
    trackInitiateCheckout(items, totalPrice);

    // Server-side CAPI
    sendServerEvent({
      eventName: "InitiateCheckout",
      //user: { email: userEmail, phone: userPhone },
      products: items.map((i) => ({
        _id: i.productId,
        quantity: i.quantity,
        price: i.price,
        category: i.category || "Unknown",
      })),
      totalPrice,
    });

    dispatch(closeCart());
  };

  return (
    <CustomDialog
      open={isOpen}
      onClose={() => dispatch(closeCart())}
      position="right"
    >
      <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
            <button
              type="button"
              onClick={() => dispatch(closeCart())}
              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close panel</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="mt-8">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <img
                  src={emptyCart}
                  alt="Empty cart"
                  className="w-40 h-40 object-contain mb-4"
                />
                <p className="text-center text-gray-500">
                  Votre panier est vide.
                </p>
              </div>
            ) : (
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {items.map((item, idx) => (
                  <li key={idx} className="flex py-4 md:py-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="ml-2 md:ml-4 flex flex-1 flex-col">
                      {/* Name & Delete */}
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="flex-1 text-sm md:text-base font-medium text-gray-900 break-words line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          onClick={() =>
                            dispatch(
                              removeItem({
                                productId: item.productId,
                                selectedSize: item.selectedSize,
                                selectedColor: item.selectedColor,
                              })
                            )
                          }
                          className="w-8 h-8 flex-shrink-0 bg-white shadow-xl border border-gray-300 rounded text-gray-700 hover:bg-gray-200 flex items-center justify-center"
                          aria-label="Supprimer"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Options: Color & Size */}
                      <div className="flex flex-col flex-wrap gap-1 md:gap-3 text-sm text-gray-700">
                        {Array.isArray(item.colors) &&
                          item.colors.length > 0 && (
                            <label className="flex items-center gap-1">
                              <span className="text-gray-500">Couleur:</span>
                              <select
                                value={item.selectedColor ?? ""}
                                className="bg-transparent outline-none cursor-pointer"
                                onChange={(e) =>
                                  dispatch(
                                    updateItemOptions({
                                      productId: item.productId,
                                      selectedColor: e.target.value,
                                      selectedSize: item.selectedSize,
                                    })
                                  )
                                }
                              >
                                {item.colors.map((color) => (
                                  <option key={color._id} value={color.name}>
                                    {color.name}
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}

                        {Array.isArray(item.sizes) && item.sizes.length > 0 && (
                          <label className="flex items-center gap-1">
                            <span className="text-gray-500">Taille:</span>
                            <select
                              value={item.selectedSize ?? ""}
                              className="bg-transparent outline-none cursor-pointer"
                              onChange={(e) =>
                                dispatch(
                                  updateItemOptions({
                                    productId: item.productId,
                                    selectedColor: item.selectedColor,
                                    selectedSize: e.target.value,
                                  })
                                )
                              }
                            >
                              {item.sizes.map((size) => (
                                <option key={size._id} value={size.name}>
                                  {size.name}
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                      </div>

                      {/* Pack Products */}
                      {item.type === "pack" && (
                        <div className="cart-products space-y-2">
                          {item.products?.map((prod, index) => (
                            <div
                              key={index}
                              className="flex flex-column flex-wrap items-center gap-2 text-sm md:text-base"
                            >
                              <span className="text-gray-500">
                                {prod.name || "Unnamed Product"} :
                              </span>
                              {prod.selectedSize && (
                                <span>{prod.selectedSize}</span>
                              )}
                              {prod.selectedColor && (
                                <span>| {prod.selectedColor}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 md:mt-3">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() =>
                              dispatch(
                                decreaseQuantity({
                                  productId: item.productId,
                                  selectedSize: item.selectedSize,
                                  selectedColor: item.selectedColor,
                                })
                              )
                            }
                            className="px-2.5 bg-white shadow-xl border border-gray-300 rounded text-gray-700 hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                increaseQuantity({
                                  productId: item.productId,
                                  selectedSize: item.selectedSize,
                                  selectedColor: item.selectedColor,
                                })
                              )
                            }
                            className="px-2 bg-white shadow-xl border border-gray-300 rounded text-gray-700 hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-base font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-100 border-gray-200 px-4 py-2 sm:px-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Total</p>
            <p>{formatPrice(totalPrice)}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            Livraison et taxes calculées à la caisse.
          </p>
          <div className="mt-4">
            <Link to="checkout">
              <button
                onClick={handleCheckoutClick}
                disabled={items.length === 0}
                className="flex w-full items-center gap-4 justify-center  bg-gray-800 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-[#87a736] disabled:opacity-50"
              >
                <CreditCardIcon className="h-6 w-6 animate-pulse" />
                Passer à la caisse
              </button>
            </Link>
          </div>
          <div className="mt-4 flex font-header justify-center text-center text-sm text-gray-500">
            <p>
              ou{" "}
              <button
                type="button"
                onClick={() => dispatch(closeCart())}
                className=" text-gray-700"
              >
                Continuer vos achats
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </CustomDialog>
  );
}
