"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash, Plus, X, Check } from "lucide-react";
import { ModalConfirm } from "@/components/ui/Modal";
import request from "@/utils/request";
import { toast } from "sonner";

export default function StatsOverview() {
  const router = useRouter();
  const [stats, setStats] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", value: "" });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [loading, setLoading] = useState(false);

  const cardClass =
    "w-full overflow-hidden border bg-white dark:bg-sidebar border-black/10 dark:border-white/10 backdrop-blur-md text-foreground rounded-lg p-6 hover:shadow-lg transition-all duration-300";

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await request.get("/statistics");
      setStats(response.data);
    } catch (err) {
      toast.error("Gagal memuat data statistik");
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleEdit = (stat) => {
    setEditingId(stat.id);
    setEditForm({ name: stat.name, value: stat.value });
  };

  const handleSaveEdit = async () => {
    try {
      await request.patch(`/statistics/${editingId}`, editForm);
      toast.success("Statistik berhasil diupdate");
      setStats((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...editForm } : item
        )
      );
      setEditingId(null);
    } catch (err) {
      toast.error("Gagal mengupdate statistik");
    }
  };

  const handleDelete = async (id) => {
    try {
      await request.delete(`/statistics/${id}`);
      toast.success("Statistik berhasil dihapus");
      setStats((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      toast.error("Gagal menghapus statistik");
    }
  };

  const handleAddNew = () => {
    router.push("/administrator/input-statistik");
  };

  if (loading) {
    return (
      <div className="w-full py-8 text-center text-gray-500">
        Memuat data statistik...
      </div>
    );
  }

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-0 mt-16 md:mt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Statistik Overview</h2>
          <p className="text-gray-500">Kelola data statistik HUMIC</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Statistik
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col items-center gap-3 w-full"
          >
            <div className={cardClass}>
              {editingId === stat.id ? (
                <div className="space-y-3">
                  <input
                    type="number"
                    value={editForm.value}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Value"
                  />

                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Name"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-primary mb-2">
                    {stat.value}+
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                    {stat.name}
                  </p>
                </div>
              )}
            </div>

            {editingId !== stat.id && (
              <div className="flex gap-2 bg-white dark:bg-sidebar rounded-full border border-gray-300/30 dark:border-white/10 p-2">
                <button
                  onClick={() => handleEdit(stat)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setTargetId(stat.id);
                    setOpenConfirm(true);
                  }}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <ModalConfirm
        isOpen={openConfirm}
        title="Hapus Statistik?"
        description="Data statistik yang dihapus tidak dapat dikembalikan."
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => {
          handleDelete(targetId);
          setOpenConfirm(false);
        }}
      />
    </section>
  );
}
