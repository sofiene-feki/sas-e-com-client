import React, { useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cart/cartSlice";
import { createOrder } from "../functions/order";
import flag from "../assets/flag.png";
import governorate from "../assets/governorate.png";
import { GrMapLocation } from "react-icons/gr";
import { PiUserLight } from "react-icons/pi";
import { PiMapPinLineThin } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";
import { useFacebookPixel } from "../hooks/useFacebookPixel";
import { sendServerEvent } from "../functions/fbCapi";

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trackPurchase } = useFacebookPixel();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    gouvernorat: "",
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 3,
    }).format(price);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);

    const orderData = {
      customer: formData,
      items: cartItems,
      subtotal,
      shipping,
      paymentMethod,
      total,
    };

    try {
      // 1️⃣ Send order to your server
      const response = await createOrder(orderData);
      console.log("✅ Order placed successfully:", response);

      // 2️⃣ Client-side Pixel
      trackPurchase(cartItems, total);

      // 3️⃣ Server-side CAPI
      await sendServerEvent({
        eventName: "Purchase",
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          gouvernorat: formData.gouvernorat,
          email: formData.email, // optional
        },
        products: cartItems.map((item) => ({
          _id: item.productId,
          quantity: item.quantity,
          price: item.price,
          category: item.category || "Unknown",
        })),
        total,
      });

      // 4️⃣ Open success dialog
      setIsOpen(true);

      // 5️⃣ Optionally clear cart and form
      dispatch(clearCart());
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        gouvernorat: "",
      });
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Welcome Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all">
                  <Dialog.Title className="text-2xl font-header text-gray-800">
                    😊 Bienvenue {formData.fullName}
                  </Dialog.Title>
                  <p className="mt-4 font-header text-gray-600">
                    Merci pour votre commande. Nous vous confirmerons votre
                    commande par téléphone sous peu.
                  </p>
                  <button
                    className="mt-6 px-6 py-2 bg-gray-800 text-white  hover:bg-[#769030] transition"
                    onClick={() => {
                      // Clear the cart
                      dispatch(clearCart());
                      // Close the dialog
                      setIsOpen(false);
                      // Navigate to home page
                      navigate("/");
                    }}
                  >
                    Fermer
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Checkout Layout */}
      <div className="max-w-7xl md:my-15  mx-auto p-2 md:p-6  grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ORDER FORM */}
        <div className="md:col-span-1 bg-white shadow-md border border-gray-100 p-2 md:p-6 rounded-lg">
          <h2 className="text-2xl font-heading mb-4">
            Informations de livraison
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-heading font-medium text-gray-700 mb-1">
                Nom et Prénom
              </label>
              <div className="relative">
                <PiUserLight className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Ex : Mohamed Ali"
                  className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Phone with Tunisia flag */}
            <div>
              <label className="block font-heading text-sm font-medium text-gray-700 mb-1">
                Numéro de Téléphone
              </label>
              <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md overflow-hidden">
                <span className="flex items-center gap-1 h-full px-2 text-sm text-gray-700">
                  <img
                    src={flag}
                    alt="TN"
                    className="w-auto h-5 object-cover rounded-sm"
                  />
                  +216
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="20 123 456"
                  className="w-full border-0 bg-white focus:ring-0 p-2 ml-4 sm:text-sm"
                />
              </div>
            </div>
            {/* Address & Gouvernorat */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Adresse */}
              <div className="flex-1">
                <label className="block font-heading text-sm font-medium text-gray-700 mb-1">
                  Adresse de livraison
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                    <PiMapPinLineThin className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Ex : Rue Habib Bourguiba, Beb bhar"
                    className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Gouvernorat */}
              <div className="w-full md:w-1/3">
                <label className="block font-heading text-sm font-medium text-gray-700 mb-1">
                  Gouvernorat
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <img
                      src={governorate}
                      alt="Tunisia Map"
                      className="w-auto h-7"
                    />
                  </span>
                  <select
                    name="gouvernorat"
                    value={formData.gouvernorat}
                    onChange={handleChange}
                    required
                    className="w-full font-heading rounded-md border border-gray-300 pl-10 pr-3 py-2 bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer appearance-none"
                  >
                    <option value="" disabled hidden>
                      Choisissez votre gouvernorat
                    </option>
                    <option value="Tunis">Tunis</option>
                    <option value="Ariana">Ariana</option>
                    <option value="Ben Arous">Ben Arous</option>
                    <option value="Manouba">Manouba</option>
                    <option value="Nabeul">Nabeul</option>
                    <option value="Zaghouan">Zaghouan</option>
                    <option value="Bizerte">Bizerte</option>
                    <option value="Béja">Béja</option>
                    <option value="Jendouba">Jendouba</option>
                    <option value="Kef">Kef</option>
                    <option value="Siliana">Siliana</option>
                    <option value="Sousse">Sousse</option>
                    <option value="Monastir">Monastir</option>
                    <option value="Mahdia">Mahdia</option>
                    <option value="Sfax">Sfax</option>
                    <option value="Kairouan">Kairouan</option>
                    <option value="Kasserine">Kasserine</option>
                    <option value="Sidi Bouzid">Sidi Bouzid</option>
                    <option value="Gabès">Gabès</option>
                    <option value="Médenine">Médenine</option>
                    <option value="Tataouine">Tataouine</option>
                    <option value="Gafsa">Gafsa</option>
                    <option value="Tozeur">Tozeur</option>
                    <option value="Kebili">Kebili</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Payment */}
            <div>
              <h3 className="text-md font-heading font-medium text-gray-900 mb-3">
                Mode de paiement
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="flex font-heading items-center space-x-2">
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Paiement à la livraison</span>
                  </span>
                </label>
              </div>
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 py-3  font-semibold transition shadow-md
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed text-white"
        : "bg-gray-800 hover:bg-gray-900 text-white"
    }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8h4z"
                    ></path>
                  </svg>
                  Traitement en cours...
                </span>
              ) : (
                <span className="flex font-heading items-center gap-2">
                  <FaCheckCircle className="w-5 h-5" />
                  Confirmer la commande
                </span>
              )}
            </button>
            {/* Trust message */}
            <p className="text-xs font-heading text-gray-500 text-center mt-1">
              Paiement sécurisé à la livraison
            </p>
          </form>
        </div>

        {/* CART SUMMARY */}
        <div className="md:col-span-1 font-heading bg-white shadow-lg md:p-6 p-2 rounded-xl border border-gray-100">
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
            Résumé de la commande
          </h2>

          {/* Empty cart */}
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm">Votre panier est vide.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                className="border-b border-gray-100 py-4 last:border-0"
              >
                <div className="flex gap-4">
                  {/* Product image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border border-gray-200"
                  />

                  {/* Product details */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">
                      {item.name}{" "}
                      <span className="text-gray-500">× {item.quantity}</span>
                    </p>

                    {/* Options */}
                    {item.selectedColor && (
                      <p className="text-xs md:text-sm text-gray-500">
                        Couleur: {item.selectedColor}
                      </p>
                    )}
                    {item.selectedSize && (
                      <p className="text-xs md:text-sm text-gray-500">
                        Taille: {item.selectedSize}
                      </p>
                    )}

                    {/* Pack details */}
                    {item.type === "pack" && (
                      <div className="mt-2 space-y-1">
                        {item.products?.map((prod, index) => (
                          <div
                            key={index}
                            className="flex flex-wrap items-center gap-2 text-xs text-gray-600"
                          >
                            <span className="font-medium text-gray-700">
                              {prod.name || "Produit"} :
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

                    {/* Price */}
                    <p className="text-sm md:text-base font-semibold text-gray-900 mt-2">
                      {item.price} DT
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Summary */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="space-y-2 text-sm md:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="text-gray-800">{subtotal} DT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Livraison {shipping === 0 && "(gratuit)"}
                </span>
                <span className="text-gray-800">{shipping} DT</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 text-base md:text-lg font-bold text-gray-900">
                <span>Total</span>
                <span> {formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
