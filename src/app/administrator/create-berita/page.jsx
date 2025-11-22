"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import File from "@/components/ui/File";
import { DatePicker } from "@/components/ui/date-picker";
import { z } from "zod";
import request from "@/utils/request";
import { toast } from "sonner";
import RichText from "@/components/ui/richText";

const agendaSchema = z.object({
  title: z
    .string()
    .min(3, "Title harus minimal 3 karakter")
    .max(100, "Title terlalu panjang"),

  content: z.string().min(1, "Content tidak boleh kosong"),

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
    .refine((file) => file !== null, "Profile image wajib diisi!")
    .refine((file) => !file || file.size <= 5000000, "Maksimal file ukuran 5MB")
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      "Hanya format .jpg, .jpeg, dan .png yang didukung"
    ),
});

const scrollToError = (field) => {
  const el = document.querySelector(`[name="${field}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus();
  }
};

export default function CreateBerita() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    date: "",
    image: null,
  });

  const [status, setStatus] = useState({
    type: "",
    text: "",
    errors: {},
  });

  const [validations, setValidations] = useState([]);
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
    setValidations([]);
    setStatus({ type: "", text: "", errors: {} });

    try {
      const validation = agendaSchema.safeParse(formData);

      if (!validation.success) {
        const zodErrors = {};

        const firstError = validation.error.issues[0];
        scrollToError(firstError.path[0]);

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

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");

        formData.date = `${yyyy}-${mm}-${dd}`;
      }

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await request.post("/berita", formDataToSend, {
        "Content-Type": "multipart/form-data",
      });

      if (response.status === 200 || response.status === 201) {
        toast.dismiss();
        toast.success(response.data?.message || "Data Berita berhasil dibuat!");

        onReset();
      } else {
        toast.dismiss();
        toast.error("Gagal membuat data Berita - Respons tidak valid");
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: "Gagal membuat data Berita. Silakan coba lagi.",
        errors: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setFormData({
      title: "",
      content: "",
      author: "",
      date: "",
      image: null,
    });

    setStatus({
      type: "",
      text: "",
      errors: {},
    });

    setValidations([]);
  };

  return (
    <section className="py-4 bg-sidebar p-6 rounded-sm shadow-md mt-16 md:mt-0">
      <div>
        <h2 className="text-2xl font-bold">Create an Berita xx</h2>
        <p className="text-[#62748E] dark:text-[#828b97]">
          Here's a list of your tasks for this month!
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8 mt-12" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" required>
              Title
            </Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Masukkan title"
              className="mt-2"
            />
            {status.errors.title && (
              <p className="mt-1 text-sm text-red-600">{status.errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="date" required>
              Schedule Time
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
              placeholder="Pilih tanggal ..."
            />
            {status.errors.date && (
              <p className="mt-1 text-sm text-red-600">{status.errors.date}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="content" required>
            Content
          </Label>
          <RichText
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value }))
            }
          />

          {status.errors.content && (
            <p className="mt-1 text-sm text-red-600">{status.errors.content}</p>
          )}
        </div>

        <div>
          <File
            label="Image Berita"
            name="image"
            accept=".jpg,.jpeg,.png,.webp"
            value={formData.image}
            onChange={handleImageChange}
            placeholder="Drag & drop gambar berita atau klik untuk upload"
            maxSizeMB={5}
          />
          {status.errors.image && (
            <p className="mt-1 text-sm text-red-600">{status.errors.image}</p>
          )}
        </div>

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
