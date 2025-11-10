"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import RichText from "@/components/ui/richText";
import request from "@/utils/request";
import { toast } from "sonner";

export default function FormBuilder({
  fields = [],
  schema,
  onSubmit: onSubmitProp,
  apiEndpoint,
  defaultValues = {},
  submitLabel = "Simpan",
  className = "",
  resetOnSuccess = true,
  fileAccept = ".jpg,.jpeg,.png",
}) {
  const generatedDefaults = fields.reduce((acc, field) => {
    if (!(field.name in defaultValues)) {
      if (field.type === "checkbox") {
        acc[field.name] = false;
      } else if (field.type === "file") {
        // skip
      } else {
        acc[field.name] = "";
      }
    }
    return acc;
  }, {});

  const filtersValue = Object.fromEntries(
    Object.entries(defaultValues).filter(([key, value]) => {
      const field = fields.find((f) => f.name === key);
      return !field || field.type !== "file" || value instanceof File;
    })
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...generatedDefaults, ...filtersValue },
  });

  const [optionsData, setOptionsData] = useState({});
  const fileRefs = useRef({});

  useEffect(() => {
    const fetchDynamicOptions = async () => {
      const newOptions = {};
      for (const field of fields) {
        if (field.type === "select" && field.apiOptions) {
          try {
            const res = await request.get(field.apiOptions);
            const data = res.data || res;
            newOptions[field.name] = data;
            console.log("Sending to:", apiEndpoint);
            console.log("Data:", cleanedData);
          } catch (err) {
            toast.error(`Gagal mengambil data untuk ${field.name}`);
            newOptions[field.name] = [];
          }
        }
      }
      setOptionsData(newOptions);
    };
    fetchDynamicOptions();
  }, [fields]);

  const onSubmit = async (data) => {
    try {
      const validationResult = schema.safeParse(data);
      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message);
        return;
      }

      if (apiEndpoint) {
        const hasFiles = fields.some((f) => f.type === "file");

        let payload;
        let config = {};

        if (hasFiles) {
          payload = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value instanceof File) {
              payload.append(key, value);
            } else if (value !== undefined && value !== null) {
              payload.append(key, value);
            }
          });
          config.headers = { "Content-Type": "multipart/form-data" };
        } else {
          payload = data;
        }

        const res = await request.post(apiEndpoint, payload, config);

        if (res.status !== 200 && res.status !== 201)
          throw new Error(res?.data?.message || "Gagal mengirim data");

        toast.success(res?.data?.message || "Data berhasil disimpan");

        if (resetOnSuccess) {
          form.reset();
          Object.values(fileRefs.current).forEach((ref) => {
            if (ref) ref.value = "";
          });
        }
      } else if (onSubmitProp) {
        await onSubmitProp(data);
      }
    } catch (err) {
      console.error("Submit error:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Data gagal disimpan";
      toast.error(msg);
    }
  };

  const grouped = fields.reduce((acc, f) => {
    const row = f.row || 0;
    if (!acc[row]) acc[row] = [];
    acc[row].push(f);
    return acc;
  }, {});

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex flex-col gap-8 ${className}`}
      >
        {Object.entries(grouped).map(([rowKey, rowFields]) => {
          const colCount = rowFields.length;
          let gridClass = "grid-cols-1";
          if (colCount === 2) gridClass = "md:grid-cols-2";
          else if (colCount === 3) gridClass = "md:grid-cols-3";
          else if (colCount >= 4) gridClass = "md:grid-cols-4";

          return (
            <div key={rowKey} className={`grid ${gridClass} gap-4 items-start`}>
              {rowFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: f }) => (
                    <FormItem>
                      {field.label && <FormLabel>{field.label}</FormLabel>}
                      <FormControl>
                        {(() => {
                          switch (field.type) {
                            case "text":
                            case "email":
                            case "password":
                              return (
                                <Input
                                  {...f}
                                  type={field.type}
                                  placeholder={field.placeholder || ""}
                                  className="border border-black/10 dark:border-white/10"
                                />
                              );

                            case "date":
                              return (
                                <Input
                                  {...f}
                                  type="date"
                                  className="border border-black/10 dark:border-white/10"
                                />
                              );

                            case "textarea":
                              return (
                                <Textarea
                                  {...f}
                                  placeholder={field.placeholder || ""}
                                  rows={field.rows || 3}
                                  className="border border-black/10 dark:border-white/10"
                                />
                              );

                            case "checkbox":
                              return (
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id={field.name}
                                    checked={f.value}
                                    onCheckedChange={f.onChange}
                                  />
                                  <label
                                    htmlFor={field.name}
                                    className="text-sm text-muted-foreground"
                                  >
                                    {field.placeholder || field.label}
                                  </label>
                                </div>
                              );

                            case "file":
                              return (
                                <div>
                                  <Input
                                    ref={(el) =>
                                      (fileRefs.current[field.name] = el)
                                    }
                                    type="file"
                                    accept={field.accept || fileAccept}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const allowedFormats = (
                                          field.accept || fileAccept
                                        )
                                          .split(",")
                                          .map((f) => f.trim().toLowerCase());
                                        const fileExt =
                                          "." +
                                          file.name
                                            .split(".")
                                            .pop()
                                            .toLowerCase();
                                        const fileMime =
                                          file.type.toLowerCase();
                                        const isValid = allowedFormats.some(
                                          (format) =>
                                            fileExt === format ||
                                            fileMime === format ||
                                            format === "image/*"
                                        );
                                        if (isValid) {
                                          f.onChange(file);
                                          form.setValue(field.name, file, {
                                            shouldValidate: true,
                                          });
                                        } else {
                                          toast.error(
                                            `Format file tidak didukung. Hanya ${allowedFormats.join(
                                              ", "
                                            )} yang diperbolehkan`
                                          );
                                          e.target.value = "";
                                          f.onChange(undefined);
                                          form.setValue(field.name, undefined);
                                        }
                                      } else {
                                        f.onChange(undefined);
                                        form.setValue(field.name, undefined);
                                      }
                                    }}
                                    className="border border-black/10 dark:border-white/10"
                                  />
                                  {f.value && f.value instanceof File && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Selected: {f.value.name}
                                    </p>
                                  )}
                                </div>
                              );

                            case "richtext":
                              return (
                                <RichText
                                  name={field.name}
                                  label={field.label}
                                  control={form.control}
                                  tooltip={field.tooltip}
                                  placeholder={field.placeholder}
                                />
                              );

                            default:
                              return (
                                <Input
                                  {...f}
                                  placeholder={field.placeholder || ""}
                                  className="border border-black/10 dark:border-white/10"
                                />
                              );
                          }
                        })()}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          );
        })}

        <div className="flex justify-end mt-4">
          <Button type="submit" className="w-fit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
