import { Suspense } from "react";
import Agenda from "./Agenda";
import axios from "axios";

export async function generateMetadata({ params }) {
  const Params = await params;
  const slug = Params?.slug;

  if (!slug) {
    return {
      title: "Agenda Humic",
      description: "Daftar agenda Humic.",
      robots: { index: true, follow: true },
    };
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST}/api/agenda/slug/${slug}`
    );
    const agenda = response.data;

    return {
      title: `${agenda.title} | Agenda` || "Agenda Humic",
      description: agenda
        ? `Detail agenda: ${agenda.title}`
        : "Detail agenda Humic",
    };
  } catch (err) {
    console.error(err);
    return {
      title: "Agenda Humic",
      description: "Detail agenda Humic",
    };
  }
}

export default async function Page({ params }) {
  const Params = await params;

  return (
    <Suspense fallback={null}>
      <Agenda slug={Params?.slug} />
    </Suspense>
  );
}
