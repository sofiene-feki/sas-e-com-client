import React from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  ...props
}) {
  return (
    <div className="w-full mb-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none
                   transition ${className}`}
        {...props}
      />
    </div>
  );
}
