"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import File from "@/components/ui/File";
import Select from "@/components/ui/SelectandSearch";
import { DatePicker } from "@/components/ui/date-picker";
import { z } from "zod";
import request from "@/utils/request";
import { toast } from "sonner";

const internSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nama harus minimal 3 karakter")
      .max(100, "Nama terlalu panjang"),
    university: z.string().min(5, "Nama Universitas harus minimal 5 karakter"),
    major: z.string().min(2, "Program Studi wajib diisi"),
    email: z.string().email("Email tidak valid"),
    contact: z
      .string()
      .min(10, "Nomor kontak minimal 10 digit")
      .max(14, "Nomor kontak terlalu panjang")
      .regex(
        /^(?:\+62|0)[0-9]{9,13}$/,
        "Nomor kontak harus diawali +62 atau 0 dan hanya mengandung angka"
      ),
    linkedin: z
      .string()
      .min(1, "LinkedIn wajib diisi!")
      .refine(
        (val) => val.includes(".") || val.startsWith("http"),
        "URL LinkedIn tidak valid"
      ),
    social_media: z
      .string()
      .min(1, "Social media wajib diisi!")
      .refine(
        (val) => val.includes(".") || val.startsWith("http"),
        "URL Social Media tidak valid"
      ),
    image: z
      .any()
      .refine((file) => file !== null, "Profile image wajib diisi!")
      .refine(
        (file) => !file || file.size <= 5000000,
        "Maksimal file ukuran 5MB"
      )
      .refine(
        (file) =>
          !file || ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
        "Hanya format .jpg, .jpeg, dan .png yang didukung"
      ),
  })

const scrollToError = (field) => {
  const el = document.querySelector(`[name="${field}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus();
  }
};

export default function CreateIntern() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    university: "",
    major: "",
    email: "",
    contact: "",
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

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
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
        let value = formData[key];

        if (key === "start_date" || key === "end_date") {
          value = formatDate(value);
        }

        if (value !== null && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      const response = await request.post("/intern", formDataToSend, {
        "Content-Type": "multipart/form-data",
      });

      if (response.status === 200 || response.status === 201) {
        toast.dismiss();
        toast.success(
          response.data?.message || "Data Internship berhasil dibuat!"
        );

        onReset();
      } else {
        toast.dismiss();
        toast.error("Gagal membuat data Internship - Respons tidak valid");
      }
    } catch (error) {
      setStatus({
        type: "error",
        text: "Gagal membuat data Internship. Silakan coba lagi.",
        errors: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setFormData({
      name: "",
      role: "",
      university: "",
      major: "",
      email: "",
      contact: "",
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
        <h2 className="text-2xl font-bold">Create an Internship Member</h2>
        <p className="text-[#62748E] dark:text-[#828b97]">
          Here's a list of your tasks for this month!
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
            <Label htmlFor="role" required>
              Role
            </Label>
            <Select
              name="role"
              label=""
              value={formData.role}
              onChange={(val) =>
                handleInputChange({ target: { name: "role", value: val } })
              }
              data={[
                { label: "Back-End", value: "Back-End" },
                { label: "Front-End", value: "Front-End" },
                { label: "UI/UX", value: "UI/UX" },
                { label: "AI Developer", value: "AI Developer" },
                { label: "Data Science", value: "Data Science" },
                { label: "Network Engineer", value: "Network Engineer" },
                { label: "Cybersecurity", value: "Cybersecurity" },
                { label: "Devops", value: "Devops" },
                { label: "Multimedia Designer", value: "Multimedia Designer" },
                { label: "Mobile Developer", value: "Mobile Developer" },
              ]}
              placeholder="Pilih atau cari role..."
              variant="dropdown"
              autoShow={true}
            />
            {status.errors.role && (
              <p className="mt-1 text-sm text-red-600">{status.errors.role}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="university" required>
              University
            </Label>
            <Input
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              placeholder="Telkom University"
              className="mt-2"
            />
            {status.errors.university && (
              <p className="mt-1 text-sm text-red-600">
                {status.errors.university}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="major" required>
              Major
            </Label>
            <Input
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              placeholder="Informatika"
              className="mt-2"
            />
            {status.errors.major && (
              <p className="mt-1 text-sm text-red-600">{status.errors.major}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@student.telkomuniversity.ac.id"
              className="mt-2"
            />
            {status.errors.email && (
              <p className="mt-1 text-sm text-red-600">{status.errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contact" required>
              Contact
            </Label>
            <Input
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="+62812345678"
              className="mt-2"
            />
            {status.errors.contact && (
              <p className="mt-1 text-sm text-red-600">
                {status.errors.contact}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin" required>
              LinkedIn
            </Label>
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
            <Label htmlFor="social_media" required>
              Social Media
            </Label>
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
            accept=".jpg,.jpeg,.png"
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
