"use client";

import React, { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { BreadcrumbDefault } from "@/components/ui/breadcrumb";
import Header from "@/components/layout/Header";
import Table from "@/components/ui/TableCustom";
import Project from "@/components/card/Project";
import { FaUser } from "react-icons/fa";

import { formatWaktu } from "@/utils/time";
import request from "@/utils/request";
import { toast } from "react-hot-toast";

const ProjectInternship = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [project, setProject] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const featchProject = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get(`/project/${id}`);
      setProject(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setProject([]);
      } else {
        toast.error("Gagal memuat data project");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  useEffect(() => {
    featchProject();
    featchAllProject();
  }, [featchProject, featchAllProject]);

  const dataTabel = [
    {
      nama: "Sayyidus Syauqi A",
      posisi: "UI UX Designer",
      institusi: "Telkom University",
    },
    {
      nama: "Dinar Muhammad Akbar",
      posisi: "Data Analyst",
      institusi: "Telkom University",
    },
    {
      nama: "Rani Puspita",
      posisi: "Frontend Developer",
      institusi: "Telkom University",
    },
  ];
  return (
    <div className="gap gap-4">
      <Header title="Berita" imageSrc="/assets/bg-header.png" />
      <section className="px-4 py-8 md:px-24 lg:px-34 mt-2 w-full">
        <div className="flex flex-col gap-4">
          <BreadcrumbDefault
            items={[
              { label: "Home", href: "/" },
              { label: "Internship Project", href: "/internship-project" },
              { label: project.title },
            ]}
          />

          <h1 className="text-xl md:text-2xl font-semibold leading-snug text-neut-900">
            {project.title}
          </h1>

          <p className="text-sm text-neut-600">
            Diterbitkan pada {formatWaktu(project.created_at, "date")}
          </p>

          {project.image_path && (
            <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_HOST}${project.image_path}`}
                alt="Gambar Project"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-2 text-neut-700 mt-2">
            <FaUser size={14} />
            {project.link ? (
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm  hover:underline break-all"
              >
                {project.link}
              </Link>
            ) : (
              <span className="text-sm text-neut-400 italic">
                No link available
              </span>
            )}
          </div>

          <div
            className="text-neut-800 leading-relaxed space-y-4 mt-2"
            dangerouslySetInnerHTML={{ __html: project.description }}
          ></div>

          <h1 className="text-3xl font-bold text-black text-left mb-4 md:mb-0">
            Team Members
          </h1>
          <Table
            columns={[
              { label: "Nama", key: "nama", align: "center" },
              { label: "Posisi", key: "posisi", align: "center" },
              { label: "Institusi", key: "institusi", align: "center" },
            ]}
            data={dataTabel}
          />
        </div>
      </section>
      <section className="px-4 py-8 md:px-24 lg:px-34">
        <h1 className="text-3xl font-bold text-black text-center mb-4 md:mb-0">
          Project Internship
        </h1>
        <Project data={projects} />
      </section>
    </div>
  );
};

export default ProjectInternship;
