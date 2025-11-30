"use client";

import { Suspense, use } from "react";
import ArticleContent from "@/app/(general)/articles/[slug]/pageContent";

function ArticleWrapper({ params }) {
  const { slug } = use(params);
  return <ArticleContent slug={slug} />;
}

export default function Page({ params }) {
  return (
    <Suspense fallback={null}>
      <ArticleWrapper params={params} />
    </Suspense>
  );
}
