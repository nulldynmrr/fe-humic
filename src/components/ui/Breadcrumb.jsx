"use client";
import Link from "next/link";
import { MdOutlineChevronRight } from "react-icons/md";

const Breadcrumb = ({ items }) => {
  return (
    <div className="text-sm text-primary mb-4 flex items-center gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="font-semibold cursor-pointer">
              {item.label}
            </Link>
          ) : (
            <span className="text-neut-400">{item.label}</span>
          )}
          {index < items.length - 1 && <MdOutlineChevronRight />}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
