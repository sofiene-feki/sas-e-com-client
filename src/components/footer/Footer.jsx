import React from "react";
import instagram from "../ui/instagram.svg";
import facebook from "../ui/facebook.svg";
import tiktok from "../ui/tiktok.svg";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 md:py-16 pt-6 print:hidden">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ===== Company Info ===== */}
          <div>
            <h4 className="text-lg md:text-xl font-heading mb-5 tracking-[0.18em] uppercase ">
              Contact
            </h4>
            <div className="font-body text-sm md:text-base /80 space-y-3 leading-relaxed">
              <p>
                <strong>Address:</strong> 23 Bis avenue de la liberté Manzah5
                2037 Tunis
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+21620234567"
                  className="hover:underline  transition-colors"
                >
                  +216 27 417 641
                </a>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:contact@clindoeilstore.com"
                  className="hover:underline  transition-colors"
                >
                  contact@clindoeilstore.com{" "}
                </a>
              </p>
            </div>

            {/* Socials */}
            <div className="flex space-x-5 mt-4">
              {[
                {
                  href: "https://www.facebook.com/clindoeilstore",
                  label: "Facebook",
                  svg: <FaFacebook className="w-6 h-6" />,
                },
                {
                  href: "https://www.tiktok.com/@clindoeilstore?_r=1&_t=ZS-9392uXMciLw",
                  label: "Tiktok",
                  svg: <FaTiktok className="w-6 h-6" />,
                },

                {
                  href: "https://www.instagram.com/clin_doeil_store",
                  label: "Instagram",
                  svg: <FaInstagram className="w-6 h-6" />,
                },
              ].map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-600 hover:text-gray-900 transition transform hover:scale-110"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* ===== Quick Links ===== */}
          <div className="hidden md:block">
            <h4 className="text-lg md:text-xl font-heading mb-5 tracking-[0.18em] uppercase ">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm md:text-base font-editorial">
              {[
                { label: "Home", to: "/" },
                { label: "Shop", to: "/Shop" },
                { label: "About Us", to: "/About" },
                { label: "Contact", to: "/Contact" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="opacity-80 hover:opacity-100 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Support ===== */}
          <div>
            <h4 className="text-lg md:text-xl font-heading mb-5 tracking-[0.18em] uppercase">
              Support
            </h4>

            <ul className="space-y-3 text-sm md:text-base font-header">
              {[
                { label: "Help Center", to: "/contact" },
                { label: "Terms of Service", to: "/terms-of-service" },
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Returns & Refunds", to: "/returns-refunds" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="opacity-80 hover:opacity-100 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Map ===== */}
          {/* <div>
            <h4 className="text-lg md:text-xl font-heading mb-4 tracking-[0.18em] uppercase ">
              Visit Us
            </h4>
            <iframe
              className="w-full rounded-md border border-black/20 shadow-lg"
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.7386660123134!2d10.172790400000002!3d36.8487344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd34a7ca2dbef3%3A0xb3e26dc95a6b019e!2sClin%20d&#39;%C5%93il%20Store!5e0!3m2!1sfr!2stn!4v1767899710157!5m2!1sfr!2stn"              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Skands Store Location"
            />
          </div> */}
        </div>

        {/* ===== COPYRIGHT ===== */}
        <div className="mt-2 border-t border-white/20 pt-6 pb-2 text-xs  text-center /50 font-body select-none">
          &copy; {new Date().getFullYear()} clin-doeil . All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function Social({ icon, label }) {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-110">
      <img src={icon} alt={label} className="w-7 h-7 drop-shadow-lg" />
      <span className=" text-[10px] mt-1 font-editorial">{label}</span>
    </div>
  );
}
