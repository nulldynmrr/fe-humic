"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SearchName from "@/components/ui/SelectandSearch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import request from "@/utils/request";
import { z } from "zod";
import { Star } from "lucide-react";

const testimonySchema = z.object({
  id_intern: z.number().min(1, "Nama intern wajib diisi"),
  content: z.string().min(5, "Isi testimoni minimal 5 karakter"),
  rating: z.number().min(1, "Rating wajib diisi"),
});

export default function CreateTestimony() {
  const [interns, setInterns] = useState([]);
  const [formData, setFormData] = useState({
    id_intern: "",
    content: "",
    rating: 0,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const loadInterns = async () => {
    try {
      const res = await request.get("/intern");
      setInterns(res.data || []);
    } catch (err) {
      toast.error("Gagal memuat data intern");
    }
  };

  useEffect(() => {
    loadInterns();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const parsed = testimonySchema.safeParse({
      id_intern: Number(formData.id_intern),
      content: formData.content,
      rating: Number(formData.rating),
    });

    if (!parsed.success) {
      const zodErrors = {};
      parsed.error.issues.forEach((err) => {
        zodErrors[err.path[0]] = err.message;
      });
      setErrors(zodErrors);
      setLoading(false);
      return;
    }

    try {
      await request.post("/testimony", parsed.data);
      toast.success("Testimoni berhasil dibuat!");
      setFormData({
        id_intern: "",
        content: "",
        rating: 0,
      });
    } catch (err) {
      toast.error("Gagal membuat testimoni");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-6 bg-white dark:bg-neutral-900 p-6 rounded-sm shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-10">Buat Testimoni</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <Label>Nama Intern</Label>
          <SearchName
            name="id_intern"
            label={false}
            data={interns.map((i) => ({
              value: i.id,
              label: i.name,
            }))}
            value={formData.id_intern}
            onChange={(val) => handleChange("id_intern", val)}
            placeholder="Pilih intern..."
            variant="search"
          />
          {errors.id_intern && (
            <p className="text-red-500 text-sm mt-1">{errors.id_intern}</p>
          )}
        </div>

        <div>
          <Label>Isi Testimoni</Label>
          <Textarea
            name="content"
            placeholder="Tulis pengalaman kamu..."
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        <div>
          <Label>Rating</Label>
          <div className="flex items-center space-x-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-7 h-7 cursor-pointer transition-colors ${
                  formData.rating >= star
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-400"
                }`}
                onClick={() => handleChange("rating", star)}
              />
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Testimoni"}
        </Button>
      </form>
    </section>
  );
}
