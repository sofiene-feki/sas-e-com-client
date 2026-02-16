import React, { useState, useEffect } from "react";
import { getStoreSettings, updateStoreSettings } from "../../../functions/storeSettings";
import { toast } from "react-toastify";
import { FaStore, FaUpload } from "react-icons/fa";

export default function StoreConfig() {
    const [storeName, setStoreName] = useState("");
    const [logoPreview, setLogoPreview] = useState("");
    const [logoFile, setLogoFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { data } = await getStoreSettings();
            setStoreName(data.storeName);
            if (data.logo) {
                setLogoPreview(`${import.meta.env.VITE_API_BASE_URL_MEDIA}${data.logo}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("storeName", storeName);
        if (logoFile) {
            formData.append("logo", logoFile);
        }

        try {
            await updateStoreSettings(formData);
            toast.success("Paramètres de la boutique mis à jour !");
        } catch (err) {
            toast.error("Échec de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div>
                    <label className="block text-[10px] font-ui tracking-widest uppercase text-gray-400 mb-2">
                        Nom de la Boutique
                    </label>
                    <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm"
                        placeholder="Ex: Archive Boutique"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-ui tracking-widest uppercase text-gray-400 mb-2">
                        Logo de la Boutique
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                                <FaStore className="text-gray-300 w-8 h-8" />
                            )}
                        </div>
                        <label className="flex-1">
                            <div className="px-4 py-2 border border-neutral-900 rounded-lg text-neutral-900 text-xs font-medium text-center cursor-pointer hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center gap-2">
                                <FaUpload /> Choisir un logo
                            </div>
                            <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                        </label>
                    </div>
                </div>
            </div>

            <button
                disabled={loading}
                className="w-full py-4 bg-neutral-900 text-white rounded-xl font-ui text-[10px] tracking-[0.3em] uppercase hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
                {loading ? "Chargement..." : "Sauvegarder les Changements"}
            </button>
        </form>
    );
}
