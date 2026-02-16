import React from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function Contact() {
  const SITE_URL = "https://www.clindoeilstore.com";

  return (
    <>
      <section className="bg-white">
        {/* Hero Section */}
        <div className="relative font-heading shadow-lg text-gray-900 py-12 md:py-16">
          <div className="max-w-7xl mx-auto md:px-6 px-2">
            <h1 className="text-3xl md:text-5xl font-bold">
              Contactez{" "}
              <span className="text-[#D4AF37]">Clin d’Oeil Store</span>
            </h1>

            <p className="mt-2 text-base md:text-lg text-gray-900 leading-relaxed">
              Une question sur nos{" "}
              <strong>vêtements et collections mode</strong> ? Besoin
              d’informations avant de passer commande ? L’équipe{" "}
              <strong>Clin d’Oeil Store</strong> est à votre écoute pour vous
              accompagner et répondre à toutes vos demandes, en Tunisie comme à
              l’international.
            </p>
          </div>
        </div>

        {/* Form + Map */}
        <div className="max-w-7xl mx-auto md:px-6 px-2 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <form className="p-2 md:p-8 rounded-xl shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                placeholder="Votre nom"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2c2d84] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2c2d84] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                placeholder="Votre message..."
                rows="4"
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#2c2d84] focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-black shadow-xl transition"
            >
              Envoyer le message
            </button>
          </form>

          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              title="Clin d’Oeil Store – Localisation"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.743261146351!2d10.170269575550542!3d36.84862436496882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34a7ca2dbef3%3A0xb3e26dc95a6b019e!2sClin%20d&#39;%C5%93il%20Store!5e0!3m2!1sfr!2stn!4v1768497038461!5m2!1sfr!2stn"
              className="w-full h-full min-h-[400px] border-0"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
