"use client";

import React, { useCallback, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Information from "@/components/card/Information";
import { BreadcrumbDefault } from "@/components/ui/breadcrumb";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Project from "@/components/card/Project";
import { FaUser } from "react-icons/fa";
import { formatWaktu } from "@/utils/time";
import request from "@/utils/request";
import { toast } from "react-hot-toast";

const ArticleContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [currentArticle, setCurrentArticle] = useState(null);
  const [articles, setArticles] = useState([]);

  const [agenda, setAgenda] = useState([]);
  const [berita, setBerita] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await request.get(`/berita/${id}`);
      setCurrentArticle(response.data);
    } catch (err) {
      toast.error("Gagal memuat detail berita");
      setCurrentArticle(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAllArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/berita");
      setArticles(response.data);
    } catch (err) {
      toast.error("Gagal memuat daftar berita");
      setArticles([]);
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
    fetchArticle();
    fetchAllArticles();
    fetchAllAgenda();
    fetchAllBerita();
    fetchAllPengumuman();
  }, [fetchArticle, fetchAllArticles, fetchAllAgenda, fetchAllBerita, fetchAllPengumuman]);

  return (
    <div className="min-h-screen">
      <Header title="Our Articles" imageSrc="/assets/bg-header.png" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-24 lg:px-32 items-start">
        <section className="md:col-span-2 h-full min-h-[500px] ">
          {currentArticle && (
            <div className="py-8">
              <BreadcrumbDefault
                items={[
                  { label: "Artikel", href: "/articles" },
                  { label: currentArticle.title },
                ]}
              />

              <h1 className="text-2xl md:text-3xl font-semibold mb-2">{currentArticle.title}</h1>

              <p className="text-sm text-neut-600 mb-4">
                Diterbitkan pada {formatWaktu(currentArticle.created_at, "date")}
              </p>

              {currentArticle.image_path && (
                <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden mb-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_HOST}${currentArticle.image_path}`}
                    alt={currentArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {currentArticle.link && (
                <div className="flex items-center gap-2 text-neut-700 mb-4">
                  <FaUser size={14} />
                  <Link
                    href={currentArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline break-all"
                  >
                    {currentArticle.link}
                  </Link>
                </div>
              )}

              <div
                className="text-neut-800 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: currentArticle.content }}
              />
            </div>
          )}

          <div className="py-8">
            <h1 className="text-3xl font-bold text-black text-center mb-4 md:mb-0">
              Other Articles
            </h1>
            <Project data={articles} />
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
};
