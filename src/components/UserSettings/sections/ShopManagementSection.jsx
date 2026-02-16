import React from "react";
import { Disclosure } from "@headlessui/react";
import { FaStore, FaPlus, FaChevronRight } from "react-icons/fa";
import ChevronIcon from "../ChevronIcon";
import ServiceItem from "../ServiceItem";
import { Link } from "react-router-dom";

export default function ShopManagementSection({
  setView,
  handleCreateProduct,
  handleCreatePack,
}) {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <span className="flex items-center gap-2 font-medium">
              <FaStore className="text-yellow-500" /> Gestion de la Boutique
            </span>
            <ChevronIcon open={open} />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-3 space-y-2">
            <p
              className="flex items-center justify-between gap-2 text-gray-600 w-full cursor-pointer p-2 rounded-md  hover:bg-gray-100"
              onClick={handleCreateProduct}
            >
              <span className="flex gap-2">
                {" "}
                <FaPlus className="mt-1" /> Ajouter un Produit{" "}
              </span>
              <FaChevronRight className="w-5 h-5 text-gray-400" />
            </p>

            <ServiceItem
              name="Ajouter une Catégorie"
              view="category"
              icon={<FaPlus />}
              color="text-gray-600"
              setView={setView}
            />
            <ServiceItem
              name="Ajouter une Sous-Catégorie"
              view="sub_category"
              icon={<FaPlus />}
              color="text-gray-600"
              setView={setView}
            />
            <ServiceItem
              name="Identité de la Boutique"
              view="store"
              icon={<FaStore />}
              color="text-gray-600"
              setView={setView}
            />
            <p
              className="flex items-center justify-between gap-2 text-gray-600 w-full cursor-pointer p-2 rounded-md  hover:bg-gray-100"
              onClick={handleCreatePack}
            >
              <span className="flex gap-2">
                {" "}
                <FaPlus className="mt-1" /> Ajouter un Pack{" "}
              </span>
              <FaChevronRight className="w-5 h-5 text-gray-400" />
            </p>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
