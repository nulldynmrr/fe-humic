"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import request from "@/utils/request";
import { toast } from "sonner";

const statistikSchema = z.object({
  name: z.string().min(3, "Keterangan harus minimal 3 karakter."),
  value: z
    .string()
    .min(1, "Value wajib diisi!")
    .regex(/^\d+$/, "Value harus angka tanpa simbol +"),
});

export default function CreateStatistik() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    value: "",
  });

  const [status, setStatus] = useState({
    type: "",
    text: "",
    errors: {},
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (status.errors[name]) {
      const newErrors = { ...status.errors };
      delete newErrors[name];
      setStatus((prev) => ({ ...prev, errors: newErrors }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus({ type: "", text: "", errors: {} });

    try {
      const validation = statistikSchema.safeParse(formData);

      if (!validation.success) {
        const zodErrors = {};

        validation.error.issues.forEach((err) => {
          zodErrors[err.path[0]] = err.message;
        });

        setStatus({
          type: "error",
          text: "Validasi gagal. Periksa kembali data Anda.",
          errors: zodErrors,
        });

        setLoading(false);
        return;
      }

      const response = await request.post("/statistics", {
        name: formData.name,
        value: formData.value,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || "Statistik berhasil dibuat!");
        router.push("/administrator/statistik-overview");
      } else {
        toast.error("Gagal membuat data Statistik");
      }
    } catch (error) {
      console.error("Create statistik error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Terjadi kesalahan server.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-4 bg-sidebar p-6 rounded-sm shadow-md mt-16 md:mt-0">
      <div>
        <h2 className="text-2xl font-bold">Create Statistik</h2>
        <p className="text-[#62748E] dark:text-[#828b97]">
          Tambahkan data statistik baru.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8 mt-12" noValidate>
        <div>
          <Label htmlFor="name" required>
            Keterangan Statistik
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Contoh: Mahasiswa Alumni Internship"
            className="mt-2"
          />
          {status.errors.name && (
            <p className="mt-1 text-sm text-red-600">{status.errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="value" required>
            Value (angka saja)
          </Label>
          <Input
            id="value"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            placeholder="Contoh: 150"
            className="mt-2"
          />
          {status.errors.value && (
            <p className="mt-1 text-sm text-red-600">{status.errors.value}</p>
          )}
        </div>

        {formData.value && (
          <div className="p-4 bg-white rounded-md border shadow-sm">
            <p className="text-sm text-gray-600 mb-1">Preview Statistik:</p>

            <div className="text-center py-4">
              <p className="text-primary text-4xl font-bold">
                {formData.value}+
              </p>
              <p className="text-gray-700 text-base mt-2">{formData.name}</p>
            </div>
          </div>
        )}

        {status.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              status.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {status.text}
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              setFormData({ name: "", value: "" });
              setStatus({ type: "", text: "", errors: {} });
            }}
            disabled={loading}
          >
            Reset
          </Button>
          <Button variant="default" type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </section>
  );
}
