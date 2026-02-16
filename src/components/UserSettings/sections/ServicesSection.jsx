import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import ChevronIcon from "../ChevronIcon";
import ServiceItem from "../ServiceItem";

export default function ServicesSection({ setView }) {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <span className="flex items-center gap-2 font-medium">
              <ChartBarIcon className="w-5 h-5 text-green-500" /> Services
              Connectés
            </span>
            <ChevronIcon open={open} />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-3 space-y-3">
            <ServiceItem
              name="Facebook Pixel"
              view="pixel"
              icon={<FaFacebook />}
              color="text-gray-600"
              setView={setView}
            />
            <ServiceItem
              name="Google Search Console"
              view="google"
              icon={<FaGoogle />}
              color="text-gray-600"
              setView={setView}
            />
            <ServiceItem
              name="Google Analytics"
              view="analytics"
              icon={<FaGoogle />}
              color="text-gray-600"
              setView={setView}
            />
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
