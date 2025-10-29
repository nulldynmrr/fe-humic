"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbDefault } from "@/components/ui/breadcrumb";
import Header from "@/components/layout/Header";
import Information from "@/components/card/Information";
import { FaUser } from "react-icons/fa";

import { formatWaktu } from "@/utils/time";
import request from "@/utils/request";
import { toast } from "react-hot-toast";

const Article = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [agenda, setAgenda] = useState([]);
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllAgenda = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/agenda?limit=4");
      setAgenda(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
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
      const response = await request.get("/articles?limit=4");
      setArticles(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setArticles([]);
      } else {
        toast.error("Gagal memuat data articles");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBeritabyID = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await request.get(`/articles/${id}`);
      setArticle(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setArticle(null);
      } else {
        toast.error("Gagal memuat data articles");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  useEffect(() => {
    fetchAllAgenda();
    fetchAllBerita();
    fetchBeritabyID();
    fetchAllPengumuman();
  }, [fetchAllAgenda, fetchAllBerita, fetchBeritabyID, fetchAllPengumuman]);

  return (
    <div>
      <Header title="Berita" imageSrc="/assets/bg-header.png" />
      <section className="px-4 py-8 md:px-24 lg:px-34 mt-6 w-full grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        <div className="flex flex-col gap-4">
          <BreadcrumbDefault
            items={[
              { label: "Home", href: "/" },
              { label: "Berita", href: "/articles" },
              { label: article?.title || "Loading..." },
            ]}
          />

          <h1 className="text-xl md:text-2xl font-semibold leading-snug text-gray-900">
            {article?.title || "Loading..."}
          </h1>

          <p className="text-sm text-gray-600">
            {article
              ? `Diterbitkan pada ${formatWaktu(article.created_at, "date")}`
              : "Memuat tanggal..."}
          </p>

          {article?.image_path && (
            <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_HOST}${article.image_path}`}
                alt="Gambar Project"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-700 mt-2">
            <FaUser size={14} />
            {article?.link ? (
              <Link
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline break-all"
              >
                {article.link}
              </Link>
            ) : (
              <span className="text-sm text-neut-400 italic">
                No link available
              </span>
            )}
          </div>

          <div
            className="text-gray-800 leading-relaxed space-y-4 mt-2"
            dangerouslySetInnerHTML={{ __html: article?.description || "" }}
          ></div>
        </div>

        <div className="space-y-8">
          <Information type="agenda" data={agenda} />
          <Information type="articles" data={articles} />
          <Information type="pengumuman" data={pengumuman} />
        </div>
      </section>
    </div>
  );
};

export default Article;
