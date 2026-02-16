import React from "react";
import { Helmet } from "react-helmet-async";

export default function ReturnsRefunds() {
  return (
    <>
      <Helmet>
        <title>Livraison, Retours & Échanges – Clin d’Oeil Store</title>
        <meta
          name="description"
          content="Toutes les informations sur la livraison, les retours et échanges chez Clin d’Oeil Store."
        />
        <link
          rel="canonical"
          href="https://www.clindoeilstore.com/returns-refunds"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Livraison, Retours & Échanges – Clin d’Oeil Store"
        />
        <meta
          property="og:description"
          content="Toutes les informations sur la livraison, les retours et échanges chez Clin d’Oeil Store."
        />
        <meta
          property="og:url"
          content="https://www.clindoeilstore.com/returns-refunds"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="bg-white">
        {/* Hero */}
        <div className="relative font-heading shadow-lg text-gray-900 py-12 md:py-16">
          <div className="max-w-5xl mx-auto md:px-6 px-2">
            <h1 className="text-3xl md:text-5xl font-bold">
              Livraison, Retours & Échanges
            </h1>
            <p className="mt-2 text-base md:text-lg leading-relaxed">
              Retrouvez ici toutes les informations concernant la livraison et
              les retours chez <strong>Clin d’Œil Store</strong>.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto md:px-6 px-2 py-12 space-y-6 text-gray-800">
          <h2 className="text-xl font-semibold">Livraison</h2>
          <p>
            Les commandes sont livrées sous un délai estimé de{" "}
            <strong>2 à 4 jours ouvrables</strong> après confirmation.
          </p>

          <h2 className="text-xl font-semibold">Échanges</h2>
          <p>
            Les échanges sont acceptés dans un délai de{" "}
            <strong>14 jours</strong> après réception dans les cas suivants :
          </p>
          <ul className="list-disc pl-6">
            <li>Produit non conforme</li>
            <li>Problème de taille</li>
            <li>Article endommagé ou manquant</li>
            <li>Le produit ne vous convient pas</li>
          </ul>

          <p>
            Les articles doivent être non portés, non utilisés, avec étiquettes
            et emballage d’origine.
          </p>

          <h2 className="text-xl font-semibold">Frais</h2>
          <p>
            Les frais de livraison pour un échange sont à la charge du client (
            <strong>8 DT</strong>), sauf en cas d’erreur de notre part.
          </p>

          <h2 className="text-xl font-semibold">❌ Retours refusés</h2>
          <p>
            Les retours peuvent être refusés si les conditions ne sont pas
            respectées ou si le délai est dépassé.
          </p>
        </div>
      </section>
    </>
  );
}
