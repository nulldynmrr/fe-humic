"use client";
import React from "react";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Header from "@/components/layout/Header";
import Information from "@/components/card/Information";
import { FaUser } from "react-icons/fa";

const Article = () => {
  const dummyAgenda = [
    {
      title: "Rapat Koordinasi Bulanan Dinas Pendidikan diadakan di Aula Utama",
      date: "2025-10-10T09:29:00Z",
      image: "/assets/home/agenda.png",
      month: "Oct",
      day: "10",
      href: "/agenda",
    },
    {
      title: "Pelatihan Guru Digital Learning Tahap 2 untuk wilayah kabupaten",
      date: "2025-10-14T09:29:00Z",
      image: "/assets/home/agenda.png",
      month: "Oct",
      day: "14",
      href: "/agenda",
    },
    {
      title: "Sosialisasi Kurikulum Merdeka untuk SMA dan SMK se-Kota",
      date: "2025-10-15T09:29:00Z",
      image: "/assets/home/agenda.png",
      month: "Oct",
      day: "15",
      href: "/agenda",
    },
  ];

  const dummyBerita = [
    {
      title:
        "Kegiatan Peringatan Hari Guru Nasional Berlangsung Meriah di Lapangan Kota",
      date: "2025-10-12T09:00:00Z",
      image: "/assets/home/berita.png",
      href: "/berita",
    },
    {
      title:
        "Sekolah Adiwiyata Raih Penghargaan Nasional 2025 dari Kementerian Lingkungan",
      date: "2025-10-14T09:00:00Z",
      image: "/assets/home/berita.png",
      href: "/berita",
    },
    {
      title:
        "Siswa Berprestasi Asal SMAN 1 Raih Medali Emas Olimpiade Matematika",
      date: "2025-10-15T09:00:00Z",
      image: "/assets/home/berita.png",
      href: "/berita",
    },
  ];

  const dummyPengumuman = [
    {
      title:
        "Pendaftaran lomba kebersihan sekolah ditutup pada 15 Oktober 2025",
      date: "2025-10-13T09:00:00Z",
      href: "/pengumuman",
    },
    {
      title:
        "Batas akhir pengumpulan data peserta ujian semester ganjil 16 Oktober 2025",
      date: "2025-10-16T09:00:00Z",
      href: "/pengumuman",
    },
    {
      title:
        "Pemeliharaan sistem portal akademik pada 14 Oktober 2025 pukul 20.00 WIB",
      date: "2025-10-14T09:00:00Z",
      href: "/pengumuman",
    },
  ];

  return (
    <div>
      <Header title="Berita" imageSrc="/assets/bg-header.png" />
      <section className="px-4 py-8 md:px-32 mt-6 w-full grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        <div className="flex flex-col gap-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Berita", href: "/berita" },
              { label: "Judul Berita" },
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
        </div>

        <aside className="space-y-8">
          <Information type="agenda" data={dummyAgenda} />
          <Information type="berita" data={dummyBerita} />
          <Information type="pengumuman" data={dummyPengumuman} />
        </aside>
      </section>
    </div>
  );
};

export default Article;
