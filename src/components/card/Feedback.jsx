import { useState } from "react";
import {
  FaQuoteRight,
  FaStar,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

export function CardFeedback({
  name,
  role,
  university,
  content,
  rating,
  onClick,
}) {
  const maxLength = 150;
  const truncatedContent =
    content.length > maxLength ? content.slice(0, maxLength) + "..." : content;

  return (
    <div
      className="w-[350px] h-full min-h-[220px] p-5 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex space-x-1 text-[#E76923] mb-3">
        {[...Array(5)].map((_, i) => (
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

function FeedbackModal({ feedbacks, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? feedbacks.length - 1 : prev - 1));

  const next = () =>
    setCurrent((prev) => (prev === feedbacks.length - 1 ? 0 : prev + 1));

  const currentFeedback = feedbacks[current];

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-6 overflow-auto">
      <div className="relative max-w-2xl w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={26} />
        </button>

        <div className="flex space-x-1 text-[#E76923] mb-5">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-2xl">
              {i < currentFeedback.rating ? <FaStar /> : <FaRegStar />}
            </span>
          ))}
        </div>

        <p className="text-base text-gray-700 leading-relaxed mb-6">
          {currentFeedback.content}
        </p>

        <div className="flex justify-between items-end">
          <div>
            <h3 className="font-bold text-xl text-gray-900">
              {currentFeedback.name}
            </h3>
            <p className="text-sm text-gray-600">{currentFeedback.role}</p>
            <p className="text-sm text-primary font-medium">
              {currentFeedback.university}
            </p>
          </div>
          <FaQuoteRight className="text-primary opacity-80 text-4xl" />
        </div>

        {feedbacks.length > 1 && (
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
            <button
              onClick={prev}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary"
            >
              <FaChevronLeft />
              <span>Previous</span>
            </button>

            <div className="text-sm text-gray-500">
              {current + 1} / {feedbacks.length}
            </div>

            <button
              onClick={next}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary"
            >
              <span>Next</span>
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CardFeedbackCarousel({ feedbacks = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  if (!feedbacks.length) {
    return <p className="text-center text-gray-500">No feedback available</p>;
  }

  return (
    <>
      {feedbacks.map((fb, index) => (
        <div key={index} className="shrink-0 snap-start">
          <CardFeedback {...fb} onClick={() => setSelectedIndex(index)} />
        </div>
      ))}
      {selectedIndex !== null && (
        <FeedbackModal
          feedbacks={feedbacks}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
