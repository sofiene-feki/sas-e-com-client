import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { getCategories } from "../../functions/Categories";

export default function CategoryGrid() {
    const [categories, setCategories] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await getCategories();
            const mapped = data.map((cat) => ({
                title: cat.name,
                link: `/category/${cat.slug}`,
                image: cat.image || "/placeholder.png",
            }));
            setCategories(mapped);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    };

    const sliderSettings = {
        dots: false,
        infinite: true,
        autoplay: !isMobile,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        speed: 1200,
        cssEase: "cubic-bezier(0.23, 1, 0.32, 1)",
        slidesToShow: isMobile ? 1 : 4,
        slidesToScroll: 1,
        centerMode: isMobile,
        centerPadding: isMobile ? "40px" : "0px",
        arrows: true,
        swipeToSlide: true,
        nextArrow: <CategoryNextArrow isMobile={isMobile} />,
        prevArrow: <CategoryPrevArrow isMobile={isMobile} />,
        responsive: [
            {
                breakpoint: 1536,
                settings: {
                    slidesToShow: 3,
                    centerMode: false,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                }
            }
        ]
    };

    return (
        <section className="w-full max-w-7xl mx-auto py-10 bg-white overflow-hidden">
            <div className="mx-auto px-6 md:px-0">
                {/* Editorial Header */}
                <div className="mb-16 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
                    <div className="max-w-2xl">
                        <span className="text-[10px] md:text-xs font-ui tracking-[0.5em] uppercase text-neutral-400 mb-6 block">
                            Les Indispensables
                        </span>
                        <h2 className="font-editorial text-5xl md:text-7xl text-neutral-900 mb-6 tracking-tighter leading-none">
                            Nos Catégories <br className="hidden md:block" />
                        </h2>
                        <p className="font-body text-neutral-600 text-sm md:text-base leading-relaxed max-w-lg">
                            Explorez nos catégories signatures : des robes vaporeuses aux vestes structurées, en passant par nos sélections Kids, chaque pièce est une ode à l’élégance quotidienne.
                        </p>
                    </div>

                    <div className="hidden md:flex flex-col items-end gap-4">
                        {/* Empty space for Arrows handled by absolute pos in Arrows components */}
                        <div className="h-10 w-48" />
                    </div>
                </div>

                {/* SLIDER */}
                <div className="category-slider-container mb-16 md:mb-24 relative">
                    <Slider {...sliderSettings}>
                        {categories.map((cat, index) => (
                            <div key={index} className="px-1 md:px-2">
                                <CategoryCard cat={cat} index={index} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            <style jsx global>{`
                .category-slider-container .slick-list {
                    overflow: visible;
                    padding: 0 !important;
                }
                @media (max-width: 640px) {
                    .category-slider-container .slick-list {
                        padding: 0 40px !important;
                    }
                }
                .category-slider-container .slick-track {
                    display: flex !important;
                }
                .category-slider-container .slick-slide {
                    height: inherit !important;
                    transition: all 0.8s cubic-bezier(0.2, 0, 0.2, 1);
                }
                .category-slider-container .slick-slide:not(.slick-center) {
                    transform: scale(0.92);
                    opacity: 0.3;
                    filter: grayscale(1);
                }
                @media (min-width: 641px) {
                    .category-slider-container .slick-slide {
                        transform: scale(1) !important;
                        opacity: 1 !important;
                        filter: grayscale(0) !important;
                    }
                }
            `}</style>
        </section>
    );
}

function CategoryCard({ cat, index }) {
    const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 1, ease: [0.19, 1, 0.22, 1] }}
        >
            <Link to={cat.link} className="block group relative">
                {/* IMAGE CONTAINER - Expanded Poster View */}
                <div className="relative w-full aspect-[4/5.5] overflow-hidden bg-neutral-200 p-2 md:p-3 border border-neutral-100 transition-all duration-700 ease-in-out shadow-sm group-hover:shadow-2xl">
                    <div className="relative w-full h-full overflow-hidden">
                        <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
                            src={`${API_BASE_URL_MEDIA}${cat.image}`}
                            alt={cat.title}
                            className="w-full h-full object-cover object-center grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[1500ms]"
                        />
                    </div>
                </div>

                {/* TYPOGRAPHY */}
                <div className="mt-4 px-2 flex justify-between items-start">
                    <h3 className="font-editorial text-xl md:text-2xl text-neutral-900 leading-tight group-hover:tracking-wider transition-all duration-1000">
                        {cat.title}
                    </h3>
                    <div className="flex flex-col items-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-700 ">
                        <span className="font-ui text-[10px] text-neutral-900 uppercase tracking-[0.3em]">Tous</span>
                        <div className="w-6 h-[1.5px] bg-neutral-900 group-hover:w-10 transition-all duration-1000" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

/* Bespoke Premium Arrows */
function CategoryNextArrow(props) {
    const { onClick, isMobile, inline } = props;
    if (isMobile && !inline) return null;

    return (
        <div
            className={`${inline ? "relative flex" : "absolute -top-10 right-0 hidden md:flex"} items-center gap-2 cursor-pointer group z-20`}
            onClick={onClick}
        >
            <span className="font-ui text-[10px] md:text-[12px] tracking-[0.3em] text-neutral-400 group-hover:text-black transition-colors">NEXT</span>
            <div className="flex items-center">
                <div className="w-6 md:w-10 h-px bg-neutral-200 group-hover:bg-black transition-all duration-700" />
                <ChevronRightIcon className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors -ml-1" />
            </div>
        </div>
    );
}

function CategoryPrevArrow(props) {
    const { onClick, isMobile, inline } = props;
    if (isMobile && !inline) return null;

    return (
        <div
            className={`${inline ? "relative flex" : "absolute -top-10 right-32 md:right-48 hidden md:flex"} items-center gap-2 cursor-pointer group z-20`}
            onClick={onClick}
        >
            <div className="flex items-center">
                <ChevronLeftIcon className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors -mr-1" />
                <div className="w-6 md:w-10 h-px bg-neutral-200 group-hover:bg-black transition-all duration-700" />
            </div>
            <span className="font-ui text-[10px] md:text-[12px] tracking-[0.3em] text-neutral-400 group-hover:text-black transition-colors">PREV</span>
        </div>
    );
}
