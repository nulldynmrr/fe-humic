"use client";

import React, { useRef } from "react";
import ImageSlider from "@/components/ui/SliderImage";
import List from "@/components/ui/Checklist";
import Stats from "@/components/ui/StatsSection";
import Button from "@/components/ui/Button";
import Information from "@/components/card/Information";
import CardFeedback from "@/components/card/Feedback";
import Accordion from "@/components/card/Accordion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaCalendarAlt, FaClock, FaBell } from "react-icons/fa";

const Dashboard = () => {
  const feedbackRef = useRef(null);

  const animateScroll = (container, distance, duration = 450) => {
    if (!container) return;
    const start = container.scrollLeft;
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      container.scrollLeft = start + distance * eased;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const getStep = () => {
    const container = feedbackRef.current;
    if (!container) return 370;
    const firstChild = container.querySelector(":scope > div");
    if (!firstChild) return 370;
    const rect = firstChild.getBoundingClientRect();
    return Math.round(rect.width + 16);
  };

  const scrollLeft = () => animateScroll(feedbackRef.current, -getStep());
  const scrollRight = () => animateScroll(feedbackRef.current, getStep());

  const dummyAgenda = [
    {
      title:
        "Lorem ipsum dolor sit amet, consectet Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
      date: "18 November 2025",
      time: "09:29:00 AM",
      image: "/assets/home/agenda.png",
      month: "Nov",
      day: "18",
      href: "/agenda",
    },
    {
      title:
        "Lorem ipsum dolor sit amet, consectet Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
      date: "20 November 2025",
      time: "01:00:00 PM",
      image: "/assets/home/agenda.png",
      month: "Nov",
      day: "20",
      href: "/agenda",
    },
    {
      title:
        "Lorem ipsum dolor sit amet, consectet Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
      date: "25 November 2025",
      time: "10:00:00 AM",
      image: "/assets/agenda-3.jpg",
      month: "Nov",
      day: "25",
      href: "/agenda",
    },
  ];

  const dummyBerita = [
    {
      title:
        "Lorem ipsum dolor sit amet, consectet Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
      date: "17 November 2025",
      time: "08:00:00 AM",
      image: "/assets/home/berita.png",
      href: "/berita",
    },
    {
      title:
        "Lorem ipsum dolor sit amet, consectet Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
      date: "16 November 2025",
      time: "03:15:00 PM",
      image: "/assets/home/berita.png",
      href: "/berita",
    },
    {
      title:
        "Lorem ipsum dolor sit amet, consectet Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
      date: "15 November 2025",
      time: "10:30:00 AM",
      image: "/assets/home/berita.png",
      href: "/berita",
    },
  ];

  const dummyPengumuman = [
    {
      title:
        "Lorem ipsum dolor sit amet, consectet Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
      date: "14 November 2025",
      href: "/pengumuman",
    },
    {
      title:
        "Lorem ipsum dolor sit amet, consectet Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
      date: "13 November 2025",
      href: "/pengumuman",
    },
    {
      title:
        "Lorem ipsum dolor sit amet, consectet Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
      date: "10 November 2025",
      href: "/pengumuman",
    },
  ];

  const feedbacks = [
    {
      name: "Abdull",
      role: "Front End Developer Intern",
      university: "Mahasiswa UGM",
      feedback:
        "Pengalaman magang yang sangat berkesan! Timnya suportif dan banyak belajar tentang React.",
      rating: 5,
    },
    {
      name: "Anisa Rahmawati",
      role: "Data Analyst Intern",
      university: "Mahasiswa UI",
      feedback:
        "Proyek yang menantang tapi menyenangkan. Banyak belajar tentang analisis data real.",
      rating: 4,
    },
    {
      name: "Rizky Pratama",
      role: "UI/UX Designer Intern",
      university: "Mahasiswa ITB",
      feedback:
        "Desain sistemnya keren banget, dapat banyak insight soal user journey dan visual hierarchy.",
      rating: 5,
    },
    {
      name: "Anisa Rahmawati",
      role: "Data Analyst Intern",
      university: "Mahasiswa UI",
      feedback:
        "Proyek yang menantang tapi menyenangkan. Banyak belajar tentang analisis data real.",
      rating: 4,
    },
  ];

  const stats = [
    { value: 10, label: "Divisi Magang yang Tersedia" },
    { value: 80, label: "Project Magang yang Telah Selesai" },
    { value: 120, label: "Mahasiswa Alumni Warp Internship" },
    { value: 150, label: "Mahasiswa Alumni Internship" },
    { value: 15, label: "Kolaborasi dengan Industri & Institusi" },
  ];

  const images = [
    "/assets/home/image-program-1.png",
    "/assets/home/image-program-2.png",
    "/assets/home/image-program-3.png",
    "/assets/home/image-program-4.png",
    "/assets/home/image-program-5.png",
    "/assets/home/image-program-6.png",
    "/assets/home/image-program-7.png",
    "/assets/home/image-program-8.png",
  ];

  const faqs = [
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan anytime directly from your account settings.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan anytime directly from your account settings.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan anytime directly from your account settings.",
    },
    {
      question: "What is your cancellation policy?",
      answer:
        "You can cancel your subscription anytime, and your access will remain until the end of your billing cycle.",
    },
  ];

  return (
    <>
      <ImageSlider />
      <section className="px-4 py-8 md:px-12 h-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full items-start gap-8 ">
          <Information type="agenda" data={dummyAgenda} />
          <Information type="berita" data={dummyBerita} />
          <Information type="pengumuman" data={dummyPengumuman} />
        </div>
      </section>
      <section className="h-full md:min-h-[600px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="px-4 py-8 md:px-12 bg-primary text-white text-xl h-[400px] flex flex-col justify-between">
            <h1 className="text-2xl font-bold w-full pr-12">
              Berbagai kesempatan magang di HUMIC yang membuka jalan bagi
              mahasiswa untuk terlibat langsung dalam riset dan inovasi yang
              berdampak nyata bagi masyarakat.
            </h1>
            <Link
              href="#"
              className="flex items-center space-x-4 hover:font-underline transition-all duration-300"
            >
              <span>Lihat semua program magang</span>
              <MdOutlineKeyboardArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 grid-rows-2">
            {images.slice(0, 4).map((src, index) => (
              <div
                key={index}
                className="relative w-full h-[180px] md:h-[200px]"
              >
                <Image
                  src={src}
                  alt={`image-program-${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4">
          {images.slice(4, 8).map((src, index) => (
            <div key={index} className="relative w-full h-[180px] md:h-[200px]">
              <Image
                src={src}
                alt={`image-program-${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
      <section className="px-4 py-8 md:px-12 h-full md:min-h-[600px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center gap-8 bg-white">
          <div className="relative w-full max-w-md mx-auto h-[500px]">
            <div className="absolute top-0 left-0 z-0">
              <Image
                src="/assets/home/image-internship-1.svg"
                alt="Team Working"
                width={260}
                height={260}
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 z-10 border-8 border-white">
              <Image
                src="/assets/home/image-internship-2.svg"
                alt="Collaboration"
                width={260}
                height={260}
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black">
              Unlock your future with HUMIC <br /> Internship Program and warp
              researchship
            </h1>
            <p className="text-[#12141D] text-md md:text-xl">
              Bergabung dalam magang di HUMIC dan dapatkan lebih dari sekadar
              pengalaman kerja. <br /> Ini adalah kesempatan untuk terjun
              langsung dalam dunia riset dan inovasi.
            </p>

            <List
              items={[
                "Bangun portofolio profesional dari hasil kerja magang",
                "Kembangkan keterampilan teknis & soft skill yang relevan",
              ]}
            />

            <Link
              href="#"
              className="flex items-center gap-2 text-xl text-primary font-semibold hover:underline transition-all duration-300"
            >
              Apply for your internship
              <FiArrowUpRight className="text-2xl" />
            </Link>
          </div>
        </div>

        <Stats data={stats} />
      </section>
      <section className="pl-4 py-8 md:pl-12 h-full overflow-hidden bg-[#3A3C40]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Student Feedback</h1>
            <p className="text-white text-md md:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex space-x-4">
              <Button
                onClick={scrollLeft}
                icon={<FaArrowLeft />}
                bgColor="#FFFFFF"
                textColor="#3A3C40"
                equalSize
              />
              <Button
                onClick={scrollRight}
                icon={<FaArrowRight />}
                bgColor="#74767A"
                textColor="#FFFFFF"
                equalSize
              />
            </div>
          </div>
          <div className="overflow-hidden -mr-[90px] w-full md:w-[751px]">
            <div
              ref={feedbackRef}
              className="flex space-x-4 overflow-x-auto pr-[90px] snap-x snap-mandatory scrollbar-hide"
              style={{ scrollBehavior: "smooth" }}
            >
              {feedbacks.map((fb, index) => (
                <div key={index} className="shrink-0 snap-start">
                  <CardFeedback {...fb} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 py-8 md:px-12 h-full md:min-h-[600px] flex flex-col justify-center items-center overflow-hidden gap-6">
        <h1 className="text-3xl font-bold text-black">
          Frequently asked questions
        </h1>
        <p className="text-[#667085] text-md">
          Everything you need to know about the product and billing.
        </p>
        <div className="w-full max-w-md">
          {faqs.map((faq, i) => (
            <Accordion key={i} {...faq} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
