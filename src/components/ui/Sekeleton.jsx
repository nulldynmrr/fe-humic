"use client";

import React from "react";

const Skeleton = ({
  count = 1,
  width = "100%",
  height = "20px",
  borderRadius = "4px",
  gap = "8px",
  className = "",
}) => {
  const items = Array.from({ length: count });

  return (
    <div className={`flex flex-col ${className}`} style={{ gap }}>
      {items.map((_, idx) => (
        <div
          key={idx}
          className="bg-gray-200 animate-pulse"
          style={{
            width,
            height,
            borderRadius,
          }}
        />
      ))}
    </div>
  );
};

export default Skeleton;
