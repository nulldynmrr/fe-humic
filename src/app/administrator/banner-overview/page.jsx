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

export default function Banner() {
  const router = useRouter();
  const [berita, setBerita] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const onDelete = async (id) => {
    try {
      await request.delete(`/banner/${id}`);
      toast.success("Data berhasil dihapus");
      setBerita((prev) => prev.filter((item) => item.id !== id));
      fetchAllBanner();
    } catch (err) {
      toast.error("Data gagal dihapus");
    }
  };

  const fetchAllBanner = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/banner", {
        params: query ? { search: query } : {},
      });
      setBerita(response.data);
    } catch (err) {
      toast.error("Gagal memuat data banner");
      setBerita([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchAllBanner();
  }, [fetchAllBanner]);

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
            width={900}
            height={100}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="w-[60px] h-[40px] bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center text-[10px] text-gray-500">
            N/A
          </div>
        );
      },
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
          <h2 className="text-2xl font-bold">Banner</h2>
          <p className="text-[#62748E] dark:text-[#828b97]">
            Here's a list of your tasks for this month!
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="default"
            icon={Plus}
            onClick={() => router.push("/administrator/create")}
          >
            Create
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="max-w-full text-center py-8 text-muted-foreground">
          Memuat data berita...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={berita}
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
