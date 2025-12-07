"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import File from "@/components/ui/File";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import request from "@/utils/request";
import { toast } from "sonner";

const staffSchema = z.object({
  name: z
    .string()
    .min(3, "Nama harus minimal 3 karakter")
    .max(100, "Nama terlalu panjang"),

  position: z
    .string()
    .min(3, "Posisi harus minimal 3 karakter")
    .max(100, "Posisi terlalu panjang"),

  description: z
    .string()
    .min(5, "Deskripsi minimal 5 karakter")
    .max(2000, "Deskripsi terlalu panjang"),

  education: z
    .string()
    .min(3, "Education wajib diisi")
    .max(500, "Education terlalu panjang"),

  publication: z.string().max(2000, "Publication terlalu panjang"),

  email: z.string().email("Email tidak valid"),

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

export default function CreateStaff() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
    education: "",
    publication: "",
    email: "",
    linkedin: "",
    social_media: "",
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
      const validation = staffSchema.safeParse(formData);

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

      const response = await request.post("/staff", formDataToSend, {
        "Content-Type": "multipart/form-data",
      });

      if (response.status === 200 || response.status === 201) {
        toast.dismiss();
        toast.success(
          response.data?.message || "Data Staff Humic berhasil dibuat!"
        );

        onReset();
               router.back();router.back();
      } else {
        toast.dismiss();
        toast.error("Gagal membuat data Staff Humic - Respons tidak valid");
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: "Gagal membuat data Staff Humic. Silakan coba lagi.",
        errors: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setFormData({
      name: "",
      position: "",
      description: "",
      education: "",
      publication: "",
      email: "",
      linkedin: "",
      social_media: "",
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
        <h2 className="text-2xl font-bold">Create an Staff Humic Member</h2>
        <p className="text-[#62748E] dark:text-[#828b97]">
         Kelola data anggota HUMIC yang terdiri dari dosen, peneliti, dan kontributor.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8 mt-12" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Label htmlFor="name" required>
              Nama Lengkap
            </Label>
            <Input
              name="name"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-2"
            />
            {status.errors.name && (
              <p className="mt-1 text-sm text-red-600">{status.errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="position" required>
              Posisi
            </Label>
            <Input
              name="position"
              placeholder="Masukkan Posisi"
              value={formData.position}
              onChange={handleInputChange}
              className="mt-2"
            />
            {status.errors.position && (
              <p className="mt-1 text-sm text-red-600">
                {status.errors.position}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <Label htmlFor="education" required>
              Edukasi
            </Label>
            <Input
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              placeholder="Masukkan edukasi"
              className="mt-2"
            />
            {status.errors.education && (
              <p className="mt-1 text-sm text-red-600">
                {status.errors.education}
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@telkomuniversity.ac.id"
              className="mt-2"
            />
            {status.errors.email && (
              <p className="mt-1 text-sm text-red-600">{status.errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
            <Label htmlFor="description" required>
              Deskripsi
            </Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Masukkan Deskripsi"
              className="mt-2"
            />
            {status.errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {status.errors.description}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="publication">Publication</Label>
            <Textarea
              name="publication"
              value={formData.publication}
              onChange={handleInputChange}
              placeholder="Masukkan Publikasi"
              className="mt-2"
            />
            {status.errors.publication && (
              <p className="mt-1 text-sm text-red-600">
                {status.errors.publication}
              </p>
            )}
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              placeholder="https://www.linkedin.com"
              className="mt-2"
            />
            {status.errors.linkedin && (
              <p className="mt-1 text-sm text-red-600">
                {status.errors.linkedin}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="social_media">Social Media</Label>
            <Input
              name="social_media"
              value={formData.social_media}
              onChange={handleInputChange}
              placeholder="https://www.instagram.com"
              className="mt-2"
            />
            {status.errors.social_media && (
              <p className="mt-1 text-sm text-red-600">
                {status.errors.social_media}
              </p>
            )}
          </div>
        </div>

        <div>
          <File
            label="Profile Image"
            name="image"
            accept=".jpg,.jpeg,.png,.webp"
            value={formData.image}
            onChange={handleImageChange}
            placeholder="Drag & drop foto profil atau klik untuk upload"
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
