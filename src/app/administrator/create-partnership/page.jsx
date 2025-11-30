"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import File from "@/components/ui/File";
import { z } from "zod";
import request from "@/utils/request";
import { toast } from "sonner";

const partnershipSchema = z.object({
  name: z
    .string()
    .min(3, "Name minimal 3 karakter")
    .max(200, "Name terlalu panjang"),

  description: z
    .string()
    .min(5, "Description minimal 5 karakter")
    .max(5000, "Description terlalu panjang"),

  link: z.string().url("Link harus berupa URL valid (https://example.com)"),

  logo: z
    .any()
    .refine((file) => file !== null, "Logo wajib diisi!")
    .refine((file) => !file || file.size <= 5000000, "Maksimal ukuran 5MB")
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      "Format harus .jpg, .jpeg, atau .png"
    ),
});

const scrollToError = (field) => {
  const el = document.querySelector(`[name="${field}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus();
  }
};

export default function CreatePartnership() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    logo: null,
  });

  const [status, setStatus] = useState({
    type: "",
    text: "",
    errors: {},
  });

  const [loading, setLoading] = useState(false);

  // ------------------------- HANDLER INPUT -------------------------
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
    setFormData((prev) => ({ ...prev, logo: file }));

    if (status.errors.logo) {
      const newErrors = { ...status.errors };
      delete newErrors.logo;
      setStatus((prev) => ({ ...prev, errors: newErrors }));
    }
  };

  // ------------------------- SUBMIT -------------------------
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "", errors: {} });

    const validation = partnershipSchema.safeParse(formData);

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

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await request.post("/partners", formDataToSend, {
        "Content-Type": "multipart/form-data",
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data?.message || "Data Partnership berhasil dibuat!"
        );
        onReset();
      } else {
        toast.error("Gagal membuat data Partnership - Respons tidak valid");
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: "Gagal membuat data Partnership. Silakan coba lagi.",
        errors: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setFormData({
      name: "",
      description: "",
      link: "",
      logo: null,
    });

    setStatus({
      type: "",
      text: "",
      errors: {},
    });
  };


  return (
    <section className="py-4 bg-sidebar p-6 rounded-sm shadow-md mt-16 md:mt-0">
      <div>
        <h2 className="text-2xl font-bold">Create Partnership</h2>
        <p className="text-[#62748E] dark:text-[#828b97]">
          Tambahkan partnership baru untuk ditampilkan.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8 mt-12" noValidate>
        {/* NAME */}
        <div>
          <Label htmlFor="name" required>
            Name
          </Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Masukkan nama partnership"
            className="mt-2"
          />
          {status.errors.name && (
            <p className="mt-1 text-sm text-red-600">{status.errors.name}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <Label htmlFor="description" required>
            Description
          </Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Masukkan deskripsi partnership ..."
            className="mt-2"
          />
          {status.errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {status.errors.description}
            </p>
          )}
        </div>

        {/* LINK */}
        <div>
          <Label htmlFor="link" required>
            Link
          </Label>
          <Input
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            placeholder="https://example.com"
            className="mt-2"
          />
          {status.errors.link && (
            <p className="mt-1 text-sm text-red-600">{status.errors.link}</p>
          )}
        </div>

        {/* LOGO */}
        <div>
          <File
            label="Logo Partnership"
            name="logo"
            accept=".jpg,.jpeg,.png"
            value={formData.logo}
            onChange={handleImageChange}
            placeholder="Upload logo partnership"
            maxSizeMB={5}
          />
          {status.errors.logo && (
            <p className="mt-1 text-sm text-red-600">{status.errors.logo}</p>
          )}
        </div>

        {/* ERROR / SUCCESS MESSAGE */}
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

        {/* BUTTONS */}
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
