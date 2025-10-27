"use client";
import { FaTimes, FaArrowRight } from "react-icons/fa";
import React from "react";

const Modal = ({
  isOpen = false,
  onClose = () => {},
  icon = null,
  title = "",
  description = "",
  listItems = [],
  primaryButton = { label: "Done", onClick: () => {} },
  secondaryButton = null,
  image = null,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[380px] md:w-[420px] p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={18} />
        </button>

        {icon && (
          <div className="flex justify-center mb-4 text-yellow-500 text-3xl">
            {icon}
          </div>
        )}

        {image && (
          <div className="w-full h-36 bg-gray-200 rounded-md mb-4 overflow-hidden">
            {typeof image === "string" ? (
              <img
                src={image}
                alt="modal visual"
                className="w-full h-full object-cover"
              />
            ) : (
              image
            )}
          </div>
        )}

        <h2 className="text-lg font-bold mb-2 text-gray-900">{title}</h2>

        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          {description}
        </p>

        {listItems.length > 0 && (
          <ul className="space-y-2 mb-4">
            {listItems.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-800"
              >
                {item.icon && <span className="mt-1">{item.icon}</span>}
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3 mt-6">
          {secondaryButton && (
            <button
              onClick={secondaryButton.onClick}
              className="text-red-600 text-sm font-medium hover:underline flex items-center justify-center gap-1"
            >
              {secondaryButton.label}
              <FaArrowRight size={12} />
            </button>
          )}

          <button
            onClick={primaryButton.onClick}
            className="bg-red-700 text-white font-semibold py-2 rounded-lg hover:bg-red-800 transition"
          >
            {primaryButton.label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
