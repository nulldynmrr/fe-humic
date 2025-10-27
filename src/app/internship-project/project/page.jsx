"use client";
import React from "react";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Header from "@/components/layout/Header";
import Table from "@/components/ui/Table";
import Project from "@/components/card/Project";

import { FaUser } from "react-icons/fa";

const ProjectInternship = () => {
  const dataProject = [
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

  const dataTabel = [
    {
      nama: "Sayyidus Syauqi A",
      posisi: "UI UX Designer",
      institusi: "Telkom University",
    },
    {
      nama: "Dinar Muhammad Akbar",
      posisi: "Data Analyst",
      institusi: "Telkom University",
    },
    {
      nama: "Rani Puspita",
      posisi: "Frontend Developer",
      institusi: "Telkom University",
    },
  ];
  return (
    <div className="gap gap-4">
      <Header title="Berita" imageSrc="/assets/bg-header.png" />
      <section className="px-4 py-8 md:px-32 mt-2 w-full">
        <div className="flex flex-col gap-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Internship Project", href: "/internship-dataProject" },
              { label: "Judul dataProject" },
            ]}
          />

          <h1 className="text-xl md:text-2xl font-semibold leading-snug text-gray-900">
            Peringatan Hari Batik Nasional Disambut Antusias oleh Siswa di
            Seluruh Sekolah
          </h1>

          <p className="text-sm text-gray-600">
            Diterbitkan pada 15 Oktober 2025
          </p>

          <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden">
            <Image
              src="/assets/home/berita.png"
              alt="Gambar Berita"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex items-center gap-2 text-gray-700 mt-2">
            <FaUser size={14} />
            <span className="text-sm">redaksi@sekolah.go.id</span>
          </div>

          <div className="text-gray-800 leading-relaxed space-y-4 mt-2">
            <p>
              Dalam rangka memperingati Hari Batik Nasional, berbagai sekolah di
              seluruh Indonesia menggelar kegiatan bertema “Cinta Batik, Cinta
              Budaya”. Siswa dan guru kompak mengenakan pakaian batik sebagai
              bentuk kebanggaan terhadap warisan budaya bangsa.
            </p>
            <p>
              Kepala Dinas Pendidikan setempat menyampaikan bahwa kegiatan ini
              bertujuan menumbuhkan rasa nasionalisme dan kecintaan terhadap
              budaya Indonesia, sekaligus memperkenalkan ragam motif batik dari
              berbagai daerah.
            </p>
            <p>
              Selain mengenakan batik, sejumlah sekolah juga mengadakan lomba
              menggambar motif batik, bazar hasil karya siswa, serta pameran
              sejarah batik. Antusiasme siswa terlihat dari banyaknya peserta
              yang mengikuti kegiatan tersebut.
            </p>
          </div>
          <h1 className="text-3xl font-bold text-black text-left mb-4 md:mb-0">
            Team Members
          </h1>
          <Table
            columns={[
              { label: "Nama", key: "nama", align: "center" },
              { label: "Posisi", key: "posisi", align: "center" },
              { label: "Institusi", key: "institusi", align: "center" },
            ]}
            data={dataTabel}
          />
        </div>
      </section>
      <section className="px-4 py-8 md:px-32">
        <h1 className="text-3xl font-bold text-black text-center mb-4 md:mb-0">
          Project Internship
        </h1>
        <Project data={dataProject} />
      </section>
    </div>
  );
};

export default ProjectInternship;
