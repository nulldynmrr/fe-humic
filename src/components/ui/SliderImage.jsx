"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import request from "@/utils/request";
import toast from "react-hot-toast";

const ImageSlider = () => {
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllBanner = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/banner");
      setBanner(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
      } else {
        toast.error("Gagal mengambil data banner");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBanner();
  }, [fetchAllBanner]);

  return (
    <div className="relative w-full bg-black overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full aspect-[3.4/1.1]"
      >
        {banner.map((src, i) => (
          <SwiperSlide
            key={i}
            className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden"
          >
            <img
              src={`${process.env.NEXT_PUBLIC_HOST}${src.image_path}`}
              alt={`Banner ${i + 1}`}
              className="max-w-none w-full h-[110%] object-contain transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
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
