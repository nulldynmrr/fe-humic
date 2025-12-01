import { Suspense } from "react";
import Profile from "./Profile";
import axios from "axios";

export async function generateMetadata({ params }) {
  const { id } = params;
  console.log(id);

  if (!id) {
    return {
      title: "Snpmtaff Member",
      description: "Staff Member Humic.",
      robots: { index: true, follow: true },
    };
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST}/api/staff/${id}`
    );
    const staff = response.data;

    return {
      title: staff?.name ? `${staff.name} | Staff` : "Staff Member",
      description: staff?.name
        ? `Profil staff: ${staff.name}`
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
  const { id } = params;

  return (
    <Suspense fallback={null}>
      <Profile id={id} />
    </Suspense>
  );
}
