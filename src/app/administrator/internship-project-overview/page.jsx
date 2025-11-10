"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/Button";
import { Upload, Plus, Edit, Trash, Eye } from "lucide-react";
import TableAction from "@/components/ui/TableAction";

import { formatWaktu } from "@/utils/time";
import request from "@/utils/request";
import { toast } from "sonner";

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const onDelete = async (id) => {
    try {
      await request.delete(`/project/${id}`);
      toast.success("Project berhasil dihapus");
      setProjects((prev) => prev.filter((item) => item.id !== id));
      fetchAllInternship();
    } catch (err) {
      toast.error("Project gagal dihapus");
    }
  };

  const fetchAllInternship = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/project", {
        params: query ? { search: query } : {},
      });
      setProjects(response.data);
    } catch (err) {
      toast.error("Gagal memuat data project");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchAllInternship();
  }, [fetchAllInternship]);

  const handleFilter = (filterType) => {
    console.log("Filter:", filterType);
  };

  const columns = [
    { header: "No", cell: ({ row }) => <span>{row.index + 1}</span> },
    {
      accessorKey: "image_path",
      header: "Image",
      cell: ({ getValue }) => {
        const src = getValue();
        return src ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_HOST}${src}`}
            alt="image"
            width={60}
            height={40}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="w-[60px] h-[40px] bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center text-[10px] text-gray-500">
            N/A
          </div>
        );
      },
    },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "publication", header: "Publication" },
    { accessorKey: "link", header: "Link" },
    {
      accessorKey: "updated_at",
      header: "Date",
      cell: ({ getValue }) => <span>{formatWaktu(getValue(), "date")}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <TableAction
            actions={[
              {
                label: "Lihat Detail",
                icon: <Eye className="h-4 w-4" />,
                onClick: () => toast.success("Detail"),
              },
              {
                label: "Edit",
                icon: <Edit className="h-4 w-4" />,
                onClick: () => console.log("Edit", data.id),
              },
              {
                label: "Delete",
                icon: <Trash className="h-4 w-4" />,
                danger: true,
                onClick: () => onDelete(data.id),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Internship Project</h2>
          <p className="text-[#62748E] dark:text-[#828b97]">
            Here's a list of your tasks for this month!
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="secondary"
            icon={Upload}
            onClick={() => router.push("/admin/import")}
          >
            Import
          </Button>

          <Button
            variant="default"
            icon={Plus}
            onClick={() => router.push("/admin/create")}
          >
            Create
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="max-w-full text-center py-8 text-muted-foreground">
          Memuat data project...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={projects}
          filterKey="title"
          filterOptions={[
            {
              label: "Ascending",
              value: "asc",
              onClick: () => handleFilter("asc"),
            },
            {
              label: "Descending",
              value: "desc",
              onClick: () => handleFilter("desc"),
            },
            {
              label: "By Date",
              value: "date",
              onClick: () => handleFilter("date"),
            },
          ]}
        />
      )}
    </section>
  );
}
