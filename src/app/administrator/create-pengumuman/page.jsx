"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import File from "@/components/ui/File";
import { DatePicker } from "@/components/ui/date-picker";
import { z } from "zod";
import request from "@/utils/request";
import { toast } from "sonner";

const announcementSchema = z.object({
  title: z
    .string()
    .min(3, "Title minimal 3 karakter")
    .max(100, "Title terlalu panjang"),

  content: z
    .string()
    .min(3, "Content minimal 3 karakter")
    .max(5000, "Content terlalu panjang"),

  date: z
    .string()
    .min(1, "Tanggal wajib diisi!")
    .refine(
      (value) => {
        const selected = new Date(value);
        const today = new Date();

        selected.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return selected >= today;
      },
      {
        message: "Tanggal tidak boleh sebelum hari ini!",
      }
    ),

  image: z
    .any()
    .refine((file) => !file || file.size <= 5_000_000, "Max 5MB")
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "Hanya .jpg, .jpeg, .png, .webp"
    ),
});

const scrollToError = (field) => {
  const el = document.querySelector(`[name="${field}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus();
  }
};

export default function CreatePengumuman() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
    image: null,
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

  const handleImageChange = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));

    if (status.errors.image) {
      const newErrors = { ...status.errors };
      delete newErrors.image;
      setStatus((prev) => ({ ...prev, errors: newErrors }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "", errors: {} });

    try {
      const validation = announcementSchema.safeParse(formData);

      if (!validation.success) {
        const zodErrors = {};
        const first = validation.error.issues[0];
        scrollToError(first.path[0]);

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

      if (formData.date) {
        const d = new Date(formData.date);
        formData.date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await request.post("/pengumuman", formDataToSend, {
        "Content-Type": "multipart/form-data",
      });

      if (response.status === 200 || response.status === 201) {
        toast.dismiss();
        toast.success(response.data?.message || "Pengumuman berhasil dibuat!");
       
        onReset();
        router.back();
      } else {
        toast.error("Gagal membuat pengumuman");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat membuat pengumuman");
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setFormData({
      title: "",
      content: "",
      date: "",
      image: null,
    });

    setStatus({ type: "", text: "", errors: {} });
  };

  return (
    <section className="py-4 bg-sidebar p-6 rounded-sm shadow-md mt-16 md:mt-0">
      <h2 className="text-2xl font-bold">Create Pengumuman</h2>
      <p className="text-muted">Buat pengumuman</p>

      <form onSubmit={onSubmit} className="space-y-8 mt-10" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" required>
              Title
            </Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan title pengumuman"
              className="mt-2"
            />
            {status.errors.title && (
              <p className="text-sm text-red-600 mt-1">{status.errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date" required>
              Date
            </Label>
            <DatePicker
              value={formData.date ? new Date(formData.date) : null}
              onChange={(date) =>
                handleInputChange({
                  target: {
                    name: "date",
                    value: date ? date.toISOString() : "",
                  },
                })
              }
              placeholder="Pilih tanggal pengumuman"
            />
            {status.errors.date && (
              <p className="text-sm text-red-600 mt-1">{status.errors.date}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="content" required>
            Content
          </Label>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Tulis isi pengumuman..."
            className="mt-2"
          />
          {status.errors.content && (
            <p className="text-sm text-red-600 mt-1">{status.errors.content}</p>
          )}
        </div>

        <div>
          <File
            label="Image Announcement"
            name="image"
            accept=".jpg,.jpeg,.png,.webp"
            value={formData.image}
            onChange={handleImageChange}
            placeholder="Upload gambar pengumuman"
            maxSizeMB={5}
          />
          {status.errors.image && (
            <p className="text-sm text-red-600 mt-1">{status.errors.image}</p>
          )}
        </div>

        {status.text && (
          <div
            className={`p-4 rounded-md ${
              status.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}
          >
            {status.text}
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6">
          <Button variant="secondary" onClick={onReset} disabled={loading}>
            Reset
          </Button>
          <Button variant="default" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </section>
  );
}
