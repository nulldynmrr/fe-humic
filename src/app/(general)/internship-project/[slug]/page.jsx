import { Suspense } from "react";
import ProjectInternship from "./ProjectInternship";
import axios from "axios";

export async function generateMetadata({ params }) {
  const Params = await params;
  const slug = Params?.slug;

  if (!slug) {
    return {
      title: "Internship Projects",
      description: "Daftar project internship Humic.",
      robots: { index: true, follow: true },
    };
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST}/api/project/slug/${slug}`
    );
    const project = response.data;

    return {
      title: `${project.title} | Project` || "Project Internship",
      description: project
        ? `Detail project internship: ${project.title}`
        : "Detail project internship Humic",
    };
  } catch (err) {
    console.error(err);
    return {
      title: "Project Internship",
      description: "Detail project internship Humic",
    };
  }
}

export default async function Page({ params }) {
  const Params = await params;

  return (
    <Suspense fallback={null}>
      <ProjectInternship slug={Params?.slug} />
    </Suspense>
  );
}
