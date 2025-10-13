"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import Profile from "@/components/card/Profile";

const members = [
  {
    id: "e25421gjsdwa",
    name: "Satria Mandela, S.T., M.Sc., Ph.D.",
    role: "Director of Research Center",
    imageSrc: "/assets/about/profile/profile-1.png",
    bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
    education: "Ph.D, Telkom University",
    publications: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  },
  {
    id: "e25421gjsdwb",
    name: "Anisa Rahmawati",
    role: "Research Member",
    imageSrc: "/assets/about/profile/profile-2.png",
  },
  {
    id: "e25421gjsdwc",
    name: "Satria Mandela, S.T., M.Sc., Ph.D.",
    role: "Director of Research Center",
    imageSrc: "/assets/about/profile/profile-1.png",
  },
  {
    id: "e25421gjsdwd",
    name: "Anisa Rahmawati",
    role: "Research Member",
    imageSrc: "/assets/about/profile/profile-2.png",
  },
  {
    id: "e25421gjsdwe",
    name: "Satria Mandela, S.T., M.Sc., Ph.D.",
    role: "Director of Research Center",
    imageSrc: "/assets/about/profile/profile-1.png",
  },
  {
    id: "e25421gjsdwf",
    name: "Anisa Rahmawati",
    role: "Research Member",
    imageSrc: "/assets/about/profile/profile-2.png",
  },
  {
    id: "e25421gjsdwg",
    name: "Satria Mandela, S.T., M.Sc., Ph.D.",
    role: "Director of Research Center",
    imageSrc: "/assets/about/profile/profile-1.png",
  },
  {
    id: "e25421gjsdwh",
    name: "Anisa Rahmawati",
    role: "Research Member",
    imageSrc: "/assets/about/profile/profile-2.png",
  },
  {
    id: "e25421gjsdwi",
    name: "Satria Mandela, S.T., M.Sc., Ph.D.",
    role: "Director of Research Center",
    imageSrc: "/assets/about/profile/profile-1.png",
  },
  {
    id: "e25421gjsdwj",
    name: "Anisa Rahmawati",
    role: "Research Member",
    imageSrc: "/assets/about/profile/profile-2.png",
  },
  {
    id: "e25421gjsdwk",
    name: "Satria Mandela, S.T., M.Sc., Ph.D.",
    role: "Director of Research Center",
    imageSrc: "/assets/about/profile/profile-1.png",
  },
  {
    id: "e25421gjsdwl",
    name: "Anisa Rahmawati",
    role: "Research Member",
    imageSrc: "/assets/about/profile/profile-2.png",
  },
];

const Profiles = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const member = members.find((m) => m.id === id);

  if (!member) {
    <div className="min-h-screen text-white flex justify-center items-center px-6 py-12">
      <p className="text-gray-400 text-xl">Member not found.</p>
    </div>;
  }

  return (
    <section className="px-4 py-8 md:px-12 min-h-screen text-white flex flex-col justify-center items-center space-y-8 mt-[180px]">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="relative w-[280px] h-[280px] md:w-[300px] md:h-[300px] flex-shrink-0 overflow-hidden">
          <Image
            src={member.imageSrc}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col text-left space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-neut-900">
              {member.name}
            </h1>
            <p className="text-neut-600">{member.role}</p>
          </div>

          <p className="text-neut-600 leading-relaxed max-w-3xl">
            {member.bio}
          </p>

          <hr className="border-[#CCCCCC] my-2" />

          <div>
            <h2 className="text-lg font-semibold text-neut-900 mb-1">
              Education
            </h2>
            <p className="text-neut-600">{member.education}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neut-900 mb-1">
              Publications
            </h2>
            <p className="text-neut-600 leading-relaxed">
              {member.publications}
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-black mt-12">Our Members</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 ">
        {members.slice(0, 4).map((member) => (
          <Profile key={member.id} {...member} shape="square" />
        ))}
      </div>
      <Link
        href="/about/all-members"
        className="flex items-center gap-2 text-xl text-primary font-semibold hover:underline transition-all duration-300"
      >
        See all members
        <FiArrowUpRight className="text-2xl" />
      </Link>
    </section>
  );
};

export default Profiles;
