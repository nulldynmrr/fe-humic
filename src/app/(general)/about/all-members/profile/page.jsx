"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import Profile from "@/components/card/Profile";
import { Skeleton } from "@/components/ui/Skeleton";

import request from "@/utils/request";
import toast from "react-hot-toast";

const Profiles = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [staffs, setStaffs] = useState([]);
  const [staffbyID, setStaffbyID] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAllStaff = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/staff");
      setStaffs(response.data);
    } catch (err) {
      if (err.response) {
        setStaffs([]);
      } else {
        toast.error("Gagal mengambil data staff");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStaffbyID = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await request.get(`/staff/${id}`);
      setStaffbyID(response.data);
    } catch (err) {
      if (err.response) {
        setStaffbyID(null);
      } else {
        toast.error("Gagal mengambil data staff");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStaff();
  }, [fetchAllStaff]);

  useEffect(() => {
    if (id) fetchStaffbyID(id);
  }, [id, fetchStaffbyID]);

  const staff = id ? staffbyID : staffs[0];

  if (!staff) {
    return (
      <div className="min-h-screen text-white flex justify-center items-center px-6 py-12">
        <p className="text-gray-400 text-xl">
          {loading ? <Skeleton /> : "Staff tidak ditemukan."}
        </p>
      </div>
    );
  }

  return (
    <section className="px-4 py-8 md:px-12 min-h-screen text-white flex flex-col justify-center items-center space-y-8 mt-[50px]">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="relative w-[280px] h-[280px] md:w-[300px] md:h-[300px] flex-shrink-0 overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_HOST}${staff.image_path} `}
            alt={staff.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col text-left space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-neut-900">
              {staff.name}
            </h1>
            <p className="text-neut-600">{staff.position}</p>
          </div>

          <p className="text-neut-600 leading-relaxed max-w-3xl">
            {staff.description}
          </p>

          <hr className="border-[#CCCCCC] my-2" />

          <div>
            <h2 className="text-lg font-semibold text-neut-900 mb-1">
              Education
            </h2>
            <p className="text-neut-600">{staff.education}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neut-900 mb-1">
              Publications
            </h2>
            <p className="text-neut-600 leading-relaxed">
              {staff.publications}
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-black mt-12">Our staffs</h1>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {staffs.slice(0, 4).map((s) => (
          <Profile key={s.id} {...s} shape="square" />
        ))}
      </div>
      <Link
        href="/about/all-members"
        className="flex items-center gap-2 text-xl text-primary font-semibold hover:underline transition-all duration-300"
      >
        See all staffs
        <FiArrowUpRight className="text-2xl" />
      </Link>
    </section>
  );
};

export default Profiles;
