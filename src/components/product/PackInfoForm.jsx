// PackInfoForm.jsx
import React, { useState, useEffect } from "react";
import { Input, Textarea } from "../ui";
import { getCategories } from "../../functions/Categories";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

export default function PackInfoForm({
  pack,
  setPack,
  options,
  setSelectedTitles,
  selectedTitles,
}) {
  const [categories, setCategories] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Input
        label="Pack Name"
        name="Title"
        type="text"
        value={pack.title}
        onChange={(e) => setPack({ ...pack, title: e.target.value })}
        placeholder="Pack Name"
        className="border w-full mb-4 p-1"
      />

      <div className="flex gap-2 ">
        <Input
          label="Price"
          type="number"
          value={pack.price}
          onChange={(e) =>
            setPack({
              ...pack,
              price: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="Price"
          className="border w-full mb-4 p-1"
        />
      </div>

      <div className="flex gap-2 "></div>

      <Textarea
        label="Description"
        value={pack.description}
        onChange={(e) => setPack({ ...pack, description: e.target.value })}
        placeholder="Description"
        className="border w-full p-2 mb-4"
      />

      {/* Category Select */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Category
      </label>
      <select
        value={pack.category || ""}
        onChange={(e) => setPack({ ...pack, category: e.target.value })}
        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm
             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none
             transition mb-4"
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <Field>
        <Label className="block text-sm font-medium text-gray-700 mb-1">
          Produits
        </Label>
        <Listbox
          value={selectedTitles}
          onChange={(values) => {
            setSelectedTitles(values);

            // Only store the _id of selected products inside pack
            const productIds = values.map((p) => p._id);

            setPack((prev) => ({
              ...prev,
              products: productIds,
            }));
          }}
          multiple
        >
          {({ open }) => (
            <div className="relative">
              <ListboxButton className="relative w-full py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span
                  className={`block truncate ${
                    selectedTitles.length === 0 ? "text-gray-400" : ""
                  }`}
                >
                  {selectedTitles.length === 0
                    ? "Please select an option"
                    : selectedTitles.map((t) => t.Title || t.name).join(", ")}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              {open && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                  <ListboxOptions className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5">
                    {options.map((title) => (
                      <ListboxOption key={title._id} value={title}>
                        {({ selected, active }) => (
                          <div
                            className={`${
                              selected && active
                                ? "bg-gray-700 text-white"
                                : selected
                                ? "bg-gray-200 text-gray-900"
                                : active
                                ? "bg-blue-600 text-white"
                                : "text-gray-900"
                            } cursor-default select-none relative py-2 pl-3 pr-9`}
                          >
                            <span
                              className={`${
                                selected ? "font-semibold" : "font-normal"
                              } block truncate`}
                            >
                              {title.Title || title.name}
                            </span>

                            {selected && (
                              <span
                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                  active ? "text-white" : "text-indigo-600"
                                }`}
                              >
                                <CheckIcon
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </div>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              )}
            </div>
          )}
        </Listbox>
      </Field>
    </>
  );
}
