import React from "react";
import { FaChevronRight } from "react-icons/fa";

export default function ServiceItem({ name, view, icon, color, setView }) {
  return (
    <div
      className="flex items-center justify-between cursor-pointer p-2 rounded-md  hover:bg-gray-200"
      onClick={() => setView(view)}
    >
      <span className={`flex items-center gap-2 ${color}`}>
        {icon}
        {name}
      </span>

      <FaChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  );
}
