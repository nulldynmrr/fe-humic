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

export default function Agenda() {
  const router = useRouter();
  const [agenda, setAgenda] = useState([]);
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [loading, setLoading] = useState(false);

  const onDelete = async (id) => {
    try {
      const response = await request.delete(`/agenda/${id}`);
      toast.success("Data Agenda berhasil dihapus");
      setAgenda((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      toast.error(
        `Gagal menghapus Agenda: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const fetchAllAgenda = useCallback(
    async (searchQuery = "", filterType = "") => {
      setLoading(true);
      try {
        const params = {};

        if (searchQuery) params.search = searchQuery;
        if (filterType) params.sort = filterType.toUpperCase();

        const response = await request.get("/agenda", { params });
        setAgenda(response.data);
      } catch (err) {
        toast.error("Gagal memuat data Agenda");
        setAgenda([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchAllAgenda(query);
  }, [query, fetchAllAgenda]);

  const onUpdate = (updatedData) => {
    setAgenda((prev) =>
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
    { accessorKey: "content", header: "Kontent" },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }) => <span>{formatWaktu(getValue(), "date")}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
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
          <h2 className="text-2xl font-bold">Agenda HUMIC</h2>
          <p className="text-[#62748E] dark:text-[#828b97]">
            Kelola seluruh agenda kegiatan HUMIC seperti seminar, workshop, dan
            event riset.
          </p>
        </div>

        <div className="flex mt-2 md:mt-0">
          <Button
            variant="default"
            icon={Plus}
            onClick={() => router.push("/administrator/create-agenda")}
          >
            Create
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="max-w-full text-center py-8 text-muted-foreground">
          Memuat data Agenda...
        </div>
      ) : (
        <DataTable columns={tableColumns} data={agenda} filterKey="title" />
      )}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedRow}
        fields={modalFields}
        apiPath={selectedRow ? `/agenda/${selectedRow.id}` : ""}
        method="PATCH"
        mode={modalMode}
        onUpdate={(updatedRow) => {
          fetchAllAgenda();
        }}
      />
    </section>
  );
}
