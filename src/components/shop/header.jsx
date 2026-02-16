// src/components/common/Pagination.jsx
import { useState } from "react";
import React from "react";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { ListBulletIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Product from "../product/Product";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setGridView, setListView } from "../../redux/ui/viewSlice";
import PriceRangeSlider from "./PriceRangeSlider";
import Pagination from "./Pagination";
import { useEffect } from "react";
import {
  setPriceRange,
  toggleFilter,
  toggleSection,
} from "../../redux/shopFilters/filtreSlice";
import {
  setCurrentPage,
  setProductsPerPage,
  setSortOption,
} from "../../redux/shopFilters/pageOptions";
import { useNavigate, useParams } from "react-router-dom";
import Filters from "./filters";
import { TfiFilter } from "react-icons/tfi";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const sortOptions = [
  { name: "Most Popular", href: "#", current: true },
  { name: "Best Rating", href: "#", current: false },
  { name: "Newest", href: "#", current: false },
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
];
const pageOptions = [
  { value: 12, current: true },
  { value: 24, current: false },
  { value: 36, current: false },
  { value: 48, current: false },
];

export default function Header({
  formattedCategory,
  totalProducts,
  setMobileFiltersOpen,
}) {
  const dispatch = useDispatch();

  const view = useSelector((state) => state.view.view);
  const filter = useSelector((state) => state.view.view);

  const { currentPage, productsPerPage, sortOption } = useSelector(
    (state) => state.pageOptions
  );
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.userInfo);

  return (
    <div className="block md:flex items-baseline justify-between border-b border-black/20 md:pt-10 pt-4  gap-6">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-heading tracking-[0.12em] text-[#0d1b2a] w-full md:w-1/4">
        {formattedCategory || "Shop"}{" "}
      </h1>

      {/* Settings */}
      <div className="flex flex-wrap w-full md:w-3/4 justify-between items-center gap-4">
        {/* Left: View/filter buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch(setGridView())}
            className={`px-3 py-2  cursor-pointer transition 
          ${
            view === "grid"
              ? "text-[#d4af37] "
              : "bg-white hover:bg-[#f5f5f5] text-[#0d1b2a]"
          } 
          font-body uppercase tracking-wide text-sm`}
          >
            <span className="sr-only">View grid</span>
            <Squares2X2Icon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => dispatch(setListView())}
            className={`px-3 py-2  cursor-pointer transition 
          ${
            view === "list"
              ? "bg-[#d4af37] text-black shadow-lg"
              : "bg-white hover:bg-[#f5f5f5] text-[#0d1b2a]"
          } 
          font-body uppercase tracking-wide text-sm`}
          >
            <span className="sr-only">View list</span>
            <ListBulletIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile filter button */}
        <span className="block md:inline text-sm font-editorial text-[#0d1b2a] hover:text-[#d4af37] transition-colors">
          {totalProducts} products
        </span>
        {/* Right: Sort and Products per page */}
        <div className="flex items-center gap-2">
          {/* Sort Menu */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="p-2 text-gray-400 hover:text-[#d4af37] lg:hidden transition-colors"
          >
            <div className="flex items-center text-xs font-header text-[#0d1b2a] hover:text-[#d4af37] transition-colors gap-2">
              <TfiFilter className="-mr-1  w-4 h-3 shrink-0 text-gray-400 group-hover:text-[#d4af37]" />
              Filters
            </div>
          </button>
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="group inline-flex justify-center text-xs font-header text-[#0d1b2a] hover:text-[#d4af37] transition-colors">
              Sort
              <ChevronDownIcon className="-mr-1 pb-1  w-5 h-5 shrink-0 text-gray-400 group-hover:text-[#d4af37]" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <MenuItem key={option.name}>
                    <button
                      type="button"
                      onClick={() => dispatch(setSortOption(option.name))}
                      className={`block w-full text-left px-4 py-2 text-sm font-body hover:bg-[#f5f5f5] transition ${
                        sortOption === option.name
                          ? "text-[#d4af37] font-semibold"
                          : "text-[#0d1b2a]"
                      }`}
                    >
                      {option.name}
                    </button>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>

          {/* Products per page */}
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="group inline-flex justify-center text-xs font-header text-[#0d1b2a] hover:text-[#d4af37] transition-colors">
              Affichage
              <ChevronDownIcon className="-mr-1 pb-1 w-5 h-5 shrink-0 text-gray-400 group-hover:text-[#d4af37]" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                {pageOptions.map((option) => (
                  <MenuItem key={option.value}>
                    <button
                      type="button"
                      onClick={() => dispatch(setProductsPerPage(option.value))}
                      className={`block w-full text-left px-4 py-2 text-sm font-body hover:bg-[#f5f5f5] transition ${
                        productsPerPage === option.value
                          ? "text-[#d4af37] font-semibold"
                          : "text-[#0d1b2a]"
                      }`}
                    >
                      {option.value}
                    </button>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  );
}
