import React from "react";
import { Disclosure } from "@headlessui/react";
import { FaBoxOpen, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ChevronIcon from "../ChevronIcon";

export default function OrdersSection({ setUserMenuOpen }) {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <span className="flex items-center gap-2 font-medium">
              <FaBoxOpen className="text-blue-500" /> Mes Commandes
            </span>
            <ChevronIcon open={open} />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-3">
            <Link
              to="/orders"
              className="flex justify-between items-center gap-2 text-gray-600 w-full cursor-pointer p-2 rounded-md  hover:bg-gray-100"
              onClick={() => setUserMenuOpen(false)}
            >
              <span className="flex gap-2">
                {" "}
                <FaBoxOpen className="mt-1" /> Suivi des commandes
              </span>

              <FaChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
