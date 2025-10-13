import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import List from "@/components/ui/Checklist";
import Profile from "@/components/card/Profile";
import { FiArrowUpRight } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";

const About = () => {
  const members = [
    {
      id: "e25421gjsdwa",
      name: "Satria Mandela, S.T., M.Sc., Ph.D.",
      role: "Director of Research Center",
      imageSrc: "/assets/about/profile/profile-1.png",
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

  const developers = [
    {
      id: 1,
      name: "Raya Taufik",
      role: "Web Team Lead Advisor",
      img: "/assets/dev1.jpg",
      border: "border-[#C5415C]",
      link: "#",
    },
    {
      id: 2,
      name: "Akhtar M.A",
      role: "Back End Developer",
      img: "/assets/dev2.jpg",
      border: "border-[#E3A1B1]",
      link: "#",
    },
    {
      id: 3,
      name: "Dinar M.A",
      role: "Front End Developer",
      img: "/assets/dev3.jpg",
      border: "border-[#C5415C]",
      link: "#",
    },
    {
      id: 4,
      name: "Sayyidusy S.A",
      role: "UI/UX Designer",
      img: "/assets/dev4.jpg",
      border: "border-[#E3A1B1]",
      link: "#",
    },
  ];

  return (
    <>
      <Header
        title="ABOUT HUMIC ENGINEERING"
        subtitle="Vision & Mission, Members, Partnership"
        imageSrc="/assets/bg-header.png"
      />
      <section className="px-4 py-8 md:px-12 h-full min-h-[500px] overflow-hidden grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
        <Image
          src="/assets/about/image-about-1.svg"
          alt="vision"
          width={500}
          height={50}
          className="object-cover ml-12"
        />
        <div className="grid gap-6">
          <h1 className="text-3xl font-bold text-black">Our Vision</h1>
          <p className="text-[#667085] text-xl">
            To become an excellent research center in the field of engineering
            to improve the human health and prosperity
          </p>
          <List
            items={[
              "Bangun portofolio profesional dari hasil kerja magang",
              "Kembangkan keterampilan teknis & soft skill yang relevan",
            ]}
          />
        </div>
      </section>
      <section className="px-4 py-8 md:px-12 h-full min-h-[500px] overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-primary ">
        <div className="grid gap-6 ">
          <h1 className="text-3xl font-bold text-white">Our Vision</h1>
          <p className="text-white text-xl">
            To become an excellent research center in the field of engineering
            to improve the human health and prosperity
          </p>
          <List
            items={[
              "Bangun portofolio profesional dari hasil kerja magang",
              "Kembangkan keterampilan teknis & soft skill yang relevan",
            ]}
            iconColor="text-white"
            textColor="text-white"
          />
        </div>
        <Image
          src="/assets/about/image-about-2.svg"
          alt="mision"
          width={500}
          height={50}
          className="object-cover mr-12"
        />
      </section>
      <section className="px-4 py-8 md:px-12 h-full md:min-h-[600px] flex flex-col justify-center items-center overflow-hidden gap-6">
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
        <section className="flex flex-col md:flex-row items-center justify-center w-full px-6 md:px-16 py-10 gap-10">
          <div className="grid grid-cols-2 gap-4 md:w-1/2 place-items-center">
            {developers.map((dev) => (
              <div
                key={dev.id}
                className={`relative w-40 h-40 md:w-56 md:h-56 overflow-hidden border-2 ${dev.border} ${dev.rounded}`}
              >
                <Image
                  src={dev.img}
                  alt={dev.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="relative md:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-neut-900 mb-3">
              Our Developer Team Web Humic
            </h1>
            <p className="text-neut-700 mb-6 leading-relaxed">
              Tim pengembang yang bertanggung jawab dalam merancang,
              mengembangkan, dan memelihara website HUMIC sebagai sarana
              informasi dan publikasi riset.
            </p>

            <div className="grid grid-cols-2 gap-y-10 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#E9566B] transform -translate-x-1/2"></div>
              <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-[#3C69E8] transform -translate-y-1/2"></div>

              <div className="flex flex-col gap-1 pr-6">
                <h3 className="font-bold text-lg text-black">Raya Taufik</h3>
                <p className="text-neut-700 text-sm">Web Team Lead Advisor</p>
                <a
                  href="#"
                  className="text-[#006DC0] text-sm flex items-center gap-1"
                >
                  <FaLinkedin /> View on LinkedIn
                </a>
              </div>

              <div className="flex flex-col gap-1 pl-6">
                <h3 className="font-bold text-lg text-black">Akhtar M.A</h3>
                <p className="text-neut-700 text-sm">Back End Developer</p>
                <a
                  href="#"
                  className="text-[#006DC0] text-sm flex items-center gap-1"
                >
                  <FaLinkedin /> View on LinkedIn
                </a>
              </div>

              <div className="flex flex-col gap-1 pr-6">
                <h3 className="font-bold text-lg text-black">Dinar M.A</h3>
                <p className="text-neut-700 text-sm">Front End Developer</p>
                <a
                  href="#"
                  className="text-[#006DC0] text-sm flex items-center gap-1"
                >
                  <FaLinkedin /> View on LinkedIn
                </a>
              </div>

              <div className="flex flex-col gap-1 pl-6">
                <h3 className="font-bold text-lg text-black">Sayyidusy S.A</h3>
                <p className="text-neut-700 text-sm">UI/UX Designer</p>
                <a
                  href="#"
                  className="text-[#006DC0] text-sm flex items-center gap-1"
                >
                  <FaLinkedin /> View on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default About;
