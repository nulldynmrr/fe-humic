import React from "react";
import Header from "@/components/layout/Header";
import Profile from "@/components/card/Profile";

const AllMembers = () => {
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
  return (
    <>
      <Header
        title="All Members Humic Engineering"
        imageSrc="/assets/bg-header.png"
      />

      <section className="px-4 py-8 md:px-12 h-full md:min-h-[600px] flex flex-col justify-center items-center overflow-hidden gap-6">
        <h1 className="text-3xl font-bold text-black">Our Members</h1>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {members.map((member) => (
            <Profile key={member.id} {...member} shape="square" />
          ))}
        </div>
      </section>
    </>
  );
};

export default AllMembers;
