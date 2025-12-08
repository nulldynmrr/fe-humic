"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageSlider from "@/components/ui/SliderImage";
import List from "@/components/ui/Checklist";
import Stats from "@/components/ui/StatsSection";
import ButtonDefault from "@/components/ui/button";
import Information from "@/components/card/Information";
import CardFeedbackCarousel from "@/components/card/Feedback";
import Accordion from "@/components/card/Accordion";
import PageLoader from "@/components/ui/loading";
import { ModalAnnouncement, ModalChoice } from "@/components/ui/Modal";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import request from "@/utils/request";
import toast from "react-hot-toast";

const Dashboard = () => {
  const router = useRouter();
  const feedbackRef = useRef(null);

  const [agenda, setAgenda] = useState([]);
  const [berita, setBerita] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);
  const [testimoni, setTestimoni] = useState([]);
  const [partnership, setPartnership] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [openModalIntern, setOpenModalIntern] = useState(false);
  const [openModalWrap, setopenModalWrap] = useState(false);

  const fetchSection = useCallback(async (url, errorMessage) => {
    try {
      const response = await request.get(url);
      return response.data ?? [];
    } catch (err) {
      if (err.response) {
        toast.dismiss();
      } else {
        toast.error(errorMessage);
      }
      return [];
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setIsLoadingAll(true);
    try {
      const [
        agendaData,
        beritaData,
        pengumumanData,
        testimoniData,
        partnershipData,
      ] = await Promise.all([
        fetchSection("/agenda?limit=4", "Gagal memuat data agenda"),
        fetchSection("/berita?limit=4", "Gagal memuat data berita"),
        fetchSection("/pengumuman?limit=5", "Gagal memuat data pengumuman"),
        fetchSection("/testimony", "Gagal memuat data testimoni"),
        fetchSection("/partners", "Gagal memuat data partnership"),
      ]);

      setAgenda(agendaData);
      setBerita(beritaData);
      setPengumuman(pengumumanData);
      setTestimoni(testimoniData);
      setPartnership(partnershipData);
    } finally {
      setIsLoadingAll(false);
    }
  }, [fetchSection]);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await request.get("/statistics");
      setStats(response.data ?? []);
    } catch (err) {
      toast.error("Gagal memuat statistik");
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchStatistics();
  }, [fetchDashboardData, fetchStatistics]);

  if (isLoadingAll) return <PageLoader />;

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
          <Information type="agenda" data={agenda} loading={isLoadingAll} />
          <Information type="berita" data={berita} loading={isLoadingAll} />
          <Information
            type="pengumuman"
            data={pengumuman}
            loading={isLoadingAll}
          />
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
              href="/internship-project"
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

            <div className="flex flex-col md:flex-row space-x-4 space-y-4 md:space-y-0">
              <ButtonDefault
                onClick={() => setOpenModalIntern(true)}
                text="Apply for internship"
                variant="secondary"
                maxWidth
              />
              <ButtonDefault
                onClick={() => setopenModalWrap(true)}
                text="Apply for warp internship"
                variant="primary"
                maxWidth
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-10 px-8">
          <div className="max-w-4xl w-full">
            <Stats data={stats} />
          </div>
        </div>
      </section>

      <section className="pl-4 py-8 md:pl-12 h-full overflow-hidden bg-[#3A3C40]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Student Feedback</h1>
            <p className="text-white text-md md:text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            {testimoni.length > 1 && (
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
              <CardFeedbackCarousel feedbacks={testimoni} />
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

      {partnership.length > 0 && (
        <section className="bg-neut-50 px-4 py-8 md:px-12 flex flex-col justify-center items-center overflow-hidden gap-6">
          <h1 className="text-xl font-bold text-black">Our Partnership</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl mx-auto">
            {partnership.map((p, index) => {
              let imageSrc = p.logo.startsWith("http")
                ? p.logo
                : `${process.env.NEXT_PUBLIC_HOST}${p.logo}`;

              return (
                <div
                  key={index}
                  className="flex items-center justify-center w-full"
                >
                  {imageSrc ? (
                    <div className="relative w-24 h-18 md:w-32 md:h-20">
                      <Image
                        src={imageSrc}
                        alt={p.name || `partner-${index}`}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm text-center">
                      No logo
                      <br />
                      {p.name || `Partner ${index + 1}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <ModalAnnouncement
        isOpen={openModalIntern}
        onClose={() => setOpenModalIntern(false)}
        onDaftar={() =>
          router.push("https://internify.humicprototyping.com/Internships")
        }
        onDone={() => setOpenModalIntern(false)}
      />

      <ModalChoice
        isOpen={openModalWrap}
        onClose={() => setopenModalWrap(false)}
        options={[
          {
            title: "SIRAMA",
            onClick: () => {
              setopenModalWrap(false);
              router.push("https://sirama.telkomuniversity.ac.id/home");
            },
          },
          {
            title: "SIMKA",
            onClick: () => {
              setopenModalWrap(false);
              router.push("https://simka.telkomuniversity.ac.id");
            },
          },
        ]}
        onDone={() => setopenModalWrap(false)}
      />
    </>
  );
};

export default Dashboard;
