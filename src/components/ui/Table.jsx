"use client";
import React from "react";

export default function Table({
  columns = [],
  data = [],
  headerColor = "bg-red-700",
  headerTextColor = "text-white",
  rowBg1 = "bg-white", // baris ganjil
  rowBg2 = "bg-gray-50", // baris genap
  hoverColor = "hover:bg-gray-100",
  textColor = "text-gray-800",
}) {

  const getAlignClass = (align) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      case "justify":
        return "text-justify";
      default:
        return "text-left";
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className={`${headerColor} ${headerTextColor}`}>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`p-3 font-semibold ${getAlignClass(col.align)}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={i}
                className={`${i % 2 === 0 ? rowBg1 : rowBg2} ${hoverColor}`}
              >
                {columns.map((col, j) => (
                  <td
                    key={j}
                    className={`p-3 ${textColor} ${getAlignClass(col.align)}`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500 italic"
              >
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
