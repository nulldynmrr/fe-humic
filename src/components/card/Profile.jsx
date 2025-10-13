"use client";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import React from "react";

export default function Profile({
  id,
  name,
  role,
  imageSrc,
  socials = {},
  shape = "square", // square | circle
}) {
  const profileUrl = `/about/all-members/profile?id=${id}`;

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
            src={imageSrc || "/assets/default-profile.jpg"}
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
        <p className="text-sm text-gray-600 mb-3">{role}</p>
      </Link>

      <div className="flex space-x-4 text-primary mt-1 z-0">
        {socials.linkedin && (
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
          >
            <FaLinkedin className="hover:text-[#0A66C2]" size={20} />
          </a>
        )}
        {socials.github && (
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
          >
            <FaGithub className="hover:text-black" size={20} />
          </a>
        )}
        {socials.instagram && (
          <a
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
          >
            <FaInstagram className="hover:text-[#E4405F]" size={20} />
          </a>
        )}
      </div>
    </div>
  );
}
