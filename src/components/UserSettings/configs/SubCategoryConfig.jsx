import React, { useState, useEffect } from "react";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
} from "../../../functions/sub";
import { getCategories } from "../../../functions/Categories";

export default function SubCategoryConfig() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch subcategories when selectedCategory changes

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories", error);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    } else {
      setSubCategories([]); // Clear if no category selected
    }
  }, [selectedCategory]);

  const fetchSubCategories = async (categoryId) => {
    try {
      const { data } = await getSubCategories(categoryId);
      setSubCategories(data);
    } catch (error) {
      console.error("Erreur lors du chargement des sous-catégories", error);
    }
  };
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory || newSubCategory.trim() === "")
      return alert("Veuillez remplir tous les champs");

    setLoading(true);
    try {
      await createSubCategory(newSubCategory, selectedCategory);
      setNewSubCategory(""); // reset input
      await fetchSubCategories(selectedCategory); // refresh only related subs
    } catch (error) {
      console.error("Erreur lors de la création de la sous-catégorie", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    if (
      !window.confirm("Voulez-vous vraiment supprimer cette sous-catégorie ?")
    )
      return;
    try {
      await deleteSubCategory(id);
      await fetchSubCategories(selectedCategory);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la sous-catégorie",
        error
      );
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h2 className="text-lg font-bold">Gestion des Sous-Catégories</h2>

      <form onSubmit={handleAddSubCategory} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sélectionnez une Catégorie
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          >
            <option value="">-- Choisir une catégorie --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nouvelle Sous-Catégorie
          </label>
          <input
            type="text"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            placeholder="Entrez une sous-catégorie"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Ajout..." : "Ajouter Sous-Catégorie"}
        </button>
      </form>

      <div className="mt-4">
        <h3 className="font-semibold">Liste des Sous-Catégories</h3>
        {selectedCategory ? (
          subCategories.length > 0 ? (
            <ul className="space-y-2 mt-2">
              {subCategories.map((sub) => (
                <li
                  key={sub._id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  {sub.name}
                  <button
                    onClick={() => handleDeleteSubCategory(sub._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">Aucune sous-catégorie trouvée.</p>
          )
        ) : (
          <p className="text-gray-400 mt-2">
            Sélectionnez une catégorie pour voir ses sous-catégories.
          </p>
        )}
      </div>
    </div>
  );
}
