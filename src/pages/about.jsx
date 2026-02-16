import React from "react";
import {
  StarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import about from "../assets/about.jpg";

export default function About() {
  const SITE_URL = "https://www.clindoeilstore.com";

  return (
    <>
      <section className="bg-white">
        {/* Hero Section */}
        <div className="relative font-heading shadow-lg text-gray-900">
          <div className="max-w-7xl mx-auto px-2 md:px-6 py-12 md:py-16 flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                À propos de{" "}
                <span className="text-[#D4AF37]">Clin d’Oeil Store</span>
              </h1>

              <p className="mt-6 text-base md:text-lg leading-relaxed">
                <strong>Clin d’Oeil Store</strong> est une boutique de vêtements
                et de mode basée en <strong>Tunisie El Manzah5</strong>, dédiée
                aux amateurs de style moderne et élégant. Nous proposons une
                sélection soignée de pièces tendance alliant confort, qualité et
                modernité.
              </p>

              <p className="mt-4 text-base md:text-lg leading-relaxed">
                Inspirées des dernières tendances du prêt-à-porter, nos
                collections sont pensées pour accompagner votre quotidien avec
                des looks actuels et intemporels, adaptés à toutes les
                occasions.
              </p>

              <p className="mt-4 text-base md:text-lg leading-relaxed">
                Chez <strong>Clin d’Oeil Store</strong>, notre priorité est
                d’offrir des vêtements de qualité à un excellent rapport
                qualité-prix, avec une expérience d’achat simple et agréable en
                Tunisie comme à l’international.
              </p>
            </div>

            <div className="flex-1">
              <img
                src={about}
                alt="Clin d’Oeil Store - Boutique de vêtements et mode en Tunisie"
                className="rounded-2xl shadow-lg object-cover w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="max-w-5xl font-heading mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <StarIcon className="w-12 h-12 text-[#D4AF37] mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Style & Tendance
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-sm">
              Des collections inspirées des dernières tendances mode pour vous
              offrir des looks modernes, élégants et toujours actuels.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <UserGroupIcon className="w-12 h-12 text-[#D4AF37] mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Proximité & Confiance
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-sm">
              Une marque proche de ses clients, attentive aux besoins et engagée
              à offrir un service fiable et réactif.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <ShieldCheckIcon className="w-12 h-12 text-[#D4AF37] mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Qualité & Satisfaction
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-sm">
              Nous sélectionnons des vêtements durables et confortables afin de
              garantir une satisfaction maximale à chaque achat.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 font-heading px-6 shadow-lg text-gray-900 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold">
              Découvrez l’univers de la mode chez Clin d’Oeil Store
            </h2>
            <p className="mt-4">
              Parcourez notre boutique en ligne et trouvez des{" "}
              <strong>vêtements tendance en Tunisie</strong> adaptés à votre
              style.
            </p>
            <Link
              to="/contact"
              className="inline-block mt-6 px-8 py-3 bg-gray-800 text-white font-semibold rounded-md shadow-md hover:shadow-2xl transition"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
