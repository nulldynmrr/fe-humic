// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/Button";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import DateInput from "@/components/ui/calender";
// import RichText from "@/components/ui/richText";
// import request from "@/utils/request";
// import { toast } from "sonner";
// import { Upload, Star } from "lucide-react";

// export default function FormBuilder({
//   fields = [],
//   schema,
//   onSubmit: onSubmitProp,
//   apiEndpoint,
//   defaultValues = {},
//   submitLabel = "Simpan",
//   className = "",
//   resetOnSuccess = true,
//   fileAccept = ".jpg,.jpeg,.png",
// }) {
//   const generatedDefaults = fields.reduce((acc, field) => {
//     if (!(field.name in defaultValues)) {
//       if (field.type === "checkbox") {
//         acc[field.name] = false;
//       } else if (field.type === "file") {
//         // skip
//       } else {
//         acc[field.name] = "";
//       }
//     }
//     return acc;
//   }, {});

//   const filtersValue = Object.fromEntries(
//     Object.entries(defaultValues).filter(([key, value]) => {
//       const field = fields.find((f) => f.name === key);
//       return !field || field.type !== "file" || value instanceof File;
//     })
//   );

//   const form = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: { ...generatedDefaults, ...filtersValue },
//   });

//   const [optionsData, setOptionsData] = useState({});
//   const fileRefs = useRef({});

//   useEffect(() => {
//     const fetchDynamicOptions = async () => {
//       const newOptions = {};
//       for (const field of fields) {
//         if (field.type === "select" && field.apiOptions) {
//           try {
//             const res = await request.get(field.apiOptions);
//             const data = res.data || res;
//             newOptions[field.name] = data;
//           } catch (err) {
//             toast.error(`Gagal mengambil data untuk ${field.name}`);
//             newOptions[field.name] = [];
//           }
//         }
//       }
//       setOptionsData(newOptions);
//     };
//     fetchDynamicOptions();
//   }, [fields]);

//   const onSubmit = async (data) => {
//     try {
//       const validationResult = schema.safeParse(data);
//       if (!validationResult.success) {
//         const firstError = validationResult.error.errors[0];
//         toast.error(firstError.message);
//         return;
//       }

//       if (apiEndpoint) {
//         const hasFiles = fields.some((f) => f.type === "file");
//         console.log("Has file " + hasFiles);
//         let payload;
//         let config = {};

//         if (hasFiles) {
//           payload = new FormData();
//           Object.entries(data).forEach(([key, value]) => {
//             if (value instanceof File) {
//               console.log("Appending ", key, value);
//               payload.append(key, value);
//             } else if (value !== undefined && value !== null) {
//               payload.append(key, value);
//             }
//           });
//           config = { "content-type": "multipart/form-data" };
//         } else {
//           payload = data;
//         }
//         console.log(config);
//         for (let [key, val] of payload.entries()) {
//           console.log("Payload entry:", key, val);
//         }
//         const res = await request.post(apiEndpoint, payload, config);

//         if (res.status !== 200 && res.status !== 201)
//           throw new Error(res?.data?.message || "Gagal mengirim data");

//         toast.success(res?.data?.message || "Data berhasil disimpan");

//         if (resetOnSuccess) {
//           form.reset();
//           Object.values(fileRefs.current).forEach((ref) => {
//             if (ref) ref.value = "";
//           });
//         }
//       } else if (onSubmitProp) {
//         await onSubmitProp(data);
//       }
//     } catch (err) {
//       console.error("Submit error:", err);
//       const msg =
//         err?.response?.data?.message || err?.message || "Data gagal disimpan";
//       toast.error(msg);
//     }
//   };

//   const grouped = fields.reduce((acc, f) => {
//     const row = f.row || 0;
//     if (!acc[row]) acc[row] = [];
//     acc[row].push(f);
//     return acc;
//   }, {});

//   return (
//     <Form {...form} encType="multipart/form-data">
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className={`flex flex-col gap-8 ${className}`}
//       >
//         {Object.entries(grouped).map(([rowKey, rowFields]) => {
//           const colCount = rowFields.length;
//           let gridClass = "grid-cols-1";
//           if (colCount === 2) gridClass = "md:grid-cols-2";
//           else if (colCount === 3) gridClass = "md:grid-cols-3";
//           else if (colCount >= 4) gridClass = "md:grid-cols-4";

