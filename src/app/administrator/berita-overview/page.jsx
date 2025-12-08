"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Upload, Plus, Edit, Trash, Eye } from "lucide-react";
import TableAction from "@/components/ui/TableAction";
import Modal from "@/components/card/Modal";

import { formatWaktu } from "@/lib/time";
import request from "@/utils/request";
import { toast } from "sonner";

export default function Berita() {
  const router = useRouter();
  const [berita, setBerita] = useState([]);
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [loading, setLoading] = useState(false);

  const onDelete = async (id) => {
    try {
      const response = await request.delete(`/berita/${id}`);
      toast.success("Data Berita berhasil dihapus");
      setBerita((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      toast.error(
        `Gagal menghapus Berita: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const fetchAllBerita = useCallback(
    async (searchQuery = "", filterType = "") => {
      setLoading(true);
      try {
        const params = {};

        if (searchQuery) params.search = searchQuery;
        if (filterType) params.sort = filterType.toUpperCase();

        const response = await request.get("/berita", { params });
        setBerita(response.data);
      } catch (err) {
        toast.error("Gagal memuat data Berita");
        setBerita([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchAllBerita(query);
  }, [query, fetchAllBerita]);

  const onUpdate = (updatedData) => {
    setBerita((prev) =>
      prev.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
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
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }) => <span>{formatWaktu(getValue(), "date")}</span>,
    },
  ];

  const modalFields = columns
    .filter((col) => col.accessorKey && col.id !== "actions")
    .map((col) => ({
      label: col.header,
      key: col.accessorKey,
    }));

  const tableColumns = [
    ...columns.filter((col) => col.id !== "actions"),
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
                className:
                  "capitalize cursor-pointer text-black dark:text-white bg-red-500 hover:bg-gray-100 dark:hover:bg-gray-200/20 transition-colors",
                onClick: () => {
                  setSelectedRow(data);
                  setOpenModal(true);
                  setModalMode("view");
                },
              },
              {
                label: "Edit",
                icon: <Edit className="h-4 w-4" />,
                className:
                  "capitalize cursor-pointer text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200/20 transition-colors",
                onClick: () => {
                  setSelectedRow(data);
                  setOpenModal(true);
                  setModalMode("edit");
                },
              },
              {
                label: "Delete",
                icon: <Trash className="h-4 w-4" />,
                className:
                  "capitalize cursor-pointer text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200/20 transition-colors",
                danger: true,
                onClick: () => {
                  console.log("Klik Delete, data row:", data);
                  onDelete(data.id);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-0 mt-16 md:mt-0">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Berita HUMIC</h2>
          <p className="text-[#62748E] dark:text-[#828b97]">
            Kelola berita dan update terbaru mengenai penelitian, publikasi, dan
            kegiatan HUMIC
          </p>
        </div>

        <div className="flex mt-2 md:mt-0">
          <Button
            variant="default"
            icon={Plus}
            onClick={() => router.push("/administrator/create-berita")}
          >
            Create
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="max-w-full text-center py-8 text-muted-foreground">
          Memuat data Berita...
        </div>
      ) : (
        <DataTable columns={tableColumns} data={berita} filterKey="title" />
      )}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedRow}
        fields={modalFields}
        apiPath={selectedRow ? `/berita/${selectedRow.id}` : ""}
        method="PATCH"
        mode={modalMode}
        onUpdate={(updatedRow) => {
          fetchAllBerita();
        }}
      />
    </section>
  );
}
