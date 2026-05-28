"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { benefits } from "../data/Benifitdata";

const BenefitHighlightSection = () => {
  return (
    <section className="bg-primary py-16 px-4 sm:px-8 lg:py-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-inter mb-4">
          Who Benefits?
        </h2>
        <p className="text-base sm:text-lg text-gray-400 mb-12 font-inter">
          Social Capital supports every life milestone — with community-powered
          funds.
        </p>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop
          className="pb-10">
          {benefits.map((benefit, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex flex-col h-full rounded-2xl overflow-hidden shadow-lg border border-highlight hover:shadow-2xl bg-highlight group transition-all duration-300">
                {/* Image */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-5 text-left flex-grow">
                  <h3 className="text-white text-xl sm:text-2xl font-semibold mb-2 font-inter">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 font-inter leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Swiper Pagination Styling */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: rgba(255, 255, 255, 0.4) !important;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background-color: #ffffff !important;
        }
      `}</style>
    </section>
  );
};

export default BenefitHighlightSection;
