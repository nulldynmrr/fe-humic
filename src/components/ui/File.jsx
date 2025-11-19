"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function InputFile({
  label,
  name,
  accept = ".jpg,.jpeg,.png",
  value,
  onChange,
  placeholder = "Drag & drop file atau klik untuk upload",
  maxSizeMB = 5,
}) {
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileSizeInfo, setFileSizeInfo] = useState("");
  const [fileValid, setFileValid] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (value instanceof File) {
      setFileName(value.name);
      setPreviewUrl(URL.createObjectURL(value));
      const sizeMB = (value.size / (1024 * 1024)).toFixed(2);
      setFileSizeInfo(`Ukuran file: ${sizeMB} MB`);
      setFileValid(true);
    } else {
      setFileName("");
      setPreviewUrl(null);
      setFileSizeInfo("");
      setFileValid(null);
    }
  }, [value]);

  // const validateFile = (file) => {
  //   if (!file) return false;

  //   const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
  //   const allowedExtensions = [".jpg", ".jpeg", ".png"];
  //   const ext = "." + file.name.split(".").pop().toLowerCase();

  //   if (!allowedExtensions.includes(ext)) {
  //     toast.error("Gunakan format JPG, JPEG, atau PNG.");
  //     setFileSizeInfo(`Format tidak didukung`);
  //     setFileValid(false);
  //     return false;
  //   }

  //   if (file.size > maxSizeMB * 1024 * 1024) {
  //     toast.error(`Ukuran file melebihi ${maxSizeMB} MB`);
  //     setFileSizeInfo(
  //       `Ukuran file: ${fileSizeMB} MB (Melebihi ${maxSizeMB} MB)`
  //     );
  //     setFileValid(false);
  //     return false;
  //   }

  //   setFileSizeInfo(`Ukuran file: ${fileSizeMB} MB`);
  //   setFileValid(true);
  //   return true;
  // };

  const handleFileSelect = (file) => {
    if (!file) {
      console.log("No File selected");
      onChange(null);
      return;
    }

    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    console.log("File extension:", ext);

    if (!allowedExtensions.includes(ext)) {
      toast.error("Gunakan format JPG, JPEG, atau PNG.");
      setFileValid(false);
      setFileSizeInfo("Format tidak didukung");
      onChange(null);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      console.log("File too large:", sizeMB, "MB");
      toast.error(`Ukuran file melebihi ${maxSizeMB} MB`);
      setFileValid(false);
      setFileSizeInfo(`Ukuran file: ${sizeMB} MB (Melebihi ${maxSizeMB} MB)`);
      onChange(null);
      return;
    }

    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setFileValid(true);
    setFileSizeInfo(
      `Ukuran file: ${(file.size / (1024 * 1024)).toFixed(2)} MB`
    );
    onChange(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setFileName("");
    setPreviewUrl(null);
    setFileSizeInfo("");
    setFileValid(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium">
          {label}
          <span className="text-red-500">*</span>
        </label>
      )}

      <div
        onClick={() => {
          console.log("Div clicked, triggering file input");
          fileInputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          handleFileSelect(file);
        }}
        className={`relative w-full border-2 py-6 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging
            ? " bg-gray-500"
            : " border border-black/10 dark:border-white/10"
        }`}
      >
        <input
          ref={fileInputRef}
          id={name}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center pointer-events-none">
          {!previewUrl ? (
            <>
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
                {placeholder}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300 text-center">
                Format file .jpg, .jpeg, dan .png
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center mx-8">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover mb-2 rounded-md shadow"
              />
              <p className="text-xs text-gray-600 dark:text-gray-300 text-center truncate max-w-[180px]">
                {fileName}
              </p>
            </div>
          )}
        </div>

        {fileName && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            title="Hapus file"
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {fileSizeInfo && (
        <div
          className={`flex items-center gap-2 mt-1 text-sm ${
            fileValid ? "text-green-600" : "text-red-500"
          }`}
        >
          {fileValid ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <span>{fileSizeInfo}</span>
        </div>
      )}
    </div>
  );
}
