import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import CreateCategoryCard from "../../category/CreateCategoryCard";
import CategoryCard from "../../category/CategoryCard";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/Categories";
import { LoadingProduct } from "../../ui";

export default function CategoryConfig() {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setFetching(true);
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Impossible de charger les catégories");
    } finally {
      setFetching(false);
    }
  };

  // Create category
  const handleCreate = async () => {
    if (!category.trim()) {
      toast.warning("⚠️ Nom de catégorie requis");
      return;
    }

    setLoading(true);
    try {
      await createCategory({
        name: category.trim(),
        imageFile: selectedMedia?.file || null,
      });

      toast.success("✅ Catégorie créée avec succès");

      setCategory("");
      setSelectedMedia(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("❌ Échec de création de la catégorie");
    } finally {
      setLoading(false);
    }
  };

  // Image upload
  const handleCategoryImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedMedia({
      src: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      file,
    });

    e.target.value = "";
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;

    setDeletingId(id);
    try {
      await removeCategory(id);
      toast.success("🗑️ Catégorie supprimée");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("❌ Échec de suppression");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* GLOBAL LOADING */}

      <div className="grid grid-cols-1 gap-4">
        {/* CREATE */}
        <CreateCategoryCard
          name={category}
          setName={setCategory}
          selectedMedia={selectedMedia}
          setSelectedMedia={setSelectedMedia}
          onAddMedia={handleCategoryImageUpload}
          onDeleteMedia={() => setSelectedMedia(null)}
          onSubmit={handleCreate}
          loading={loading}
        />

        {/* LIST */}
        {fetching ? (
          <LoadingProduct length={2} cols={1} />
        ) : (
          <>
            {" "}
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                onDelete={() => handleDelete(cat._id)}
                loading={deletingId === cat._id}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
