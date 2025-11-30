"use client";

import { useState, useEffect, useRef } from "react";
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
  variant = "dropdown", // dropdown atau search
  autoShow = true,
}) {
  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!apiEndpoint) {
          setOptions(data);
          return;
        }

        if (data.length > 0) {
          setOptions(data);
          return;
        }

        const res = await request.get(apiEndpoint);
        const arr = Array.isArray(res.data) ? res.data : res.data?.data || [];

        const opts = arr.map((item) => ({
          label: item.title || item.name || item.label || `Item ${item.id}`,
          value: item.id,
          raw: item,
        }));

        setOptions(opts);
      } catch (err) {
        toast.error("Gagal mengambil data opsi");
        setOptions([]);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  const filtered = options.filter((opt) =>
    String(opt.label || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selected = options.find((opt) => String(opt.value) === String(value));

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      <Input
        type="text"
        name={name}
        placeholder={placeholder}
        value={search !== "" ? search : selected?.label || ""}
        readOnly={variant === "dropdown"}
        onChange={(e) => {
          const val = e.target.value;
          setSearch(val);
          if (variant === "search") setShowOptions(true);
        }}
        onFocus={() => autoShow && setShowOptions(true)}
        className="cursor-pointer mt-2"
      />

      {showOptions && (
        <ul className="absolute z-20 w-full bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((opt, idx) => (
              <li
                key={idx}
                onClick={() => {
                  onChange?.(opt.value);
                  setSearch("");
                  setShowOptions(false);
                }}
                className="px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-200/20 cursor-pointer"
              >
                {opt.label}
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
