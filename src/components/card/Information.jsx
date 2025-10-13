"use client";

import React from "react";
import { FaCalendarAlt, FaClock, FaBell } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function Information({ type, data }) {
  const icon =
    type === "agenda" ? (
      <FaCalendarAlt className="text-lg" />
    ) : type === "berita" ? (
      <FaClock className="text-lg" />
    ) : (
      <FaBell className="text-lg" />
    );

  const title =
    type === "agenda" ? "Agenda" : type === "berita" ? "Berita" : "Pengumuman";

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-semibold text-lg">{title}</h2>
        </div>
        <Link
          href="#"
          className="text-sm text-primary flex items-center gap-1 font-medium"
        >
          Semua <MdOutlineKeyboardArrowRight />
        </Link>
      </div>

      <div className="p-4">
        {type === "agenda" &&
          data.map((item, idx) => {
            if (idx === 0) {
              return (
                <Link href={item.href || "#"} key={idx} className="mb-4 block">
                  <div className="relative w-full h-60 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-2 p-2 ml-2 text-white border-l-2 border-l-primary">
                      <h3 className="text-lg font-semibold line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 text-md mt-1">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt /> {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock /> {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            } else {
              return (
                <Link
                  href={item.href || "#"}
                  key={idx}
                  className="flex items-start gap-3 pt-3 mt-3"
                >
                  <div className="flex flex-col items-center border border-neut-300 rounded-md overflow-hidden min-w-14 min-h-14">
                    <div className="bg-primary border border-primary z-100 text-white w-full text-center py-1 text-[10px] font-semibold uppercase">
                      {item.month}
                    </div>
                    <div className="bg-white text-neut-900 text-sm font-bold py-1 w-full text-center">
                      {item.day}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-md font-medium text-neut-900 line-clamp-2 h-1/2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary mt-2 h-1/2">
                      <span className="flex items-center gap-1">
                        <FaClock /> {item.time}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }
          })}

        {type === "berita" &&
          data.map((item, idx) => (
            <Link
              href={item.href || "#"}
              key={idx}
              className={
                idx === 0 ? "mb-4 block" : "flex items-start gap-3 pt-3 mt-3"
              }
            >
              {idx === 0 ? (
                <div className="relative w-full h-60 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-2 p-2 ml-2 text-white border-l-2 border-l-primary">
                    <h3 className="text-lg font-semibold line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 text-md mt-1">
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt /> {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock /> {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-md font-medium text-neut-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary mt-2">
                      <FaClock /> {item.time}
                    </div>
                  </div>
                </>
              )}
            </Link>
          ))}

        {type === "pengumuman" &&
          data.map((item, idx) => (
            <Link
              href={item.href || "#"}
              key={idx}
              className={`flex flex-col bg-neut-50 p-4 rounded-md ${
                idx === 0 ? "border-none" : "pt-3 mt-3"
              }`}
            >
              <h3 className="text-md font-medium text-neut-900 line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary mt-2">
                <FaBell /> {item.date}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
