"use client";
import React, { useState, useEffect, useCallback } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import request from "@/utils/request";
import toast from "sonner";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResearchProjects: 0,
    totalInternshipMember: 0,
    totalStaff: 0,
    totalWarpInternshipMember: 0,
    totalVisitors: 0,
  });

  const [visitorData, setVisitorData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [logsAnalytics, setLogsAnalytics] = useState([]);
  const [recentActivities, setRecentActivities] = useState({
    salesThisMonth: 0,
    activities: [],
  });

  const [logsSummary, setLogsSummary] = useState({
    CREATE: 0,
    READ: 0,
    UPDATE: 0,
    DELETE: 0,
  });

  const [visitorFilter, setVisitorFilter] = useState("7d");
  const [logsFilter, setLogsFilter] = useState("7d");

  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const obs = new MutationObserver(checkDarkMode);
    obs.observe(document.documentElement, { attributes: true });

    return () => obs.disconnect();
  }, []);

  const fetchAllProject = useCallback(async () => {
    try {
      const res = await request.get("/project");
      setStats((prev) => ({
        ...prev,
        totalResearchProjects: res.data?.length || 0,
      }));
    } catch {
      setStats((prev) => ({ ...prev, totalResearchProjects: 0 }));
    }
  }, []);

  const fetchAllIntern = useCallback(async () => {
    try {
      const res = await request.get("/intern");
      setStats((prev) => ({
        ...prev,
        totalInternshipMember: res.data?.length || 0,
      }));
    } catch {
      setStats((prev) => ({ ...prev, totalInternshipMember: 0 }));
    }
  }, []);

  const fetchAllStaff = useCallback(async () => {
    try {
      const res = await request.get("/staff");
      setStats((prev) => ({
        ...prev,
        totalStaff: res.data?.length || 0,
      }));
    } catch {
      setStats((prev) => ({ ...prev, totalStaff: 0 }));
    }
  }, []);

  // const fetchWarpInternshipMembers = useCallback(async () => {
  //   try {
  //     const res = await request.get("/");
  //     setStats((prev) => ({
  //       ...prev,
  //       totalWarpInternshipMember: res.data?.length || 0,
  //     }));
  //   } catch {
  //     setStats((prev) => ({ ...prev, totalWarpInternshipMember: 0 }));
  //   }
  // }, []);

  // const fetchProjectActivity = useCallback(async () => {
  //   try {
  //     const res = await request.get("/project-activity");
  //     setChartData(res.data || []);
  //   } catch {
  //     setChartData([]);
  //   }
  // }, []);

  // const fetchRecentActivities = useCallback(async () => {
  //   try {
  //     const res = await request.get("/");
  //     setRecentActivities(res.data || { salesThisMonth: 0, activities: [] });
  //   } catch {
  //     setRecentActivities({ salesThisMonth: 0, activities: [] });
  //   }
  // }, []);

  // const fetchVisitorAnalytics = useCallback(async (filter = "7d") => {
  //   try {
  //     const res = await request.get(`/?period=${filter}`);
  //     const data = Array.isArray(res.data) ? res.data : [];
  //     setVisitorData(data);

  //     const total = data.reduce((sum, i) => sum + (i.visits || 0), 0);

  //     setStats((prev) => ({ ...prev, totalVisitors: total }));
  //   } catch {
  //     setVisitorData([]);
  //   }
  // }, []);

  const fetchLogsAnalytics = useCallback(async (filter = "7d") => {
    try {
      const res = await request.get("/logs");
      let data = Array.isArray(res.data) ? res.data : [];

      const now = new Date();
      const daysMap = { today: 1, "7d": 7, "30d": 30, "90d": 90 };
      const days = daysMap[filter] || 7;

      const filtered = data.filter((log) => {
        const diff = (now - new Date(log.created_at)) / 86400000;
        return diff <= days;
      });

      const grouped = filtered.reduce((acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {});

      const arr = Object.entries(grouped).map(([action, count]) => ({
        action,
        count,
      }));

      setLogsAnalytics(arr);

      const summary = {
        CREATE: filtered.filter((l) => l.action === "CREATE").length,
        READ: filtered.filter((l) => l.action === "READ").length,
        UPDATE: filtered.filter((l) => l.action === "UPDATE").length,
        DELETE: filtered.filter((l) => l.action === "DELETE").length,
      };

      setLogsSummary(summary);
    } catch {
      setLogsAnalytics([]);
      setLogsSummary({ CREATE: 0, READ: 0, UPDATE: 0, DELETE: 0 });
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoadingAll(true);
      await Promise.all([
        fetchAllProject(),
        fetchAllIntern(),
        fetchAllStaff(),
        fetchLogsAnalytics(logsFilter),
      ]);
      setIsLoadingAll(false);
    };
    load();
  }, [
    fetchAllProject,
    fetchAllStaff,
    fetchLogsAnalytics,
    visitorFilter,
    logsFilter,
  ]);

  const COLORS = {
    CREATE: "#10b981",
    UPDATE: "#3b82f6",
    DELETE: "#ef4444",
    READ: "#f59e0b",
  };

  const cardClass =
    "overflow-hidden bborder bg-white dark:bg-sidebar border-black/10 dark:border-white/10 backdrop-blur-md text-foreground";

  if (isLoadingAll)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="p-8 min-h-screen text-foreground">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={cardClass}>
            <CardHeader className="flex justify-between flex-row pb-2">
              <CardTitle>Total Research Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.totalResearchProjects}
              </div>
              <p className="text-xs text-muted-foreground">
                Project Riset
              </p>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader className="flex justify-between flex-row pb-2">
              <CardTitle>Internship Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.totalInternshipMember}
              </div>
              <p className="text-xs text-muted-foreground">
                Member Internship Aktif
              </p>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader className="flex justify-between flex-row pb-2">
              <CardTitle>Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                Member Staff Aktif
              </p>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader className="flex justify-between flex-row pb-2">
              <CardTitle>Total Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalVisitors}</div>
              <p className="text-xs text-muted-foreground">Total pengunjung</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className={`${cardClass} lg:col-span-2`}>
            <CardHeader className="flex justify-between flex-row">
              <div>
                <CardTitle>Visitor Analytics</CardTitle>
                <CardDescription>Statistik Pengunjung</CardDescription>
              </div>

              <Select value={visitorFilter} onValueChange={setVisitorFilter}>
                <SelectTrigger className="w-[180px] bg-sidebar border border-black/10 dark:border-white/10">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="bg-sidebar border border-black/10 dark:border-white/10">
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="7d">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30d">30 Hari Terakhir</SelectItem>
                  <SelectItem value="90d">90 Hari Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>

            <CardContent>
              <ChartContainer className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitorData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? "#374151" : "#d4d4d4"}
                    />

                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />

                    <ChartTooltip content={<ChartTooltipContent />} />

                    <Line
                      type="monotone"
                      dataKey="visits"
                      stroke="#3b82f6"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader className="flex justify-between flex-row">
              <div>
                <CardTitle>Logs Analytics</CardTitle>
                <CardDescription>Action yang dilakukan admin</CardDescription>
              </div>

              <Select value={logsFilter} onValueChange={setLogsFilter}>
                <SelectTrigger className="w-[150px] bg-sidebar border border-black/10 dark:border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-sidebar border border-black/10 dark:border-white/10">
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="7d">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30d">30 Hari Terakhir</SelectItem>
                  <SelectItem value="90d">90 Hari Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>

            <CardContent>
              <PieChart width={350} height={260}>
                <Pie
                  data={logsAnalytics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={(entry) => entry.action}
                >
                  {logsAnalytics.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[entry.action] || "#6b7280"}
                    />
                  ))}
                </Pie>
              </PieChart>

              <div className="mt-4 grid grid-cols-2 gap-3 text-center justify-center text-sm">
                {(() => {
                  const entries = Object.entries(logsSummary).filter(
                    ([key, value]) => value > 0
                  );
                  return entries.map(([key, value], index) => {
                    const isLastOdd =
                      entries.length % 2 !== 0 && index === entries.length - 1;
                    const colors = {
                      CREATE: "green",
                      READ: "amber",
                      UPDATE: "blue",
                      DELETE: "red",
                    };
                    return (
                      <div
                        key={key}
                        className={`p-2 rounded bg-${colors[key]}-500/10 ${
                          isLastOdd ? "col-span-2" : ""
                        }`}
                      >
                        <p
                          className={`font-bold text-${colors[key]}-600 dark:text-${colors[key]}-400`}
                        >
                          {value}
                        </p>
                        <p className="text-xs text-muted-foreground">{key}</p>
                      </div>
                    );
                  });
                })()}

                {Object.values(logsSummary).every((v) => v === 0) && (
                  <div className="col-span-2 text-muted-foreground text-xs">
                    Tidak ada aktivitas
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={`${cardClass} mb-6`}>
          <CardHeader>
            <CardTitle>Project Activity</CardTitle>
            <CardDescription>
              Aktivitas project 30 hari terakhir
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#d4d4d4"}
                  />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Aktivitas terbaru admin</CardDescription>
          </CardHeader>

          <CardContent>
            {recentActivities.activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada aktivitas
              </p>
            ) : (
              <ul className="space-y-3">
                {recentActivities.activities.map((act, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-lg bg-black/5 dark:bg-white/5"
                  >
                    <div className="font-semibold">{act.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {act.description}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {new Date(act.created_at).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
