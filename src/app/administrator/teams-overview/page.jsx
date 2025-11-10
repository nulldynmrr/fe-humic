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

export default function Intern() {
  const router = useRouter();
  const [interns, setInterns] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const onDelete = async (id) => {
    try {
      await request.delete(`/intern/${id}`);
      toast.success("Data intern berhasil dihapus");
      setInterns((prev) => prev.filter((item) => item.id !== id));
      fetchAllIntern();
    } catch (err) {
      toast.error("Data intern gagal dihapus");
    }
  };

  const fetchAllIntern = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/intern", {
        params: query ? { search: query } : {},
      });
      setInterns(response.data);
    } catch (err) {
      toast.error("Gagal memuat data intern");
      setInterns([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchAllIntern();
  }, [fetchAllIntern]);

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
    { accessorKey: "name", header: "Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "university", header: "University" },
    { accessorKey: "major", header: "Major" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "contact", header: "Contact" },
    { accessorKey: "linkedin", header: "Linkedin" },
    { accessorKey: "social_media", header: "Social Media" },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ getValue }) => <span>{formatWaktu(getValue(), "date")}</span>,
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ getValue }) => <span>{formatWaktu(getValue(), "date")}</span>,
    },
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
          <h2 className="text-2xl font-bold">Intern</h2>
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
          Memuat data intern...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={interns}
          filterKey="name"
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
