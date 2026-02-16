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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../../functions/Categories";
import { getProductFilters } from "../../functions/product";

export default function Filters({ mobileFiltersOpen, setMobileFiltersOpen }) {
  const { selected, openSections } = useSelector((state) => state.filters);
  const priceRange = useSelector((state) => state.filters.selected.priceRange);

  const dispatch = useDispatch();

  // Dynamic filter options
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Categories
        const { data: catData } = await getCategories();
        // console.log("Fetched categories for filters:", catData);
        setCategories(
          catData.map((c) => ({ value: c._id, label: c.name, slug: c.slug })),
        );

        // Colors & Sizes
        const { colors: colorsData, sizes: sizesData } =
          await getProductFilters();

        // Remove duplicates and trim
        const cleanArray = (arr) =>
          [...new Set(arr.map((v) => v.trim()))].filter(Boolean);

        setColors(cleanArray(colorsData).map((c) => ({ value: c, label: c })));
        setSizes(cleanArray(sizesData).map((s) => ({ value: s, label: s })));
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    };

    fetchFilters();
  }, []);

  // Combine all filters for mapping
  const filters = [
    { id: "category", name: "Category", options: categories },
    { id: "color", name: "Color", options: colors },
    { id: "size", name: "Size", options: sizes },
  ];

  const location = useLocation();
  const isCategoryPage = location.pathname.startsWith("/category"); // adjust to your category route

  return (
    <>
      <Dialog
        open={mobileFiltersOpen}
        onClose={setMobileFiltersOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
          >
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Filters */}
            <form className="mt-4 border-t border-gray-200">
              {filters.map((section) => (
                <Disclosure
                  key={section.id}
                  as="div"
                  className="border-t border-gray-200 px-4 py-6"
                >
                  <h3 className="-mx-2 -my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">
                        {section.name}
                      </span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon
                          aria-hidden="true"
                          className="size-5 group-data-open:hidden"
                        />
                        <MinusIcon
                          aria-hidden="true"
                          className="size-5 group-not-data-open:hidden"
                        />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel className="pt-6">
                    <div className="space-y-6">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex gap-3">
                          <div className="flex h-5 shrink-0 items-center">
                            <div className="group grid size-4 grid-cols-1">
                              <input
                                defaultValue={option.value}
                                id={`filter-mobile-${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                type="checkbox"
                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                              />
                              <svg
                                fill="none"
                                viewBox="0 0 14 14"
                                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                              >
                                <path
                                  d="M3 8L6 11L11 3.5"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="opacity-0 group-has-checked:opacity-100"
                                />
                                <path
                                  d="M3 7H11"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="opacity-0 group-has-indeterminate:opacity-100"
                                />
                              </svg>
                            </div>
                          </div>
                          <label
                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                            className="min-w-0 flex-1 text-gray-500"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))}
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      <form className="hidden space-y-2 lg:block">
        <Disclosure
          as="div"
          className="border border-gray-100 bg-gray-100 shadow-md py-6 px-4"
          defaultOpen={openSections.includes("priceRange")}
        >
          <h3 className="-my-3 flow-root">
            <Disclosure.Button className="group flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-bold text-xl text-gray-900">Prix</span>
              <span className="ml-6 flex items-center">
                <PlusIcon
                  aria-hidden="true"
                  className="size-5 group-data-open:hidden"
                />
                <MinusIcon
                  aria-hidden="true"
                  className="size-5 group-not-data-open:hidden"
                />
              </span>
            </Disclosure.Button>
          </h3>
          <DisclosurePanel className="pt-6">
            <PriceRangeSlider
              values={priceRange}
              setValues={(newValues) => dispatch(setPriceRange(newValues))}
            />
          </DisclosurePanel>
        </Disclosure>

        {filters.map((section) => (
          <Disclosure
            key={section.id}
            as="div"
            defaultOpen={openSections.includes(section.id)} // initial open controlled here
            className="border border-gray-100 bg-gray-100 shadow-md py-6 px-4"
          >
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">
                    {section.name}
                  </span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel className="pt-4">
                  <div className="space-y-3">
                    {section.options.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          type="checkbox"
                          checked={
                            selected[section.id]?.includes(
                              option.slug || option.label,
                            ) || false
                          }
                          onChange={() =>
                            dispatch(
                              toggleFilter({
                                sectionId: section.id,
                                value: option.slug || option.label,
                              }),
                            )
                          }
                          className="h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </form>
    </>
  );
}
