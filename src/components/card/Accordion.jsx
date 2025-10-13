"use client";
import { useState, useEffect } from "react";
import { LuCircleMinus } from "react-icons/lu";
import { IoMdAddCircleOutline } from "react-icons/io";

export default function Accordion({ question, answer, index }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (index === 0) setIsOpen(true);
  }, [index]);

  return (
    <div className="border border-[#EAEAEA] rounded-lg mb-3 bg-white overflow-hidden">
      <button
        className="w-full flex justify-between items-center px-5 py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`font-medium text-md transition-colors duration-200 ${
            isOpen ? "text-black" : "text-gray-800"
          }`}
        >
          {question}
        </span>
        <span className="text-primary text-md">
          {isOpen ? <LuCircleMinus /> : <IoMdAddCircleOutline />}
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0"
        } overflow-hidden px-5 text-neut-500 text-md leading-relaxed`}
      >
        {answer}
      </div>
    </div>
  );
}
