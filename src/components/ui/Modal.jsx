"use client";

import React from "react";
import { FaTimes, FaArrowRight, FaBullhorn, FaLaptop } from "react-icons/fa";

export const ModalAnnouncement = ({
  isOpen = false,
  onClose = () => {},
  onDaftar = () => {},
  onDone = () => {},
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[380px] md:w-[420px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={18} />
        </button>

        <div className="flex justify-center mb-4 text-yellow-500 text-3xl">
          <FaBullhorn />
        </div>

        <h2 className="text-lg font-bold mb-2 text-gray-900 text-center">
          Pendaftaran Program Magang HUMIC Telkom University!
        </h2>

        <p className="text-sm text-gray-700 mb-4 leading-relaxed text-center">
          Bergabunglah dalam Program Magang HUMIC dan jadilah bagian dari tim
          riset dan pengembangan inovasi berbasis Human-Centric Engineering.
          Dapatkan pengalaman langsung mengerjakan proyek nyata bersama mentor
          profesional!
        </p>

        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-2 text-sm text-gray-800">
            <FaLaptop className="mt-1" />
            <span>Bekerja langsung pada proyek riset dan pengembangan</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-gray-800">
            <FaLaptop className="mt-1" />
            <span>Bekerja langsung pada proyek riset dan pengembangan</span>
          </li>
        </ul>

        <div className="flex flex-col gap-3">
          <button
            onClick={onDaftar}
            className="text-red-600 text-sm font-medium hover:underline flex items-center justify-center gap-1"
          >
            Daftar Sekarang
            <FaArrowRight size={12} />
          </button>

          <button
            onClick={onDone}
            className="bg-red-700 text-white font-semibold py-2 rounded-lg hover:bg-red-800 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export const ModalChoice = ({
  isOpen = false,
  onClose = () => {},
  options = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[360px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-lg font-bold text-center mb-5 text-gray-900">
          Pilih Platform
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {options.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className="border rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 transition"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-semibold text-gray-800">
                {item.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
