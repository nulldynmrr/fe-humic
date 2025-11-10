"use client";

import React from "react";
import { FaCalendarAlt, FaClock, FaBell } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { formatWaktu } from "@/utils/time";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Information({ type, data, loading = false }) {
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
    <section
      className="flex flex-col overflow-hidden min-h-full "
      aria-labelledby={`${type}-title`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          {icon}
          <h2 id={`${type}-title`} className="font-semibold text-lg">
            {title}
          </h2>
        </div>
        <Link
          href="#"
          className="text-sm text-primary flex items-center gap-1 font-medium"
        >
          Semua <MdOutlineKeyboardArrowRight />
        </Link>
      </div>

      <div className="p-4">
        {loading && <Skeleton />}

        {!loading && (!data || data.length === 0) && (
          <div className="text-center py-8 text-neut-500">
            <p>Belum ada {title.toLowerCase()} tersedia</p>
          </div>
        )}

        {!loading &&
          data &&
          data.length > 0 &&
          data.map((item, idx) => (
            <article
              key={idx}
              className={`mb-4 ${
                type !== "agenda" && type !== "berita" && idx !== 0
                  ? "pt-3 mt-[-20px]"
                  : ""
              }`}
            >
              <Link href={item.href || "#"} className="block">
                {idx === 0 && (type === "agenda" || type === "berita") ? (
                  <div className="relative w-full h-60 rounded-lg overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_HOST}${item.image_path}`}
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
                          <FaCalendarAlt />{" "}
                          <time dateTime={item.date}>
                            {formatWaktu(item.date, "date")}
                          </time>
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock /> {formatWaktu(item.date, "time")}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : type === "pengumuman" ? (
                  <div className="flex flex-col h-full bg-neut-50 p-4 rounded-md">
                    <h3 className="text-md font-medium text-neut-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary mt-2">
                      <FaBell />{" "}
                      <time dateTime={item.date}>{formatWaktu(item.date)}</time>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center border border-neut-300 rounded-md overflow-hidden min-w-14 min-h-14">
                      <div className="bg-primary border border-primary text-white w-full text-center py-1 text-[10px] font-semibold uppercase">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </div>
                      <div className="bg-white text-neut-900 text-sm font-bold py-1 w-full text-center">
                        {new Date(item.date).getDate()}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-md font-medium text-neut-900 line-clamp-2 h-1/2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary mt-2 h-1/2">
                        <FaClock />{" "}
                        <time dateTime={item.date}>
                          {formatWaktu(item.date)}
                        </time>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            </article>
          ))}
      </div>
    </section>
  );
}
