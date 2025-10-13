import { FaQuoteRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

export default function Feedback({
  name,
  role,
  university,
  feedback,
  rating,
}) {
  return (
    <div className="w-[350px] h-full min-h-[220px] p-5 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between">
      <div className="flex space-x-1 text-[#E76923] mb-3">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i}>{i < rating ? <FaStar /> : <FaRegStar />}</span>
          ))}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1">
        {feedback}
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
