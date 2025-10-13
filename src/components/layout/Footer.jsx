"use client";
import React from "react";
import { FaRegCopyright } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neut-800 text-white py-3">
      <div className="flex items-center justify-center space-x-2 text-sm">
        <FaRegCopyright className="text-white" />
        <span>2025</span>
        <span className="text-primary font-medium">HUMIC RESEARCH CENTER</span>
      </div>
    </footer>
  );
}
