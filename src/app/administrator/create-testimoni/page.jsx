"use client";

import { z } from "zod";
import FormBuilder from "@/components/ui/formBuilder";
import { toast } from "sonner";

const schema = z.object({
  id_intern: z.number().min(1, "Wajib masukkan nama"),
  content: z.string().min(5, "Isi testimoni minimal 5 karakter"),
  rating: z.number().min(1, "Rating wajib diisi"),
});

const fields = [
  {
    name: "id_intern",
    label: "Nama Intern",
    type: "select",
    placeholder: "Masukkan Nama Lengkap",
    apiOptions: "/intern",
    row: 0,
  },
  {
    name: "content",
    label: "Isi Testimoni",
    type: "textarea",
    placeholder: "Tulis pengalaman kamu...",
    row: 1,
  },
  {
    name: "rating",
    label: "Rating",
    type: "rating",
    description: "Beri rating 1–5 bintang",
    row: 2,
  },
];

export default function CreateTestimony() {
  const onSubmit = async (data) => {
    console.log("Data dikirim:", data);
    toast.success("Testimoni berhasil dibuat!");
  };

  return (
    <section className="py-4 bg-white dark:bg-neutral-900 p-6 rounded-sm shadow-md mt-8 md:mt-0">
      <h1 className="text-2xl font-bold mb-12">Buat Testimoni</h1>

      <FormBuilder
        fields={fields}
        schema={schema}
        onSubmit={onSubmit}
        apiEndpoint="/testimony"
        submitLabel="Simpan Testimoni"
      />
    </section>
  );
}
