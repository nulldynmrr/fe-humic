"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const images = [
  "/assets/home/image-header.svg",
  "/assets/home/image-header.svg",
  "/assets/home/image-header.svg",
];

const ImageSlider = () => {
  return (
    <div className="relative w-full bg-black overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full aspect-[3/1]"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i} className="relative w-full h-full">
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 16px;
          height: 5px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          width: 24px;
          background: #fff;
          opacity: 1;
        }

        .swiper-pagination {
          bottom: 20px !important;
          display: flex;
          justify-content: center;
          gap: 6px;
        }
      `}</style>
    </div>
  );
};

export default ImageSlider;
