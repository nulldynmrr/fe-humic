"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import request from "@/utils/request";

export default function ExportXlsxToJsonPage() {
  const [jsonData, setJsonData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiKeys = ["title", "content", "date", "image_path"];

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const mappedJson = rawJson.map((row) => {
          const obj = {};
          apiKeys.forEach((key) => {
            if (key === "date" && row[key]) {
              try {
                const dateValue = new Date(row[key]);
                obj[key] = isNaN(dateValue.getTime())
                  ? ""
                  : dateValue.toISOString();
              } catch {
                obj[key] = "";
              }
            } else if (row[key] !== undefined && row[key] !== null) {
              obj[key] = String(row[key]).trim();
            } else {
              obj[key] = "";
            }
          });
          return obj;
        });

        const validData = mappedJson.filter(
          (item) => item.title && item.title.length > 0
        );

        setJsonData(validData);

        if (validData.length === 0) {
          alert("Tidak ada data valid yang ditemukan.");
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Gagal membaca file. Pastikan format Excel benar.");
      }
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const handlePostData = useCallback(async () => {
    if (jsonData.length === 0) {
      alert("Tidak ada data untuk dikirim!");
      return;
    }

    setIsLoading(true);
    try {
      for (const item of jsonData) {
        const formData = new FormData();
        formData.append("title", item.title);
        formData.append("content", item.content);
        formData.append("date", item.date);

        if (item.image_path) {
          const response = await fetch(item.image_path);
          if (!response.ok)
            throw new Error("Gagal fetch file: " + item.image_path);
          const blob = await response.blob();
          const fileName = item.image_path.split("/").pop().split("?")[0];

          formData.append("image", blob, fileName);
        }

        await fetch("/pengumuman", {
          method: "POST",
          body: formData,
        });
      }

      alert(`Berhasil mengirim ${jsonData.length} data ke server!`);
      setJsonData([]);
      setFileName("");
    } catch (error) {
      console.error("Gagal mengirim data:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [jsonData]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Export XLSX ke JSON</h2>
      <p className="text-sm text-muted-foreground">
        Upload file Excel (.xlsx) lalu kirim hasil JSON ke server
      </p>

      <Input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
        className="w-full"
      />

      {fileName && (
        <p className="text-sm text-muted-foreground">
          File: <span className="font-medium">{fileName}</span>
        </p>
      )}

      {jsonData.length > 0 && (
        <>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm font-medium text-blue-900">
              {jsonData.length} data siap dikirim
            </p>
          </div>

          <div className="mt-4 max-h-64 overflow-auto border rounded-md p-2 bg-muted/30">
            <pre className="text-xs whitespace-pre-wrap break-all">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>

          <Button
            onClick={handlePostData}
            disabled={isLoading}
            className="mt-4 w-full"
          >
            {isLoading ? "Mengirim..." : "Kirim ke Server"}
          </Button>
        </>
      )}
    </div>
  );
}
