import Project from "@/components/card/Project";
import Header from "@/components/layout/Header";
import Search from "@/components/ui/Search";
import React from "react";

const IntershipProject = () => {
  const project = [
    {
      image: "/images/humic.png",
      date: "18 November 2025",
      title:
        "Project : Landing Page Humic Website Menggunakan Next.js dan Tailwind CSS",
    },
    {
      image: "/images/ai.png",
      date: "25 November 2025",
      title: "Project : Sistem Deteksi Emosi Wajah dengan Machine Learning",
    },
  ];
  return (
    <div className="min-h-screen">
      <Header title="Internship Project" imageSrc="/assets/bg-header.png" />
      <section className="px-4 py-8 md:px-12 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-black mb-4 md:mb-0">
            Our Portfolio Project
          </h1>
          <Search
            placeholder="Project apa yang ingin kamu cari ?"
            // onSubmit={(query) => console.log(query)}
          />
        </div>
        <Project data={project} />
      </section>
    </div>
  );
};

export default IntershipProject;
