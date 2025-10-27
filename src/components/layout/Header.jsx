"use client";
import React from "react";
import Image from "next/image";

const Header = ({ title, subtitle, imageSrc, showSubtitle = true }) => {
  return (
    <div className="px-4 py-8 md:px-12 relative w-full h-[200px] overflow-hidden">
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black" style={{ opacity: 0.9 }} />

      <div className="relative z-10 flex items-center h-full text-white">
        <div className="flex-shrink-0">
          <Image
            src="/assets/logo-humic-pesergi.png"
            alt="HUMIC Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        <div className="ml-4 md:ml-6">
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            {title}
          </h1>
          {showSubtitle && subtitle && (
            <p className="text-sm md:text-lg text-white mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
