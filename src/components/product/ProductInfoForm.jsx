// ProductInfoForm.jsx
import React, { useState, useEffect } from "react";
import { Input, Textarea } from "../ui";
import { getCategories } from "../../functions/Categories";
import { getSubCategories } from "../../functions/sub";

export default function ProductInfoForm({ product, setProduct }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories whenever product.Category changes
  useEffect(() => {
    const fetchSubs = async () => {
      if (!product.Category) {
        setSubCategories([]);
        return;
      }
      setLoadingSubs(true);
      try {
        const { data } = await getSubCategories(product.Category);
        setSubCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des sous-catégories", error);
      } finally {
        setLoadingSubs(false);
      }
    };
    fetchSubs();
  }, [product.Category]);

  return (
    <>
      <Input
        label="Designation (Product Name)"
        name="Title"
        type="text"
        value={product.Title}
        onChange={(e) => setProduct({ ...product, Title: e.target.value })}
        placeholder="e.g. Silk Essential Shroud"
        className="font-ui text-xs tracking-wider uppercase border-neutral-100 focus:border-neutral-900 w-full mb-8 h-12"
      />

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Input
          label="Base Value (TND)"
          type="number"
          value={product.Price}
          onChange={(e) =>
            setProduct({
              ...product,
              Price: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          className="font-ui text-xs border-neutral-100 focus:border-neutral-900 h-11"
        />
        <Input
          label="Privilege Reduction (%)"
          type="number"
          value={product.promotion ?? 0}
          onChange={(e) =>
            setProduct({
              ...product,
              promotion: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
          className="font-ui text-xs border-neutral-100 focus:border-neutral-900 h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Input
          label="Current Inventory"
          type="number"
          value={product.Quantity}
          onChange={(e) =>
            setProduct({
              ...product,
              Quantity: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          className="font-ui text-xs border-neutral-100 focus:border-neutral-900 h-11"
        />
        <Input
          label="Historical Acquisitions"
          type="number"
          value={product.sold ?? 0}
          onChange={(e) =>
            setProduct({
              ...product,
              sold: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
          className="font-ui text-xs border-neutral-100 focus:border-neutral-900 h-11"
        />
      </div>

      <Textarea
        label="Narrative Description"
        value={product.Description}
        onChange={(e) =>
          setProduct({ ...product, Description: e.target.value })
        }
        placeholder="Craft the product story..."
        className="font-ui text-xs border-neutral-100 focus:border-neutral-900 w-full min-h-[160px] mb-8 p-4"
      />

      <div className="space-y-6">
        <div>
          <label className="block font-ui text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
            Primary Classification
          </label>
          <select
            value={product.Category || ""}
            onChange={(e) =>
              setProduct({ ...product, Category: e.target.value, subCategory: "" })
            }
            className="block w-full border border-neutral-100 bg-white px-4 py-3 font-ui text-[11px] tracking-widest uppercase transition focus:border-neutral-900 focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-ui text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-2">
            Ancestry (Sub-Category)
          </label>
          <select
            value={product.subCategory || ""}
            onChange={(e) =>
              setProduct({ ...product, subCategory: e.target.value })
            }
            disabled={!product.Category || loadingSubs}
            className="block w-full border border-neutral-100 bg-white px-4 py-3 font-ui text-[11px] tracking-widest uppercase transition focus:border-neutral-900 focus:outline-none disabled:bg-neutral-50 disabled:text-neutral-300"
          >
            <option value="">{loadingSubs ? "Syncing..." : "Select Sub-Category"}</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
