"use client";

import React, { useCallback, useState, useEffect } from "react";
import Project from "@/components/card/Project";
import Header from "@/components/layout/Header";
import { SearchDefault } from "@/components/ui/Search";

import request from "@/utils/request";
import { toast } from "react-hot-toast";

const IntershipProject = () => {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const featchAllProject = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/project");
      setProjects(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setProjects([]);
      } else {
        toast.error("Gagal memuat data project");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const onSearch = useCallback(async (search) => {
    setLoading(true);
    try {
      console.log("Searching project with query:", search);
      const response = await request.get(`/project/search`, {
        params: { que: search },
      });
      setProjects(response.data);
    } catch (err) {
      toast.error("Gagal mencari project");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    featchAllProject();
  }, [featchAllProject]);

  return (
    <div className="min-h-screen">
      <Header title="Internship Project" imageSrc="/assets/bg-header.png" />
      <section className="px-4 py-8 md:px-24 lg:px-34">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-black mb-4 md:mb-0">
            Our Portfolio Project
          </h1>
          <SearchDefault
            placeholder="Project apa yang ingin kamu cari ?"
            onSubmit={(q) => onSearch(q.trim())}
          />
        </div>
        <Project data={projects} />
      </section>
    </div>
  );
};

export default IntershipProject;
