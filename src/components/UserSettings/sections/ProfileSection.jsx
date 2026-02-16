import React from "react";
import { Disclosure } from "@headlessui/react";
import { FaUserCircle, FaEdit, FaLock } from "react-icons/fa";
import ChevronIcon from "../ChevronIcon";

export default function ProfileSection() {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <span className="flex items-center gap-2 font-medium">
              <FaUserCircle className="text-blue-500" /> Profil Utilisateur
            </span>
            <ChevronIcon open={open} />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-3 space-y-2">
            <button className="flex items-center text-gray-600 gap-2  w-full cursor-pointer p-2 rounded-md  hover:bg-gray-100">
              <FaEdit /> Modifier le Profil
            </button>
            <button className="flex items-center gap-2 text-gray-600 w-full cursor-pointer p-2 rounded-md  hover:bg-gray-100">
              <FaLock /> Changer le Mot de Passe
            </button>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
