import React from "react";
import { FaStore, FaPlus, FaImage, FaVideo, FaTags } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function StoreSetupGuide() {
    const navigate = useNavigate();

    const steps = [
        {
            title: "Identité de la Boutique",
            description: "Commencez par donner un nom et un logo à votre boutique dans les paramètres.",
            icon: <FaStore className="text-blue-500" />,
            action: () => toast.info("Ouvrez le menu utilisateur > Identité de la boutique"),
        },
        {
            title: "Ajouter vos Premières Catégories",
            description: "Organisez votre archive par collections (ex: Robes, Accessoires).",
            icon: <FaTags className="text-green-500" />,
            action: () => toast.info("Ouvrez le menu utilisateur > Ajouter une Catégorie"),
        },
        {
            title: "Créer un Produit",
            description: "Mettez en ligne votre première pièce avec ses variantes de taille et couleur.",
            icon: <FaPlus className="text-yellow-500" />,
            action: () => navigate("/product/new", { state: { mode: "create" } }),
        },
        {
            title: "Bannière & Visuels",
            description: "Ajoutez une bannière narrative pour captiver vos visiteurs dès l'entrée.",
            icon: <FaImage className="text-purple-500" />,
            action: () => toast.info("Configurez vos bannières dans le panneau d'administration."),
        },
    ];

    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl font-editorial tracking-tight text-neutral-900">
                    Bienvenue dans votre Archive Numérique
                </h2>
                <p className="text-neutral-500 font-ui text-sm tracking-widest uppercase">
                    Guide de configuration initiale
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        onClick={step.action}
                        className="group p-8 border border-neutral-100 bg-white hover:border-neutral-900 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl rounded-2xl"
                    >
                        <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            {step.icon}
                        </div>
                        <h3 className="text-lg font-ui font-medium text-neutral-900 mb-2">{step.title}</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed font-ui">{step.description}</p>
                        <div className="mt-6 flex items-center gap-2 text-[10px] font-ui tracking-[0.2em] uppercase text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity">
                            Commencer <span className="text-lg">→</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
