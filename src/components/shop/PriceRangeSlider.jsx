// src/components/shop/PriceRangeSlider.jsx
import React from "react";
import { Range } from "react-range";

const STEP = 10;
const MIN = 0;
const MAX = 500;

export default function PriceRangeSlider({ values, setValues }) {
  return (
    <div className="py-4">
      <div className="px-2">
        <Range
          step={STEP}
          min={MIN}
          max={MAX}
          values={values}
          onChange={setValues}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 w-full rounded bg-gray-300"
              style={{
                ...props.style,
              }}
            >
              <div
                className="h-2 bg-[#d4af37] rounded"
                style={{
                  position: "absolute",
                  left: `${((values[0] - MIN) / (MAX - MIN)) * 100}%`,
                  width: `${((values[1] - values[0]) / (MAX - MIN)) * 100}%`,
                  top: 0,
                  bottom: 0,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-5 w-5 rounded-full bg-white border-2 border-[#d4af37] shadow-md cursor-pointer"
            />
          )}
        />
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-700">
        <span>Min: {values[0]} DT</span>
        <span>Max: {values[1]} DT</span>
      </div>
    </div>
  );
}
