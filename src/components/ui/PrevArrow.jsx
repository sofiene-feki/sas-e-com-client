import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute shadow-2xl top-1/2 -left-10 -translate-y-1/2 z-10 
           bg-white h-30 w-10 border-l border-t border-b border-gray-200 shadow-lg 
         hover:text-[#87a736] transition flex items-center justify-center"
    >
      <ChevronLeftIcon className="w-6 h-6" />
    </button>
  );
}
