"use client";

import { Suspense } from "react";
import { ArticleContent } from "@/app/(general)/articles/page/pageContent";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ArticleContent />
    </Suspense>
  );
}
