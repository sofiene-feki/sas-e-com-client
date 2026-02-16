import React, { useEffect, useRef } from "react";

import { useState } from "react";
import {
  BellIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { openCart } from "../../redux/ui/cartDrawer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { products } from "../../constants/products";
import { auth } from "../../service/firebase";
import { authLogout } from "../../redux/user/userSlice";
import { signOut } from "firebase/auth";
import userImg from "../../assets/user.jpg";
import { searchProducts } from "../../functions/product";

export default function HeaderBottom() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const SERVER_URL = "https://supersiesta-server-i63m.onrender.com";

  const normalizeMediaSrc = (input) => {
    if (!input) return input;

    // If input is an array, normalize each item
    if (Array.isArray(input)) {
      return input.map((item) => normalizeMediaSrc(item));
    }

    // If input is not an object or has no media, return as is
    if (typeof input !== "object" || !input.media) return input;

    // Normalize each media src
    const normalizedMedia = Array.isArray(input.media)
      ? input.media.map((m) => ({
          ...m,
          src: m?.src?.startsWith("http") ? m.src : SERVER_URL + m.src,
        }))
      : [];

    return { ...input, media: normalizedMedia };
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    setShowDropdown(true); // show dropdown as soon as search starts
    try {
      const { data } = await searchProducts({ query });
      const normalizedResults = normalizeMediaSrc(data.products || []);
      setResults(normalizedResults);
    } catch (err) {
      console.error(err);
      setResults([]); // clear results on error
    } finally {
      setLoading(false);
    }
  };

  // Debounce search on typing
  useEffect(() => {
    const timeout = setTimeout(() => handleSearch(), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optional: handle submit, maybe navigate to a search results page
    console.log("Search submitted:", query);
    setShowDropdown(false);
  };
  const dispatch = useDispatch();
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Firebase logout
      dispatch(authLogout()); // Clear Redux state
      navigate("/login"); // Redirect to login
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Mes commandes", href: "orders" },
    { name: "Sign out", href: "#" },
  ];

  const category = [
    { name: "tendresse", href: "#" },
    { name: "pollow", href: "#" },
    { name: "medico", href: "#" },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="bg-gray-100 sticky top-14.5 z-50 border-t border-gray-200 shadow-lg print:hidden">
      <div className="flex px-2 pt-3 justify-between hidden">
        <Menu as="div" className="relative ">
          <MenuButton>
            <div className="hidden md:flex items-center font-xs gap-1 bg-[#2c2d84] text-white px-2 py-2 rounded-md shadow-md hover:bg-[#1f2066] transition cursor-pointer">
              <ViewColumnsIcon className="w-5 h-5" />
              Nos Catégories
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </MenuButton>
          <MenuItems className="absolute left-0 mt-14 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
            {category.map((item) => (
              <MenuItem key={item.name}>
                {({ active }) => (
                  <Link
                    to={item.href}
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/favorites"
            className="p-2 text-gray-600 hover:text-[#2c2d84] transition"
          >
            <HeartIcon className="w-6 h-6" />
          </Link>
          <button
            onClick={() => dispatch(openCart())}
            className="relative p-2 text-gray-600 hover:text-[#2c2d84] transition"
          >
            <ShoppingBagIcon className="w-6 h-6" />

            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {totalQty}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="mx-auto  max-w-7xl px-2  py-2 sm:px-6 lg:px-8  flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Nos Catégories */}
        <Menu as="div" className="relative hidden md:flex">
          <MenuButton>
            <div className="flex items-center font-medium gap-2 bg-[#2c2d84] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#1f2066] transition cursor-pointer">
              <ViewColumnsIcon className="w-5 h-5" />
              Nos Catégories
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </MenuButton>
          <MenuItems className="absolute left-0 mt-14 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
            {category.map((item) => (
              <MenuItem key={item.name}>
                {({ active }) => (
                  <Link
                    to={item.href}
                    className={`block px-4 py-2 text-sm text-gray-700 ${
                      active ? "bg-gray-100" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>

        {/* Center: Search Bar */}

        <div ref={wrapperRef} className="relative w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="flex w-full">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="flex-1 px-2 py-2 text-sm border bg-white border-gray-300 rounded-l-md shadow-md focus:outline-none  placeholder-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-white bg-[#2c2d84] hover:bg-[#1f2066] rounded-r-md shadow-md transition duration-300"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              Rechercher
            </button>
          </form>

          {/* Dropdown */}
          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-64 overflow-y-auto z-50">
              {loading ? (
                // Loading Spinner
                <div className="flex justify-center items-center py-4">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-600"
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
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                </div>
              ) : results.length > 0 ? (
                results.map((product) => {
                  const imageMedia = product.media.find(
                    (m) => m.type === "image"
                  );
                  const imageSrc = imageMedia
                    ? imageMedia.src
                    : "/placeholder.png";

                  return (
                    <Link
                      to={`/product/${product.slug}`}
                      key={product._id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      <img
                        src={imageSrc}
                        alt={imageMedia?.alt || product.Title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {product.Title}
                        </span>
                        {product.Price && (
                          <span className="text-sm text-gray-500">
                            {product.Price} DT
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  Aucun résultat trouvé
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Favorites, Cart, Profile */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => dispatch(openCart())}
            className="relative p-2 text-gray-600 hover:text-[#2c2d84] transition"
          >
            <ShoppingBagIcon className="w-7 h-7" />

            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {totalQty}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <>
            {isAuthenticated && userInfo ? (
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={userImg}
                    alt="profile"
                  />
                </MenuButton>

                <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      {({ active }) =>
                        item.name === "Sign out" ? (
                          <button
                            onClick={handleSignOut}
                            className={`w-full text-left px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            to={item.href}
                            className={`block px-4 py-2 text-sm text-gray-700 ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            {item.name}
                          </Link>
                        )
                      }
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            ) : (
              <Link to="/login">
                <UserIcon className="w-8 h-8 text-gray-600" />
              </Link>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
