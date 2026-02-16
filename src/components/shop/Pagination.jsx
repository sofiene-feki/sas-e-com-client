// src/components/common/Pagination.jsx
import React from "react";
import ReactPaginate from "react-paginate";

export default function Pagination({ pageCount, currentPage, onPageChange }) {
  return (
    <ReactPaginate
      forcePage={currentPage}
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      onPageChange={({ selected }) => onPageChange(selected)}
      containerClassName="flex justify-center mt-8 gap-2 select-none"
      pageClassName="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
      pageLinkClassName="block w-full h-full" // makes entire area clickable
      activeClassName="bg-[#2c2d84] text-white border-[#2c2d84]"
      previousClassName="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
      nextClassName="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
      disabledClassName="opacity-50 cursor-not-allowed"
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      breakClassName="px-3 py-1 text-gray-500 cursor-default"
    />
  );
}
