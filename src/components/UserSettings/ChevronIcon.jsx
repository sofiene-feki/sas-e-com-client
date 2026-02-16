import React from "react";

export default function ChevronIcon({ open }) {
  return (
    <svg
      className={`${open ? "rotate-180 transform" : ""} w-5 h-5 text-gray-500`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
