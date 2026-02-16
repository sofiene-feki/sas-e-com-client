import React from "react";
import { Input } from "../ui";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ProductSizesEditor({
  product,
  setProduct,
  handleChangeProduct,
}) {
  const handleRemoveSize = (i) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, idx) => idx !== i),
    }));
  };

  const handleAddSize = () => {
    setProduct((prev) => ({
      ...prev,
      sizes: [...(prev.sizes || []), { name: "", price: "" }],
    }));
  };

  return (
    <div className="space-y-4">
      {product.sizes?.map((s, i) => (
        <div key={i} className="flex items-center gap-4 bg-white p-3 border border-neutral-100 transition-all hover:border-neutral-200">
          <Input
            type="text"
            value={s.name}
            onChange={(e) => handleChangeProduct(e, i, "name", "sizes")}
            placeholder="Silhouette (e.g. S, M, Regular)"
            className="flex-1 font-ui text-[10px] tracking-widest uppercase border-neutral-100 focus:border-neutral-900"
          />
          <Input
            type="number"
            value={s.price ?? ""}
            onChange={(e) => handleChangeProduct(e, i, "price", "sizes")}
            placeholder="Value"
            className="w-24 font-ui text-[10px] tracking-widest border-neutral-100 focus:border-neutral-900"
          />
          <Input
            type="number"
            value={s.quantity ?? ""}
            onChange={(e) => handleChangeProduct(e, i, "quantity", "sizes")}
            placeholder="Stock"
            className="w-20 font-ui text-[10px] tracking-widest border-neutral-100 focus:border-neutral-900"
          />
          <button
            onClick={() => handleRemoveSize(i)}
            className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        onClick={handleAddSize}
        className="w-full py-4 border border-dashed border-neutral-200 font-ui text-[10px] tracking-[0.3em] uppercase text-neutral-400 hover:border-neutral-900 hover:text-neutral-900 transition-all"
      >
        + Add Size Variation
      </button>
    </div>
  );
}
