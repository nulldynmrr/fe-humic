"use client";

import React, { useCallback, useState, useEffect } from "react";
import Project from "@/components/card/Project";
import Header from "@/components/layout/Header";
import Search from "@/components/ui/Search";

import request from "@/utils/request";
import { toast } from "react-hot-toast";

const Agenda = () => {
  const [agenda, setArtcles] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAllAgenda = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/agenda");
      setArtcles(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setArtcles([]);
      } else {
        toast.error("Gagal memuat data agenda");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const onSearch = useCallback(async (search) => {
    setLoading(true);
    try {
      console.log("Searching agenda with query:", search);
      const response = await request.get(`/agenda/search`, {
        params: { que: search },
      });
      setArtcles(response.data);
    } catch (err) {
      toast.error("Gagal mencari agenda");
      setArtcles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAgenda();
  }, [fetchAllAgenda]);

  return (
    <div className="min-h-screen">
      <Header title="Agenda" imageSrc="/assets/bg-header.png" />
      <section className="px-4 py-8 md:px-24 lg:px-34 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-black mb-4 md:mb-0">
            Daftar Agenda
          </h1>
          <Search
            placeholder="Project apa yang ingin kamu cari ?"
            onSubmit={(q) => onSearch(q.trim())}
          />
        </div>
        <Project data={agenda} />
      </section>
    </div>
  );
};

export default Agenda;
