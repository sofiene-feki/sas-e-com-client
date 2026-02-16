import React from "react";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  const SITE_URL = "https://www.clindoeilstore.com";

  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité – Clin d’Oeil Store</title>
        <meta
          name="description"
          content="Clin d’Oeil Store s'engage à protéger vos données personnelles et respecter votre vie privée."
        />
        <link
          rel="canonical"
          href="https://www.clindoeilstore.com/privacy-policy"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Politique de Confidentialité – Clin d’Oeil Store"
        />
        <meta
          property="og:description"
          content="Clin d’Oeil Store s'engage à protéger vos données personnelles et respecter votre vie privée."
        />
        <meta
          property="og:url"
          content="https://www.clindoeilstore.com/privacy-policy"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <section className="bg-white">
        {/* Hero */}
        <div className="relative font-heading shadow-lg text-gray-900 py-12 md:py-16">
          <div className="max-w-5xl mx-auto md:px-6 px-2">
            <h1 className="text-3xl md:text-5xl font-bold">
              Politique de Confidentialité
            </h1>
            <p className="mt-2 text-base md:text-lg leading-relaxed">
              La protection de vos données personnelles est une priorité pour{" "}
              <strong>Clin d’Œil Store</strong>.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto md:px-6 px-2 py-12 space-y-6 text-gray-800">
          <h2 className="text-xl font-semibold">1. Données collectées</h2>
          <p>
            Nous collectons uniquement les données nécessaires au traitement des
            commandes : nom, téléphone, adresse, informations de commande et
            données techniques.
          </p>

          <h2 className="text-xl font-semibold">2. Utilisation des données</h2>
          <p>
            Les données sont utilisées pour le traitement des commandes, la
            livraison, le service client et l’amélioration de l’expérience
            utilisateur.
          </p>

          <h2 className="text-xl font-semibold">3. Partage des données</h2>
          <p>
            Certaines informations peuvent être partagées avec les sociétés de
            livraison et prestataires techniques, uniquement dans le cadre du
            service.
          </p>

          <h2 className="text-xl font-semibold">4. Sécurité</h2>
          <p>
            Des mesures techniques et organisationnelles sont mises en place
            afin de protéger vos données contre tout accès non autorisé.
          </p>

          <h2 className="text-xl font-semibold">5. Droits du client</h2>
          <p>
            Vous disposez d’un droit d’accès, de rectification et de suppression
            de vos données personnelles sur simple demande.
          </p>

          <h2 className="text-xl font-semibold">6. Cookies</h2>
          <p>
            Le site peut utiliser des cookies afin d’améliorer la navigation et
            l’expérience utilisateur.
          </p>
        </div>
      </section>
    </>
  );
}
