"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatWaktu } from "@/utils/time";
import request from "@/utils/request";
import { toast } from "sonner";

import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  data,
  fields,
  method = "PATCH",
  apiPath,
  mode = "view",
}) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) setFormData({ ...data });
    setEditMode(mode === "edit");
  }, [data, mode]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          {formData.image_path ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_HOST}${formData.image_path}`}
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
              if (field.key === "image_path" || field.key === "updated_at")
                return null;

              const value = formData[field.key];

              const isDateField = ["start_date", "end_date"].includes(
                field.key
              );

              return (
                <div key={field.key}>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {field.label}
                  </p>
                  {editMode ? (
                    <Input
                      type={isDateField ? "date" : "text"}
                      name={field.key}
                      value={
                        isDateField && value ? value.split("T")[0] : value || ""
                      }
                      onChange={handleInputChange}
                      className="font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    />
                  ) : (
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {value && /^https?:\/\//.test(value) ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 underline"
                        >
                          {value}
                        </a>
                      ) : isDateField ? (
                        formatWaktu(value, "date")
                      ) : (
                        value
                      )}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          {editMode ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
