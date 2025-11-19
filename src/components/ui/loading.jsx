"use client";

import React from "react";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}
