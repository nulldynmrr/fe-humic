"use client";

import React, { useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { BreadcrumbDefault } from "@/components/ui/breadcrumb";
import ProjectInternshipSkeleton from "@/components/ui/SkeletonPage";
import Header from "@/components/layout/Header";
import Information from "@/components/card/Information";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

import { formatWaktu } from "@/lib/time";
import request from "@/utils/request";
import { toast } from "react-hot-toast";

const Agenda = ({ slug }) => {
  const [currentAgenda, SetCurrentAgenda] = useState({});
  const [agenda, setAgenda] = useState([]);
  const [berita, setBerita] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAgenda = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await request.get(`/agenda/slug/${slug}`);
      SetCurrentAgenda(res.data);
    } catch (err) {
      toast.error("Gagal memuat data Agenda");
      SetCurrentAgenda({});
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchRelatedAgenda = useCallback(async () => {
    try {
      const response = await request.get("/agenda?limit=4");
      const filtered = response.data.filter((item) => item.slug !== slug);
      setAgenda(filtered);
    } catch (err) {
      setAgenda([]);
    }
  }, [slug]);

  const fetchBerita = useCallback(async () => {
    try {
      const response = await request.get("/berita?limit=4");
      setBerita(response.data);
    } catch (err) {
      setBerita([]);
    }
  }, []);

  const fetchPengumuman = useCallback(async () => {
    try {
      const response = await request.get("/pengumuman?limit=5");
      setPengumuman(response.data);
    } catch (err) {
      setPengumuman([]);
    }
  }, []);

  useEffect(() => {
    fetchAgenda();
    fetchRelatedAgenda();
    fetchBerita();
    fetchPengumuman();
  }, [fetchAgenda, fetchRelatedAgenda, fetchBerita, fetchPengumuman]);

  return (
    <div className="gap gap-4">
      <Header title="Agenda" imageSrc="/assets/bg-header.png" />

      <section className="px-4 py-8 md:px-24 lg:px-34 mt-2 w-full">
        {loading ? (
          <ProjectInternshipSkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            <BreadcrumbDefault
              items={[
                { label: "Home", href: "/" },
                { label: "Agenda", href: "/agenda" },
                { label: currentAgenda.title || "Detail" },
              ]}
            />

            <h1 className="text-xl md:text-2xl font-bold leading-snug text-neut-900">
              {currentAgenda.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-neut-600">
              <div className="flex items-center gap-2">
                <FaCalendarAlt size={14} />
                <span>
                  {currentAgenda.date
                    ? formatWaktu(currentAgenda.date, "date")
                    : "-"}
                </span>
              </div>
              {currentAgenda.created_at && (
                <div className="flex items-center gap-2">
                  <FaClock size={14} />
                  <span>
                    Diterbitkan {formatWaktu(currentAgenda.created_at, "date")}
                  </span>
                </div>
              )}
            </div>

            {currentAgenda.image_url && (
              <div className="relative w-full h-64 md:h-96 rounded-md overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_HOST}${currentAgenda.image_url}`}
                  alt={currentAgenda.title || "Gambar Agenda"}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="text-neut-800 leading-relaxed space-y-4 mt-4"
              dangerouslySetInnerHTML={{ __html: currentAgenda.content }}
            />
          </div>
        )}
      </section>

      {!loading && (
        <section className="px-4 py-8 md:px-24 lg:px-34 mt-2 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Information type="agenda" data={agenda} loading={loading} />
            <Information type="berita" data={berita} loading={loading} />
            <Information
              type="pengumuman"
              data={pengumuman}
              loading={loading}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default Agenda;
