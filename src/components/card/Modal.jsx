"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import RichText from "@/components/ui/richText";
import { formatWaktu } from "@/lib/time";
import request from "@/utils/request";
import { toast } from "sonner";

import { X } from "lucide-react";

const containsHTML = (str) => {
  if (!str || typeof str !== "string") return false;
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlRegex.test(str);
};

export default function Modal({
  isOpen,
  onClose,
  data,
  fields,
  method = "PATCH",
  apiPath,
  mode = "view",
  onUpdate,
}) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const hideEdit = apiPath?.startsWith("/testimony");

  useEffect(() => {
    if (data) setFormData({ ...data });
    setEditMode(mode === "edit");
  }, [data, mode]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRichTextChange = (fieldKey, htmlContent) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: htmlContent }));
  };

  const getImageSrc = () => {
    if (formData.logo instanceof File) {
      return URL.createObjectURL(formData.logo);
    }

    if (typeof formData.logo === "string" && formData.logo.length > 0) {
      return `${process.env.NEXT_PUBLIC_HOST}${formData.logo}`;
    }

    if (formData.image_path) {
      return `${process.env.NEXT_PUBLIC_HOST}${formData.image_path}`;
    }

    return;
  };

  const onSave = async () => {
    const updatedFields = Object.fromEntries(
      Object.entries(formData).filter(([k, v]) => v !== data[k])
    );

    if (Object.keys(updatedFields).length === 0) {
      setEditMode(false);
      return;
    }

    try {
      await request[method.toLowerCase()](apiPath, updatedFields);
      toast.success("Data berhasil diperbarui");

      if (typeof onUpdate === "function") {
        onUpdate({ ...data, ...updatedFields });
      }

      setEditMode(false);
      onClose?.();
    } catch (err) {
      toast.error("Data gagal diperbarui");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-sidebar rounded-lg shadow-lg max-w-4xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between my-6 py-2 text-2xl font-bold border-b border-b-border">
          <h1>Detail Informasi</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex justify-center mb-4">
          {formData.image_path || formData.logo ? (
            <Image
              src={getImageSrc()}
              alt={formData.name || "Profile"}
              width={120}
              height={120}
              className="rounded-sm object-cover border border-gray-300 dark:border-gray-700"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center text-[10px] text-gray-500 dark:text-gray-300">
              N/A
            </div>
          )}
        </div>

        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fields.map((field) => {
              if (
                field.key === "image_path" ||
                field.key === "logo" ||
                field.key === "updated_at"
              )
                return null;

              const value = formData[field.key];
              const isDateField = field.key.toLowerCase().includes("date");
              const hasHTMLContent = containsHTML(value);

              return (
                <div
                  key={field.key}
                  className={hasHTMLContent ? "col-span-full" : ""}
                >
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {field.label}
                  </p>

                  {editMode ? (
                    isDateField ? (
                      <DatePicker
                        value={value ? new Date(value) : null}
                        onChange={(date) => {
                          if (!date) {
                            setFormData((prev) => ({
                              ...prev,
                              [field.key]: null,
                            }));
                            return;
                          }

                          const y = date.getFullYear();
                          const m = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const d = String(date.getDate()).padStart(2, "0");

                          setFormData((prev) => ({
                            ...prev,
                            [field.key]: `${y}-${m}-${d}`,
                          }));
                        }}
                      />
                    ) : hasHTMLContent ? (
                      <RichText
                        value={value || ""}
                        onChange={(html) =>
                          handleRichTextChange(field.key, html)
                        }
                        placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                      />
                    ) : (
                      <Input
                        type="text"
                        name={field.key}
                        value={value || ""}
                        onChange={handleInputChange}
                        className="mt-2 font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                      />
                    )
                  ) : (
                    <div className="mt-2">
                      {isDateField && value ? (
                        <p className="font-bold text-gray-900 dark:text-gray-100">
                          {formatWaktu(value, "date")}
                        </p>
                      ) : hasHTMLContent ? (
                        <div
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: value || "" }}
                        />
                      ) : (
                        <p className="font-bold text-gray-900 dark:text-gray-100">
                          {value}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          {!hideEdit &&
            (editMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({ ...data });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={onSave}>Save</Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)}>Edit</Button>
            ))}
        </div>
      </div>
    </div>
  );
}
