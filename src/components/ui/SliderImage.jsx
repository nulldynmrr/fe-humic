"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const images = [
  "/assets/home/image-header.svg",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
];

const ImageSlider = () => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                className="max-w-none w-auto h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 30px;
          height: 8px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          width: 45px;
          background: #fff;
          opacity: 1;
        }

        .swiper-pagination {
          bottom: 25px !important;
          display: flex;
          justify-content: center;
          gap: 6px;
        }
      `}</style>
    </div>
  );
};

export default ImageSlider;