//           return (
//             <div key={rowKey} className={`grid ${gridClass} gap-4 items-start`}>
//               {rowFields.map((field) => (
//                 <FormField
//                   key={field.name}
//                   control={form.control}
//                   name={field.name}
//                   render={({ field: f }) => (
//                     <FormItem>
//                       {field.label && <FormLabel>{field.label}</FormLabel>}
//                       <FormControl>
//                         {(() => {
//                           switch (field.type) {
//                             case "text":
//                             case "email":
//                             case "password":
//                               return (
//                                 <Input
//                                   {...f}
//                                   type={field.type}
//                                   placeholder={field.placeholder || ""}
//                                   className="border border-black/10 dark:border-white/10"
//                                 />
//                               );

//                             case "date":
//                               return (
//                                 <DateInput
//                                   {...f}
//                                   placeholder={field.placeholder}
//                                   value={f.value}
//                                   onChange={f.onChange}
//                                   className="w-full border border-black/10 dark:border-white/10 px-2 py-2 text-sm"
//                                 />
//                               );

//                             case "textarea":
//                               return (
//                                 <Textarea
//                                   {...f}
//                                   placeholder={field.placeholder || ""}
//                                   rows={field.rows || 3}
//                                   className="border border-black/10 dark:border-white/10"
//                                 />
//                               );

//                             // case "select":
//                             //   const selectOptions =
//                             //     optionsData[field.name] || field.options || [];
//                             //   const [search, setSearch] = useState("");
//                             //   const [showOptions, setShowOptions] =
//                             //     useState(false);

//                             //   const filteredOptions = selectOptions
//                             //     .filter((opt) => {
//                             //       const label = (
//                             //         opt.label ||
//                             //         opt.name ||
//                             //         ""
//                             //       ).toLowerCase();
//                             //       return label.includes(search.toLowerCase());
//                             //     })
//                             //     .slice(0, 5);

//                             //   return (
//                             //     <div className="relative">
//                             //       <Input
//                             //         type="text"
//                             //         placeholder={
//                             //           field.placeholder || "Tulis nama..."
//                             //         }
//                             //         value={search}
//                             //         onChange={(e) => {
//                             //           const val = e.target.value;
//                             //           setSearch(val);
//                             //           f.onChange(val);
//                             //           setShowOptions(val.length > 0);
//                             //         }}
//                             //         onBlur={() =>
//                             //           setTimeout(
//                             //             () => setShowOptions(false),
//                             //             150
//                             //           )
//                             //         }
//                             //         onFocus={() => {
//                             //           if (search.length > 0)
//                             //             setShowOptions(true);
//                             //         }}
//                             //         className="w-full border border-black/10 dark:border-white/10 px-2 py-2 text-sm"
//                             //       />

//                             //       {showOptions &&
//                             //         filteredOptions.length > 0 && (
//                             //           <ul className="absolute z-10 w-full bg-[#FAFAFA] dark:bg-[#1f1f1f] border border-black/10 dark:border-white/10 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
//                             //             {filteredOptions.map((opt, idx) => (
//                             //               <li
//                             //                 key={opt.value || opt.id || idx}
//                             //                 onMouseDown={() => {
//                             //                   setSearch(opt.label || opt.name);
//                             //                   f.onChange(
//                             //                     opt.value || opt.id || opt.name
//                             //                   );
//                             //                   setShowOptions(false);
//                             //                 }}
//                             //                 className="px-3 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200/20 cursor-pointer"
//                             //               >
//                             //                 {opt.label || opt.name}
//                             //               </li>
//                             //             ))}
//                             //           </ul>
//                             //         )}

//                             //       {showOptions &&
//                             //         filteredOptions.length === 0 && (
//                             //           <div className="absolute z-10 w-full bg-[#FAFAFA] dark:bg-[#1f1f1f] border border-black/10 dark:border-white/10 rounded-md shadow-lg mt-1 p-2 text-center text-gray-500 text-sm">
//                             //             Tidak ada hasil
//                             //           </div>
//                             //         )}
//                             //     </div>
//                             //   );

//                             case "select": {
//                               const selectOptions =
//                                 optionsData[field.name] || field.options || [];
//                               const [search, setSearch] = useState("");
//                               const [showOptions, setShowOptions] =
//                                 useState(false);

