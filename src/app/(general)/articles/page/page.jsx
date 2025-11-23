"use client";

import { Suspense } from "react";
import Article from "@/app/(general)/articles/page/pageContent";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Article />
    </Suspense>
  );
}
