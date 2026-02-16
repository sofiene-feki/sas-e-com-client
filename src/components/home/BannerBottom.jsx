import {
  CheckBadgeIcon,
  ClockIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import React from "react";

export default function BannerBottom() {
  return (
    <div className="w-full py-4 md:py-4">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 px-4">
        {/* Large Choix Section */}
        <div className="bg-white p-2 md:p-4 rounded-lg shadow-lg flex items-center gap-4">
          <div className="text-4xl text-[#87a736]">
            <CheckBadgeIcon className="block md:h-12 md:w-12 h-8 w-8" />
          </div>
          <div>
            <h3 className="text-md md:text-xl font-semibold text-gray-800">
              Qualité Premium
            </h3>
            <p className="text-sm text-gray-600">
              Matelas numéro 1 en Tunisie 🇹🇳{" "}
            </p>
          </div>
        </div>
        {/* Support Section */}
        <div className="bg-white p-2 md:p-4 rounded-lg shadow-lg flex items-center gap-4">
          <div className="text-4xl text-[#87a736]">
            <ClockIcon className="block md:h-12 md:w-12 h-8 w-8" />
          </div>
          <div>
            <h3 className="text-md md:text-xl font-semibold text-gray-800">
              Service Client
            </h3>
            <p className="text-sm text-gray-600">Support 7 jours/7</p>
          </div>
        </div>

        {/* Livraison Section */}
        <div className="bg-white p-2 md:p-4 rounded-lg shadow-lg flex items-center gap-4">
          <div className="text-4xl text-[#87a736]">
            <TruckIcon className="block md:h-12 md:w-12 h-8 w-8" />
          </div>
          <div>
            <h3 className="text-md md:text-xl font-semibold text-gray-800">
              Livraison Gratuite
            </h3>
            <p className="text-sm text-gray-600">
              Livraison Gratuite, Partout en Tunisie
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
