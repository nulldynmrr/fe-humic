"use client";

import { useState } from "react";
import { FaQuoteRight, FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// ====================
// Single Feedback Card
// ====================
function CardFeedback({ name, role, university, content, rating, onClick }) {
  const maxLength = 150;
  const truncatedContent =
    content.length > maxLength ? content.slice(0, maxLength) + "..." : content;

  return (
    <div
      className="w-[350px] h-full min-h-[220px] p-5 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between cursor-pointer"
      onClick={onClick}
    >
      <div className="flex space-x-1 text-[#E76923] mb-3">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i}>{i < rating ? <FaStar /> : <FaRegStar />}</span>
          ))}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1">
        {truncatedContent}
      </p>

      <div className="flex justify-between items-end">
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-xs text-gray-600">{role}</p>
          <p className="text-xs text-primary font-medium">{university}</p>
        </div>
        <FaQuoteRight className="text-primary opacity-80 text-2xl" />
      </div>
    </div>
  );
}

// ====================
// Modal Full Content
// ====================
function FeedbackModal({ name, role, university, content, rating, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[400px] max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 font-bold"
        >
          ✕
        </button>
        <div className="flex space-x-1 text-[#E76923] mb-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <span key={i}>{i < rating ? <FaStar /> : <FaRegStar />}</span>
            ))}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{content}</p>
        <div className="flex justify-between items-end">
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-600">{role}</p>
            <p className="text-xs text-primary font-medium">{university}</p>
          </div>
          <FaQuoteRight className="text-primary opacity-80 text-2xl" />
        </div>
      </div>
    </div>
  );
}

// ====================
// Feedback Carousel
// ====================
export default function FeedbackCarousel({ feedbacks = [] }) {
  const [current, setCurrent] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  if (!feedbacks.length) return <p className="text-center text-gray-500">No feedback available</p>;

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? feedbacks.length - 1 : prev - 1));
  const next = () =>
    setCurrent((prev) => (prev === feedbacks.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative flex items-center justify-center space-x-4">
      {/* Previous Button */}
      <button
        onClick={prev}
        className="absolute left-0 text-gray-500 hover:text-gray-700 z-10"
      >
        <FaChevronLeft size={24} />
      </button>

      {/* Feedback Cards */}
      <div className="flex space-x-4 overflow-hidden">
        {feedbacks.map((fb, index) => (
          <div
            key={index}
            className={`transition-transform duration-300 ${
              index === current
                ? "translate-x-0 relative opacity-100"
                : "translate-x-[400px] absolute opacity-0"
            }`}
          >
            <CardFeedback
              {...fb}
              onClick={() => setSelectedFeedback(fb)}
            />
          </div>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={next}
        className="absolute right-0 text-gray-500 hover:text-gray-700 z-10"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Modal */}
      {selectedFeedback && (
        <FeedbackModal
          {...selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </div>
  );
}
