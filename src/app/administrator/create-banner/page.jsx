"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import File from "@/components/ui/File";
import { z } from "zod";
import request from "@/utils/request";
import { toast } from "sonner";
import { Info } from "lucide-react";

const internSchema = z.object({
  image: z
    .any()
    .refine((file) => file !== null, "Banner image wajib diisi!")
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

export default function CreateIntern() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
      const validation = internSchema.safeParse(formData);

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

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await request.post("/banner", formDataToSend, {
        "Content-Type": "multipart/form-data",
      });

      if (response.status === 200 || response.status === 201) {
        toast.dismiss();
        toast.success(response.data?.message || "Data Banner berhasil dibuat!");

        onReset();
        router.back();
      } else {
        toast.dismiss();
        toast.error("Gagal membuat data Banner - Respons tidak valid");
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: "Gagal membuat data Banner. Silakan coba lagi.",
        errors: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setFormData({
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
        <h2 className="text-2xl font-bold">Create an Banner</h2>
        <p className="text-[#62748E] dark:text-[#828b97]">
          Here's a list of your tasks for this month!
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8 mt-12" noValidate>
        <div
          className="flex items-start gap-2 mt-2 px-3 py-2 rounded-md 
  bg-blue-500 text-blue-100 border border-blue-600 dark:border-blue-400"
        >
          <Info size={16} className="mt-0.5 text-blue-100" />
          <p className="text-md leading-4">
            Ukuran banner <b>1200px × 400px</b> atau rasio <b>3:1</b>.
          </p>
        </div>

        <div>
          <File
            label="Unggah Banner"
            name="image"
            accept=".jpg,.jpeg,.png,.webp"
            value={formData.image}
            onChange={handleImageChange}
            placeholder="Drag & drop gambar banner atau klik untuk upload"
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
