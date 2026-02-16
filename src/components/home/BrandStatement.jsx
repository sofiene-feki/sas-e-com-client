import React from "react";
import { motion } from "framer-motion";

export default function BrandStatement() {
  return (
    <section className="w-full bg-white py-24 md:py-48 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center font-editorial">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle Prefix */}
          <span className="block mb-10 text-[10px] md:text-xs font-ui tracking-[0.4em] uppercase text-neutral-400">
            Our Philosophy
          </span>

          {/* Main Statement */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-neutral-900 leading-[1.1] mb-12 tracking-tight">
            Elevating everyday elegance through <br className="hidden md:block" />
            <span className="italic">refined silhouettes</span> and timeless quality.
          </h2>

          {/* Minimalist Divider */}
          <div className="w-16 h-px bg-neutral-200 mx-auto mb-12" />

          {/* Brand Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { title: "Curated Style", desc: "Expertly selected pieces for your unique narrative." },
              { title: "National Reach", desc: "Door-to-door delivery across all of Tunisia." },
              { title: "Seamless Care", desc: "Dedicated support for an effortless experience." }
            ].map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.8 }}
                className="space-y-3"
              >
                <h3 className="font-ui text-[10px] md:text-xs tracking-[0.2em] uppercase text-neutral-900">
                  {pillar.title}
                </h3>
                <p className="font-body text-neutral-500 text-xs md:text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
