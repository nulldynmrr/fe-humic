"use client";

import React, { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Information from "@/components/card/Information";
import { BreadcrumbDefault } from "@/components/ui/breadcrumb";
import Header from "@/components/layout/Header";
import Project from "@/components/card/Project";
import { FaUser } from "react-icons/fa";
import { formatWaktu } from "@/lib/time";
import request from "@/utils/request";
import { toast } from "react-hot-toast";

export default function AgendaPage({ slug }) {
  const [currentAgenda, setCurrentAgenda] = useState(null);
  const [agendas, setAgendas] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [berita, setBerita] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAgenda = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const response = await request.get(`/agenda/slug/${slug}`);
      setCurrentAgenda(response.data);
    } catch (err) {
      toast.error("Gagal memuat detail agenda");
      setCurrentAgenda(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchAllArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/berita");
      setAgendas(response.data);
    } catch (err) {
      toast.error("Gagal memuat daftar berita");
      setAgendas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllAgenda = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/agenda?limit=4");
      setAgenda(response.data);
    } catch (err) {
      setAgenda([]);
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
      setBerita([]);
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
      setPengumuman([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgenda();
    fetchAllArticles();
    fetchAllAgenda();
    fetchAllBerita();
    fetchAllPengumuman();
  }, [
    fetchAgenda,
    fetchAllArticles,
    fetchAllAgenda,
    fetchAllBerita,
    fetchAllPengumuman,
  ]);

  console.log(currentAgenda);

  return (
    <div className="min-h-screen">
      <Header title="Our Articles" imageSrc="/assets/bg-header.png" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-20 items-start">
        <section className="md:col-span-2 h-full min-h-[500px] ">
          {currentAgenda && (
            <div className="py-8">
              <BreadcrumbDefault
                items={[
                  { label: "Agenda", href: "/agenda" },
                  { label: currentAgenda.title },
                ]}
              />

              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {currentAgenda.title}
              </h1>

              <p className="text-sm text-neut-600 mb-4">
                Diterbitkan pada {formatWaktu(currentAgenda.created_at, "date")}
              </p>

              {currentAgenda.image_path && (
                <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden mb-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_HOST}${currentAgenda.image_path}`}
                    alt={currentAgenda.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div
                className="text-neut-800 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: currentAgenda.content }}
              />
            </div>
          )}

          <div className="py-8">
            <h1 className="text-3xl font-bold text-black text-center mb-4 md:mb-0">
              Other Articles
            </h1>
            <Project data={agendas} />
          </div>
        </section>

        <section className="flex flex-col py-8 space-y-0">
          <Information type="agenda" data={agenda} loading={loading} />
          <Information type="berita" data={berita} loading={loading} />
          <Information type="pengumuman" data={pengumuman} loading={loading} />
        </section>
      </div>
    </div>
  );
}
