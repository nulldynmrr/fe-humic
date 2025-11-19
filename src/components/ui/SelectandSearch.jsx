"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import request from "@/utils/request";
import { toast } from "sonner";

export default function InputSelect({
  name,
  label,
  apiEndpoint,
  data = [],
  value,
  onChange,
  placeholder = "Pilih...",
  variant = "dropdown", // "dropdown" | "search"
  autoShow = true,
}) {
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (data.length > 0) {
        setOptions(data);
        return;
      }
      if (!apiEndpoint) return;

      try {
        const res = await request.get(apiEndpoint);
        setOptions(res.data || []);
      } catch (err) {
        toast.error("Gagal mengambil data opsi");
        setOptions([]);
      }
    };
    fetchData();
  }, [apiEndpoint, data]);

  const filtered = options.filter((opt) => {
    const labelText = (opt.label || opt.name || "").toLowerCase();
    return labelText.includes(search.toLowerCase());
  });

  const selectedLabel =
    options.find(
      (opt) => opt.value === value || opt.id === value || opt.name === value
    )?.label ||
    options.find(
      (opt) => opt.value === value || opt.id === value || opt.name === value
    )?.name ||
    "";

  return (
    <div className="relative">
      {label && (
        <label className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      <Input
        type="text"
        name={name}
        placeholder={placeholder}
        value={variant === "search" ? search : search || selectedLabel}
        readOnly={variant === "dropdown" && !showOptions}
        onChange={(e) => {
          const val = e.target.value;
          setSearch(val);
          if (variant === "search") setShowOptions(true);
        }}
        onFocus={() => autoShow && setShowOptions(true)}
        onClick={() =>
          variant === "dropdown" && setShowOptions((prev) => !prev)
        }
        onBlur={() => setTimeout(() => setShowOptions(false), 150)}
        className="cursor-pointer mt-2"
      />

      {showOptions && (
        <ul className="absolute z-10 w-full bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((opt, idx) => (
              <li
                key={idx}
                onMouseDown={() => {
                  onChange?.(opt.value || opt.id || opt.name);
                  setSearch("");
                  setShowOptions(false);
                }}
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-200/20 cursor-pointer"
              >
                {opt.label || opt.name}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-500">Tidak ada hasil</li>
          )}
        </ul>
      )}
    </div>
  );
}
