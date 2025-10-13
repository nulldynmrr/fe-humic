"use client";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const ChecklistItem = ({
  items = [],
  iconColor = "text-primary",
  textColor = "text-[#12141D]",
}) => {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <FaCheckCircle className={`${iconColor} mt-1`} size={18} />
          <span className={`${textColor} text-md md:text-xl`}>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default ChecklistItem;
