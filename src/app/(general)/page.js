"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import ImageSlider from "@/components/ui/SliderImage";
import List from "@/components/ui/Checklist";
import Stats from "@/components/ui/StatsSection";
import ButtonDefault from "@/components/ui/Button";
import Information from "@/components/card/Information";
import CardFeedback from "@/components/card/Feedback";
import Accordion from "@/components/card/Accordion";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaCalendarAlt, FaClock, FaBell } from "react-icons/fa";

import request from "@/utils/request";
import toast from "react-hot-toast";

const Dashboard = () => {
  const feedbackRef = useRef(null);

  const [agenda, setAgenda] = useState([]);
  const [berita, setBerita] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);
  const [testimoni, setTestimoni] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllAgenda = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/agenda?limit=4");
      setAgenda(response.data);
    } catch (err) {
      if (err.response) {
        tost.dismiss();
        setAgenda([]);
      } else {
        toast.error("Gagal memuat data agenda");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllBerita = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/berita?limit=4");
      setBerita(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setBerita([]);
      } else {
        toast.error("Gagal memuat data berita");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllPengumuman = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/pengumuman?limit=5");
      setPengumuman(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setPengumuman([]);
      } else {
        toast.error("Gagal memuat data pengumuman");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllTestimoni = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/testimony");
      setTestimoni(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setTestimoni([]);
      } else {
        toast.error("Gagal memuat data testimoni");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAgenda();
    fetchAllBerita();
    fetchAllPengumuman();
    fetchAllTestimoni();
  }, [fetchAllAgenda, fetchAllBerita, fetchAllPengumuman, fetchAllTestimoni]);

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
      <ImageSlider className="mt-12" />
      <section className="px-4 py-8 md:px-12 h-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <Information type="agenda" data={agenda} loading={loading} />
          <Information type="berita" data={berita} loading={loading} />
          <Information type="pengumuman" data={pengumuman} loading={loading} />
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

            <div className="flex flex-col md:flex-row space-x-4">
              <ButtonDefault
                onClick={() => {}}
                text="Apply for internship"
                variant="secondary"
                maxWidth
              />
              <ButtonDefault
                onClick={() => {}}
                text="Apply for warp internship"
                variant="primary"
                maxWidth
              />
            </div>
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
            {testimoni.length >= 4 && (
              <div className="flex space-x-4">
                <ButtonDefault
                  onClick={scrollLeft}
                  icon={<FaArrowLeft />}
                  bgColor="#FFFFFF"
                  textColor="#3A3C40"
                  equalSize
                />
                <ButtonDefault
                  onClick={scrollRight}
                  icon={<FaArrowRight />}
                  bgColor="#74767A"
                  textColor="#FFFFFF"
                  equalSize
                />
              </div>
            )}
          </div>
          <div className="overflow-hidden -mr-[90px] w-full md:w-[751px]">
            <div
              ref={feedbackRef}
              className="flex space-x-4 overflow-x-auto pr-[90px] snap-x snap-mandatory scrollbar-hide"
              style={{ scrollBehavior: "smooth" }}
            >
              {testimoni.map((testimoni, index) => (
                <div key={index} className="shrink-0 snap-start">
                  <CardFeedback {...testimoni} />
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
        <div className="w-full max-w-xl">
          {faqs.map((faq, i) => (
            <Accordion key={i} {...faq} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
