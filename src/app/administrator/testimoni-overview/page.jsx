"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/Button";
import { Upload, Plus, Edit, Trash, Eye, Star } from "lucide-react";
import TableAction from "@/components/ui/TableAction";
import request from "@/utils/request";
import { toast } from "sonner";

export default function Testimoni() {
  const router = useRouter();
  const [testimoni, setTestimoni] = useState([]);
  const [interns, setInterns] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const onDelete = async (id) => {
    try {
      await request.delete(`/testimony/${id}`);
      toast.success("Testimoni berhasil dihapus");
      setTestimoni((prev) => prev.filter((item) => item.id !== id));
      fetchAllTestimoni();
    } catch (err) {
      toast.error("Gagal menghapus testimoni");
    }
  };

  const fetchAllInterns = useCallback(async () => {
    try {
      const res = await request.get("/intern");
      setInterns(res.data);
    } catch (err) {
      toast.error("Gagal memuat data intern");
    }
  }, []);

  const fetchAllTestimoni = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/testimony");
      setTestimoni(response.data);
    } catch (err) {
      toast.error("Gagal memuat data testimoni");
      setTestimoni([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTestimoni();
    fetchAllInterns();
  }, [fetchAllTestimoni, fetchAllInterns]);

  const getInternName = (id) => {
    const intern = interns.find((i) => i.id === id);
    return intern ? intern.name : "Tidak diketahui";
  };

  const filteredData = testimoni.filter((item) => {
    const intern = interns.find((i) => i.id === item.id_intern);
    const name = intern?.name?.toLowerCase() || "";
    return name.includes(query.toLowerCase());
  });

  const columns = [
    { header: "No", cell: ({ row }) => <span>{row.index + 1}</span> },
    {
      accessorKey: "id_intern",
      header: "Nama Intern",
      cell: ({ getValue }) => <span>{getInternName(getValue())}</span>,
    },
    {
      accessorKey: "content",
      header: "Isi Testimoni",
      cell: ({ getValue }) => (
        <span className="block max-w-[300px] truncate">{getValue()}</span>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ getValue }) => (
        <div className="flex items-center space-x-1 text-yellow-500">
          {Array.from({ length: getValue() }, (_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-500" />
          ))}
        </div>
      ),
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
                onClick: () => toast.info("👀 Lihat detail testimoni"),
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
          <h2 className="text-2xl font-bold">Testimoni</h2>
          <p className="text-[#62748E] dark:text-[#828b97]">
            Lihat pengalaman para intern bersama HUMIC!
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
            onClick={() => router.push("/administrator/create-testimoni")}
          >
            Create
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="max-w-full text-center py-8 text-muted-foreground">
          Memuat data testimoni...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          filterKey="intern_name"
          placeholderSearch="Cari berdasarkan nama intern..."
          onFilterSelect={(value) => console.log("Filter:", value)}
          onFilterChange={(value) => setQuery(value)}
          filterOptions={[
            {
              label: "Ascending",
              value: "asc",
              onClick: () => console.log("asc"),
            },
            {
              label: "Descending",
              value: "desc",
              onClick: () => console.log("desc"),
            },
            {
              label: "By Rating",
              value: "rating",
              onClick: () => console.log("rating"),
            },
          ]}
        />
      )}
    </section>
  );
}
