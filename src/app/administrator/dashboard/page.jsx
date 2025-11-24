"use client";
import React, { useState, useEffect, useCallback } from "react";
import { DollarSign, Users } from "lucide-react";
import request from "@/utils/request";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResearchProjects: 0,
    totalInternshipMember: 0,
    totalWarpInternshipMember: 0,
    totalProjects: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState({
    salesThisMonth: 0,
    activities: [],
  });
  const [loading, setLoading] = useState(false);
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  const fetchResearchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/project");
      setStats((prev) => ({
        ...prev,
        totalResearchProjects: Array.isArray(response.data)
          ? response.data.length
          : 0,
      }));
    } catch (err) {
      toast.error("Gagal memuat data research projects");
      setStats((prev) => ({ ...prev, totalResearchProjects: 0 }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInternshipMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/intern");
      setStats((prev) => ({
        ...prev,
        totalInternshipMember: Array.isArray(response.data)
          ? response.data.length
          : 0,
      }));
    } catch (err) {
      toast.error("Gagal memuat data internship members");
      setStats((prev) => ({ ...prev, totalInternshipMember: 0 }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWarpInternshipMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/warp-internship-members");
      setStats((prev) => ({
        ...prev,
        totalWarpInternshipMember: Array.isArray(response.data)
          ? response.data.length
          : 0,
      }));
    } catch (err) {
      toast.error("Gagal memuat data warp internship members");
      setStats((prev) => ({ ...prev, totalWarpInternshipMember: 0 }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTotalProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/project");
      setStats((prev) => ({
        ...prev,
        totalProjects: Array.isArray(response.data) ? response.data.length : 0,
      }));
    } catch (err) {
      toast.error("Gagal memuat data total projects");
      setStats((prev) => ({ ...prev, totalProjects: 0 }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectActivity = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/project-activity");
      setChartData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      toast.error("Gagal memuat data project activity");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentActivities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await request.get("/recent-activities");
      setRecentActivities(
        response.data || { salesThisMonth: 0, activities: [] }
      );
    } catch (err) {
      toast.error("Gagal memuat data recent activities");
      setRecentActivities({ salesThisMonth: 0, activities: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoadingAll(true);
      await Promise.all([
        fetchResearchProjects(),
        fetchInternshipMembers(),
        fetchWarpInternshipMembers(),
        fetchTotalProjects(),
        fetchProjectActivity(),
        fetchRecentActivities(),
      ]);
      setIsLoadingAll(false);
    };
    fetchAll();
  }, [
    fetchResearchProjects,
    fetchInternshipMembers,
    fetchWarpInternshipMembers,
    fetchTotalProjects,
    fetchProjectActivity,
    fetchRecentActivities,
  ]);

  const chartConfig = {
    value: {
      label: "Activity",
      color: "#b4272c",
    },
  };

  const tabs = ["Overview", "Analytics", "Reports", "Notifications"];

  if (isLoadingAll) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600 dark:text-gray-300">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Dashboard
          </h1>
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Download
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-300 dark:border-white/20">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 dark:text-white/20 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Research Projects",
              value: `${stats.totalResearchProjects} projects`,
              icon: <DollarSign className="h-5 w-5 text-gray-400" />,
              desc: "Proyek riset aktif dan selesai.",
            },
            {
              title: "Total Internship Member",
              value: `${stats.totalInternshipMember} member`,
              icon: <Users className="h-5 w-5 text-gray-400" />,
              desc: "Jumlah member internship humic",
            },
            {
              title: "Total Warp Internship Member",
              value: `${stats.totalWarpInternshipMember} member`,
              icon: <Users className="h-5 w-5 text-gray-400" />,
              desc: "Jumlah member warp internship humic",
            },
            {
              title: "Total Projects",
              value: `${stats.totalProjects} projects`,
              icon: <DollarSign className="h-5 w-5 text-gray-400" />,
              desc: "Jumlah semua project",
            },
          ].map((card, idx) => (
            <Card
              key={idx}
              className="bg-sidebar border border-black/10 dark:border-white/10"
            >
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-black dark:text-white">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-black dark:text-white">
                  {card.value}
                </div>
                <p className="text-xs text-gray-400 dark:text-white/20 mt-1">
                  {card.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-sidebar border border-black/10 dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">
                Project Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#d2d2d1"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#777774", fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#777774", fontSize: 12 }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="value"
                        fill="#b4272c"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-400 dark:text-white/20">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-sidebar border border-black/10 dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">
                Recent Activities
              </CardTitle>
              <CardDescription className="text-gray-400 dark:text-white/20">
                You made {recentActivities.salesThisMonth} sales this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.activities &&
              recentActivities.activities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-black dark:text-white">
                          {activity.initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black dark:text-white">
                          {activity.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-white/20 truncate">
                          {activity.email}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-success">
                        +${activity.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-gray-400 dark:text-white/20">
                  No activities
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
