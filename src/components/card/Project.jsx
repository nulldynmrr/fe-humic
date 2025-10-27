"use client";
import { FaCalendarAlt } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

export default function Project({ data = [], onClick }) {
  return (
    <div className="flex flex-wrap gap-6 justify-start mt-6">
      {data.length > 0 ? (
        data.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onClick?.(item)}
            className="w-full md:w-[300px] overflow-hidden transition-shadow duration-300 cursor-pointer"
          >
            <div className="w-full h-[180px] bg-gray-200 rounded-xl">
              <img
                src={
                  item.image ||
                  "https://via.placeholder.com/400x200?text=Project+Image"
                }
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 flex flex-col justify-between min-h-[130px]">
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                <span>{item.date}</span>
              </div>

              <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 mb-4">
                {item.title}
              </h3>

              <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition">
                <FiArrowUpRight className="text-gray-700 text-sm" />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-left w-full">
          Belum ada proyek untuk ditampilkan.
        </p>
      )}
    </div>
  );
}
