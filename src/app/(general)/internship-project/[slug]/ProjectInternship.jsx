"use client";

import React, { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BreadcrumbDefault } from "@/components/ui/breadcrumb";
import ProjectInternshipSkeleton from "@/components/ui/SkeletonPage";
import Header from "@/components/layout/Header";
import Table from "@/components/ui/TableCustom";
import Project from "@/components/card/Project";
import { FaLink } from "react-icons/fa";

import { formatWaktu } from "@/lib/time";
import request from "@/utils/request";
import { toast } from "react-hot-toast";

const ProjectInternship = ({ slug }) => {
  const [project, setProject] = useState({});
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjectAndMembers = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      // fetch project
      const projectRes = await request.get(`/project/slug/${slug}`);
      const projectData = projectRes.data;
      setProject(projectData);

      // fetch project_member
      const projectMembersRes = await request.get(
        `/project_member/${projectData.id}`
      );
      const projectMembers = projectMembersRes.data;

      // fetchall intern
      const internsRes = await request.get("/intern");
      const interns = internsRes.data;

      // mapping project_member dan intern
      const memberList = projectMembers.map((m) => {
        const intern = interns.find((i) => i.id === m.id_intern);
        return {
          nama: m.name || "-",
          posisi: m.role || "-",
          institusi: intern?.university || "-",
        };
      });

      setMembers(memberList);
    } catch (err) {
      toast.error("Gagal memuat data project atau member");
      setProject({});
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchAllProjects = useCallback(async () => {
    try {
      const response = await request.get("/project");
      setProjects(response.data);
    } catch (err) {
      toast.error("Gagal memuat data project");
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    fetchProjectAndMembers();
    fetchAllProjects();
  }, [fetchProjectAndMembers, fetchAllProjects]);

  return (
    <div className="gap gap-4">
      <Header title="Internship Project" imageSrc="/assets/bg-header.png" />

      <section className="px-4 py-8 md:px-24 lg:px-34 mt-2 w-full">
        {loading ? (
          <ProjectInternshipSkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            <BreadcrumbDefault
              items={[
                { label: "Home", href: "/" },
                { label: "Internship Project", href: "/internship-project" },
                { label: project.title },
              ]}
            />

            <h1 className="text-xl md:text-2xl font-bold leading-snug text-neut-900">
              {project.title}
            </h1>

            <p className="text-sm text-neut-600">
              Diterbitkan pada {formatWaktu(project.created_at, "date")}
            </p>

            {project.image_path && (
              <div className="relative w-full h-64 md:h-94 rounded-md overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_HOST}${project.image_path}`}
                  alt="Gambar Project"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-neut-700 mt-2">
              {project.link ? (
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline break-all flex items-center gap-1"
                >
                  <FaLink size={14} />
                  {project.link}
                </Link>
              ) : (
                <span className="text-sm text-neut-400 italic">
                  No link available
                </span>
              )}
            </div>

            <div
              className="text-neut-800 leading-relaxed space-y-4 mt-4"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />

            <h1 className="text-3xl font-bold text-black text-left mt-12 mb-4 md:mb-0">
              Team Members
            </h1>
            <Table
              columns={[
                { label: "Nama", key: "nama", align: "center" },
                { label: "Posisi", key: "posisi", align: "center" },
                { label: "Institusi", key: "institusi", align: "center" },
              ]}
              data={members}
              loading={loading}
            />
          </div>
        )}
      </section>

      {!loading && (
        <section className="px-4 py-8 md:px-24 lg:px-34">
          <h1 className="text-3xl font-bold text-black text-center mb-4 md:mb-0">
            Our Latest Projects
          </h1>
          <Project data={projects} loading={loading} />
        </section>
      )}
    </div>
  );
};

export default ProjectInternship;