//                               const filteredOptions =
//                                 field.variant === "search"
//                                   ? selectOptions
//                                       .filter((opt) => {
//                                         const label = (
//                                           opt.label ||
//                                           opt.name ||
//                                           ""
//                                         ).toLowerCase();
//                                         return label.includes(
//                                           search.toLowerCase()
//                                         );
//                                       })
//                                       .slice(0, 5)
//                                   : selectOptions;

//                               return (
//                                 <div className="relative">
//                                   <Input
//                                     type="text"
//                                     placeholder={
//                                       field.placeholder ||
//                                       "Pilih atau ketik nama..."
//                                     }
//                                     value={search}
//                                     readOnly={field.variant !== "search"}
//                                     onChange={(e) => {
//                                       const val = e.target.value;
//                                       setSearch(val);
//                                       f.onChange(val);
//                                       if (field.variant === "search")
//                                         setShowOptions(val.length > 0);
//                                     }}
//                                     onClick={() => {
//                                       if (field.variant !== "search")
//                                         setShowOptions(!showOptions);
//                                     }}
//                                     onBlur={() =>
//                                       setTimeout(
//                                         () => setShowOptions(false),
//                                         150
//                                       )
//                                     }
//                                     onFocus={() => {
//                                       if (field.variant === "search") {
//                                         if (search.length > 0)
//                                           setShowOptions(true);
//                                       } else {
//                                         setShowOptions(true);
//                                       }
//                                     }}
//                                     className="w-full border border-black/10 dark:border-white/10 px-2 py-2 text-sm cursor-pointer"
//                                   />

//                                   {showOptions &&
//                                     filteredOptions.length > 0 && (
//                                       <ul className="absolute z-10 w-full bg-[#FAFAFA] dark:bg-[#1f1f1f] border border-black/10 dark:border-white/10 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
//                                         {filteredOptions.map((opt, idx) => (
//                                           <li
//                                             key={opt.value || opt.id || idx}
//                                             onMouseDown={() => {
//                                               setSearch(opt.label || opt.name);
//                                               f.onChange(
//                                                 opt.value || opt.id || opt.name
//                                               );
//                                               setShowOptions(false);
//                                             }}
//                                             className="px-3 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200/20 cursor-pointer"
//                                           >
//                                             {opt.label || opt.name}
//                                           </li>
//                                         ))}
//                                       </ul>
//                                     )}

//                                   {showOptions &&
//                                     filteredOptions.length === 0 && (
//                                       <div className="absolute z-10 w-full bg-[#FAFAFA] dark:bg-[#1f1f1f] border border-black/10 dark:border-white/10 rounded-md shadow-lg mt-1 p-2 text-center text-gray-500 text-sm">
//                                         Tidak ada hasil
//                                       </div>
//                                     )}
//                                 </div>
//                               );
//                             }

//                             case "checkbox":
//                               return (
//                                 <div className="flex items-center gap-2">
//                                   <Checkbox
//                                     id={field.name}
//                                     checked={f.value}
//                                     onCheckedChange={f.onChange}
//                                     className="border border-black/10 dark:border-white/10"
//                                   />
//                                   <label
//                                     htmlFor={field.name}
//                                     className="text-sm text-muted-foreground"
//                                   >
//                                     {field.placeholder || field.label}
//                                   </label>
//                                 </div>
//                               );

//                             case "file": {
//                               const [previewUrl, setPreviewUrl] =
//                                 useState(null);
//                               const [selectedFile, setSelectedFile] =
//                                 useState(null);
//                               const [isImage, setIsImage] = useState(false);

//                               const handleFileSelect = (file) => {
//                                 if (!file) {
//                                   form.setValue(field.name, undefined);
//                                   setPreviewUrl(null);
//                                   setSelectedFile(null);
//                                   return;
//                                 }

//                                 const allowedFormats = (
//                                   field.accept || fileAccept
//                                 )
//                                   .split(",")
//                                   .map((f) => f.trim().toLowerCase());

//                                 const fileExt =
//                                   "." +
//                                   file.name.split(".").pop().toLowerCase();
//                                 const fileMime = file.type.toLowerCase();

//                                 const isValid = allowedFormats.some(
//                                   (format) =>
//                                     fileExt === format ||
//                                     fileMime === format ||
//                                     format === "image/*"
//                                 );

