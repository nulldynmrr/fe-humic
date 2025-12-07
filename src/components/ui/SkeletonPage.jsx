"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ArticlePageSkeleton() {
  return (
    <div className="min-h-screen px-4 md:px-20 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>

        <Skeleton className="h-8 w-[70%]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-64 md:h-80 w-full rounded-md" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-[120px]" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        <Skeleton className="h-7 w-[200px] mt-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-md" />
          ))}
        </div>
      </div>

      <div className="space-y-10">
        <div>
          <Skeleton className="h-6 w-[120px] mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-20 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-6 w-[120px] mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-16 w-20 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-6 w-[140px] mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded-md space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectInternshipSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Skeleton className="h-5 w-[200px]" />
      <Skeleton className="h-7 w-[300px]" />
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="w-full h-64 md:h-94 rounded-md" />

      <div className="flex items-center gap-2 mt-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>

      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>

      <Skeleton className="h-7 w-[200px] mt-10" />

      <div className="border rounded-md overflow-hidden mt-2">
        <div className="grid grid-cols-3 bg-red-700 text-white text-center py-2">
          <Skeleton className="h-6 mx-auto w-20 bg-red-600" />
          <Skeleton className="h-6 mx-auto w-20 bg-red-600" />
          <Skeleton className="h-6 mx-auto w-20 bg-red-600" />
        </div>

        <div className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-3 py-4 px-2">
              <Skeleton className="h-4 mx-auto w-24" />
              <Skeleton className="h-4 mx-auto w-24" />
              <Skeleton className="h-4 mx-auto w-24" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="h-7 w-[240px] mt-10 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
