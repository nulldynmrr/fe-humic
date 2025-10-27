"use client";
import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
import Profile from "@/components/card/Profile";

import request from "@/utils/request";
import toast from "react-hot-toast";

const AllMembers = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllStaff = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/staff");
      setStaffs(response.data);
    } catch (err) {
      if (err.response) {
        toast.dismiss();
        setStaffs([]);
      } else {
        toast.error("Gagal memuat data staff");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStaff();
  }, [fetchAllStaff]);

  console.log(staffs);
  return (
    <>
      <Header
        title="All Members Humic Engineering"
        imageSrc="/assets/bg-header.png"
      />

      <section className="px-4 py-8 md:px-12 h-full md:min-h-[600px] flex flex-col justify-center items-center overflow-hidden gap-6">
        <h1 className="text-3xl font-bold text-black">Our Members</h1>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {staffs.map((staff) => (
            <Profile key={staff.id} {...staff} shape="square" />
          ))}
        </div>
      </section>
    </>
  );
};

export default AllMembers;
