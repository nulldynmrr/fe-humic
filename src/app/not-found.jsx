"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white">
      <div className="text-center max-w-xl">
        <h1 className="text-[96px] font-extrabold leading-none text-slate-900">
          404
        </h1>

        <p className="mt-2 text-sm font-medium text-slate-700">
          Page Not Found
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Halaman yang Anda cari tidak ditemukan <br />
          atau sudah dipindahkan.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm border text-slate-900 border-slate-300 rounded-xl bg-white shadow-sm"
          >
            Go Back
          </button>

          <Link
            href="/"
            className="px-4 py-2 text-sm rounded-xl bg-slate-900 text-white shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