//                                 if (!isValid) {
//                                   toast.error(
//                                     `Format file tidak didukung. Hanya ${allowedFormats.join(
//                                       ", "
//                                     )} yang diperbolehkan`
//                                   );
//                                   form.setValue(field.name, undefined);
//                                   setPreviewUrl(null);
//                                   setSelectedFile(null);
//                                   return;
//                                 }

//                                 form.setValue(field.name, file, {
//                                   shouldValidate: true,
//                                 });
//                                 setSelectedFile(file);

//                                 if (file.type.startsWith("image/")) {
//                                   setIsImage(true);
//                                   const reader = new FileReader();
//                                   reader.onload = (e) =>
//                                     setPreviewUrl(e.target.result);
//                                   reader.readAsDataURL(file);
//                                 } else {
//                                   setIsImage(false);
//                                   setPreviewUrl(null);
//                                 }
//                               };

//                               return (
//                                 <div
//                                   onClick={() =>
//                                     fileRefs.current[field.name]?.click()
//                                   }
//                                   onDragOver={(e) => {
//                                     e.preventDefault();
//                                     e.currentTarget.classList.add(
//                                       "border-blue-400",
//                                       "bg-blue-50"
//                                     );
//                                   }}
//                                   onDragLeave={(e) => {
//                                     e.preventDefault();
//                                     e.currentTarget.classList.remove(
//                                       "border-blue-400",
//                                       "bg-blue-50"
//                                     );
//                                   }}
//                                   onDrop={(e) => {
//                                     e.preventDefault();
//                                     e.currentTarget.classList.remove(
//                                       "border-blue-400",
//                                       "bg-blue-50"
//                                     );
//                                     const file = e.dataTransfer.files?.[0];
//                                     handleFileSelect(file);
//                                   }}
//                                   className="relative w-full border-2 py-6  border-black/10 dark:border-white/10 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 dark:bg-neutral-900"
//                                 >
//                                   <input
//                                     ref={(el) =>
//                                       (fileRefs.current[field.name] = el)
//                                     }
//                                     type="file"
//                                     accept={field.accept || fileAccept}
//                                     onChange={(e) =>
//                                       handleFileSelect(e.target.files?.[0])
//                                     }
//                                     className="hidden"
//                                   />

//                                   <div className="flex flex-col items-center justify-center pointer-events-none">
//                                     {!previewUrl ? (
//                                       <>
//                                         <Upload className="w-8 h-8 mb-2 text-gray-500" />
//                                         <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
//                                           Drag & drop file atau klik untuk
//                                           upload
//                                         </p>
//                                         <p className="text-xs text-gray-500 dark:text-gray-300 text-center">
//                                           Format file .jpg, .jpeg, dan .png
//                                         </p>
//                                       </>
//                                     ) : (
//                                       <div className="flex flex-col items-center">
//                                         {isImage && (
//                                           <img
//                                             src={previewUrl}
//                                             alt="Preview"
//                                             className="w-40 object-cover mb-2"
//                                           />
//                                         )}
//                                         <p className="text-xs text-gray-600 dark:text-gray-300 text-center truncate max-w-[180px]">
//                                           {selectedFile?.name}
//                                         </p>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               );
//                             }

//                             case "richtext":
//                               return (
//                                 <RichText
//                                   name={field.name}
//                                   label={field.label}
//                                   control={form.control}
//                                   tooltip={field.tooltip}
//                                   placeholder={field.placeholder}
//                                 />
//                               );

//                             case "rating":
//                               return (
//                                 <div className="flex gap-2 items-center">
//                                   {[1, 2, 3, 4, 5].map((num) => (
//                                     <button
//                                       key={num}
//                                       type="button"
//                                       onClick={() => f.onChange(num)}
//                                       className="text-2xl transition"
//                                     >
//                                       <Star
//                                         className={`${
//                                           num <= (f.value || 0)
//                                             ? "text-yellow-400 fill-yellow-400"
//                                             : "text-gray-400 dark:text-gray-500 fill-transparent"
//                                         }`}
//                                       />
//                                     </button>
//                                   ))}
//                                 </div>
//                               );

//                             default:
//                               return (
//                                 <Input
//                                   {...f}
//                                   placeholder={field.placeholder || ""}
//                                   className="border border-black/10 dark:border-white/10"
//                                 />
//                               );
//                           }
//                         })()}
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               ))}
//             </div>
//           );
//         })}

//         <div className="flex justify-end mt-4">
//           <Button type="submit" className="w-fit">
//             {submitLabel}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }
