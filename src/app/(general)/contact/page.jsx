"use client";
import React from "react";
import dynamic from "next/dynamic";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-neut-100 flex items-center justify-center">
      <p className="text-neut-600">Loading map...</p>
    </div>
  ),
});

const Contact = () => {
  return (
    <div className="px-4 py-8 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center">
        <div className="bg-neut-50 flex flex-col items-center justify-center p-8">
          <FaMapMarkerAlt className="text-primary text-4xl mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Telkom University Bandung
          </h3>
          <p className="text-neut-600">Gedung F</p>
        </div>

        <div className="bg-neut-50 flex flex-col items-center justify-center p-8">
          <FaPhoneAlt className="text-primary text-4xl mb-4" />
          <p className="text-neut-700 mb-1">humic@telkomuniversity.ac.id</p>
          <p className="text-neut-700">(022) 000-000-000</p>
        </div>

        <div className="bg-neut-50 flex flex-col items-center justify-center p-8">
          <FaClock className="text-primary text-4xl mb-4" />
          <p className="text-neut-700 mb-1">Mon-Fri: 9 AM - 3 PM</p>
        </div>
      </div>

      <div className="overflow-hidden">
        <Map />
      </div>
    </div>
  );
};

export default Contact;
