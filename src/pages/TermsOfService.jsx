import React from "react";

export default function TermsOfService() {
  const SITE_URL = "https://www.clindoeilstore.com";

  return (
    <>
      <section className="bg-white">
        {/* Hero */}
        <div className="relative font-heading shadow-lg text-gray-900 py-12 md:py-16">
          <div className="max-w-5xl mx-auto md:px-6 px-2">
            <h1 className="text-3xl md:text-5xl font-bold">
              Conditions Générales d’Utilisation
            </h1>
            <p className="mt-2 text-base md:text-lg leading-relaxed">
              Les présentes conditions régissent l’utilisation du site{" "}
              <strong>Clin d’Œil Store</strong> et l’ensemble de ses services.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto md:px-6 px-2 py-12 space-y-6 text-gray-800">
          <p>
            En accédant à ce site ou en passant une commande, vous acceptez sans
            réserve les présentes Conditions Générales d’Utilisation.
          </p>

          <h2 className="text-xl font-semibold">1. Objet</h2>
          <p>
            Clin d’Œil Store est une plateforme de vente en ligne spécialisée
            dans les articles de mode. Les présentes conditions définissent les
            droits et obligations entre la boutique et ses clients.
          </p>

          <h2 className="text-xl font-semibold">2. Accès au site</h2>
          <p>
            L’accès au site est libre. Toutefois, certains services nécessitent
            la fourniture d’informations exactes et complètes.
          </p>

          <h2 className="text-xl font-semibold">3. Produits</h2>
          <p>
            Les produits sont décrits avec la plus grande exactitude possible.
            Les images sont non contractuelles.
          </p>

          <h2 className="text-xl font-semibold">4. Commandes</h2>
          <p>
            Toute commande implique l’acceptation des prix et descriptions. Clin
            d’Œil Store se réserve le droit de refuser toute commande suspecte
            ou frauduleuse.
          </p>

          <h2 className="text-xl font-semibold">5. Responsabilité</h2>
          <p>
            Clin d’Œil Store ne saurait être tenu responsable des retards ou
            dommages liés à des événements indépendants de sa volonté.
          </p>

          <h2 className="text-xl font-semibold">6. Droit applicable</h2>
          <p>Les présentes conditions sont régies par le droit tunisien.</p>
        </div>
      </section>
    </>
  );
}
