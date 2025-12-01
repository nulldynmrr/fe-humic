import { Suspense } from "react";
import ProfileContent from "./Profile";
import request from "@/utils/request";

export async function generateMetadata({ params }) {
  const id = params?.id;

  if (!id)
    return {
      title: "Staff Profiles",
      description: "Daftar profil staff Humic.",
    };

  try {
    const response = await request.get(`/staff/${id}`);
    const staff = response.data;
    return {
      title: staff?.name || "Profil Staff",
      description: staff
        ? `Profil ${staff.name}, ${staff.position}`
        : "Detail staff Humic",
    };
  } catch {
    return { title: "Profil Staff", description: "Detail staff Humic" };
  }
}

export default function Page({ params }) {
  return (
    <Suspense fallback={null}>
      <ProfileContent id={params.id} />
    </Suspense>
  );
}
