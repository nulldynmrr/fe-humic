"use client";

import { z } from "zod";
import FormBuilder from "@/components/ui/formBuilder";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const schema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  date: z.string().nonempty("Tanggal wajib diisi"),
  image: z
    .instanceof(File, { message: "Gambar wajib diisi." })
    .refine((file) => file.size <= MAX_FILE_SIZE, "Ukuran file maksimal 5MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Format file tidak valid. Hanya .jpg, .jpeg, dan .png yang diterima."
    ),
});

const fields = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "Project Kickoff Meeting",
    row: 0,
  },
  {
    name: "content",
    label: "Content",
    type: "textarea",
    placeholder: "Initial meeting to discuss project scope and deliverables.",
    row: 1,
  },
  { name: "date", label: "Date", type: "date", row: 2 },
  { name: "image", label: "Image", type: "file", row: 3 },
];

export default function CreateAgenda() {
  return (
    <section className="py-4 bg-white dark:bg-neutral-900 p-6 rounded-sm shadow-md mt-8 md:mt-0">
      <h1 className="text-2xl font-bold mb-12">Buat Agenda</h1>

      <FormBuilder
        fields={fields}
        schema={schema}
        apiEndpoint="/agenda"
        submitLabel="Simpan Agenda"
      />
    </section>
  );
}
