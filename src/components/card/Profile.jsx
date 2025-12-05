"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Skeleton } from "@/components/ui/Skeleton"; 

export default function Profile({
  id,
  name,
  position,
  image_path,
  shape = "square", // square | circle
  loading = false, 
}) {
  const profileUrl = `/about/all-members/profile/${id}`;

  if (loading) {
    return (
      <div className="flex flex-col items-center text-center p-4 bg-white w-[280px] md:w-[360px] animate-pulse">
        <Skeleton
          className={`w-[220px] h-[220px] mb-4 ${
            shape === "circle" ? "rounded-full" : "rounded-none"
          }`}
        />
        <Skeleton className="w-3/4 h-6 mb-2" />
        <Skeleton className="w-1/2 h-4" />
      </div>
    );
  }

  return (
    <div className="group flex flex-col items-center text-center p-4 bg-white transition-all duration-300 w-[280px] md:w-[360px] hover:scale-[1.02]">
      <Link
        href={profileUrl}
        className="flex flex-col items-center relative z-10"
      >
        <div
          className={`relative w-[220px] h-[220px] mb-4 overflow-hidden ${
            shape === "circle" ? "rounded-full" : "rounded-none"
          }`}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_HOST}${image_path}`}
            alt={name}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>

        <h3 className="font-semibold text-gray-900 text-lg md:text-xl leading-snug">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{position}</p>
      </Link>
    </div>
  );
}
