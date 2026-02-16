import React, { useState, useEffect } from "react";
import { getStoreSettings, updateStoreSettings } from "../../../functions/storeSettings";
import { toast } from "react-toastify";
import { FaGoogle, FaSave } from "react-icons/fa";

export default function GoogleConfig() {
  const [googleSearchConsoleCode, setGoogleSearchConsoleCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await getStoreSettings();
      setGoogleSearchConsoleCode(data.googleSearchConsoleCode || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStoreSettings({ googleSearchConsoleCode });
      toast.success("Paramètres Google Search Console mis à jour !");
    } catch (err) {
      toast.error("Échec de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-ui tracking-widest uppercase text-gray-400 mb-2">
            Code de Vérification Google
          </label>
          <input
            type="text"
            value={googleSearchConsoleCode}
            onChange={(e) => setGoogleSearchConsoleCode(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-neutral-900 transition-all font-ui text-sm"
            placeholder="google-site-verification=..."
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full py-4 bg-neutral-900 text-white rounded-xl font-ui text-[10px] tracking-[0.3em] uppercase hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <FaSave /> {loading ? "Sauvegarde..." : "Sauvegarder les Paramètres"}
      </button>

      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-4">
        <FaGoogle className="text-green-600 w-10 h-10 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-green-900 mb-1">Indexation</h4>
          <p className="text-[10px] text-green-800 leading-relaxed">
            La Search Console vous permet de mesurer le trafic de recherche de votre site, d’en analyser les performances et de résoudre les problèmes.
          </p>
        </div>
      </div>
    </form>
  );
}
