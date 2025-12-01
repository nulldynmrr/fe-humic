import { Suspense } from "react";
import StaffMember from "./Profile";
import axios from "axios";

export async function generateMetadata({ params }) {
  const id = params?.id;

  if (!id) {
    return {
      title: "Internship Projects",
      description: "Daftar project internship Humic.",
      robots: { index: true, follow: true },
    };
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST}/api/staff/id/${id}`
    );
    const project = response.data;

    return {
      title: `${project.title} | Staff` || "Staff Member",
      description: project
        ? `Detail staff: ${project.title}`
        : "Detail staff Humic",
    };
  } catch (err) {
    console.error(err);
    return {
      title: "Staff Member",
      description: "Detail Staff Member Humic",
    };
  }
}

export default function Page({ params }) {
  return (
    <Suspense fallback={null}>
      <StaffMember id={params.id} />
    </Suspense>
  );
}
