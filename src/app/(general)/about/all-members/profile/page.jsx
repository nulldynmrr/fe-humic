import Profiles from "@/app/(general)/about/all-members/profile/Profile";
import request from "@/utils/request";

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  if (!id) {
    return {
      title: "Staff Profiles",
      description: "Daftar profil staff Humic.",
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  try {
    const res = await request.get(`/staff/${id}`);
    const staff = res.data;

    return {
      title: `${staff.name} | Staff Profile`,
      description: staff.description?.slice(0, 150) || "Profil staff Humic.",
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (err) {
    return {
      title: "Staff Not Found",
      description: "Profil staff tidak ditemukan.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default function Page() {
  return <Profiles />;
}
