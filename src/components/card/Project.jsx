"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatWaktu } from "@/utils/time";
import { FaCalendarAlt } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

export default function Project({ data = [] }) {
  const pathname = usePathname();
  const basePath = pathname.includes("articles")
    ? "/articles"
    : "/internship-project";
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {data.length > 0 ? (
        data.map((item, idx) => (
          <Link
            key={`${item.id}-${idx}`}
            href={`${basePath}/page?id=${item.id}`}
            className="w-full overflow-hidden transition-shadow duration-300 cursor-pointer"
          >
            <div className="w-full h-[180px] bg-gray-200 rounded-md overflow-hidden">
              <img
                src={`${process.env.NEXT_PUBLIC_HOST}${item.image_path}`}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center text-gray-600 text-sm font-semibold">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                {item.created_at ? formatWaktu(item.created_at, "date") : "-"}
              </div>

              <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 mb-2">
                {item.title}
              </h3>

              <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition">
                <FiArrowUpRight className="text-gray-700 text-sm" />
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-gray-500 text-left w-full">
          Belum ada proyek untuk ditampilkan.
        </p>
      )}
    </div>
  );
}
