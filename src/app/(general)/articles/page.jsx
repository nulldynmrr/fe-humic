"use client";

import React, { useCallback, useState, useEffect } from "react";
import Project from "@/components/card/Project";
import Header from "@/components/layout/Header";
import { SearchDefault } from "@/components/ui/Search";

import request from "@/utils/request";
import { toast } from "react-hot-toast";

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/berita");
      setArticles(response.data);
    } catch {
      setArticles([]);
      toast.error("Gagal memuat data berita");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllArticles();
  }, [fetchAllArticles]);

  return (
    <div className="min-h-screen">
      <Header title="Our Articles" imageSrc="/assets/bg-header.png" />

      <section className="px-4 py-8 md:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-black mb-4 md:mb-0">
            Our Articles
          </h1>
        </div>

        <Project data={articles} />
      </section>
    </div>
  );
};

export default Article;
