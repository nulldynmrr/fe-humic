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

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState("all");
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

  const fetchLogs = useCallback(async () => {
    try {
      const response = await request.get("/logs");
      const logsData = Array.isArray(response.data) ? response.data : [];

      const mapped = await Promise.all(
        logsData.map(async (log) => {
          try {
            const adminRes = await request.get(`/admin/${log.id_admin}`);
            return { ...log, adminName: adminRes.data.username || "Unknown" };
          } catch {
            return { ...log, adminName: "Unknown" };
          }
        })
      );

      setLogs(mapped);
      setFilteredLogs(mapped);
    } catch {
      toast.error("Gagal memuat log");
    }
  }, []);

  const applyFilter = (value) => {
    setFilter(value);

    if (value === "all") {
      setFilteredLogs(logs);
      return;
    }

    const now = new Date();
    const days = { today: 1, "3d": 3, "7d": 7, "1m": 30 }[value];

    const filtered = logs.filter((log) => {
      const logDate = new Date(log.created_at);
      const diff = (now - logDate) / (1000 * 60 * 60 * 24);
      return diff <= days;
    });

    setFilteredLogs(filtered);
  };

  useEffect(() => {
    const load = async () => {
      setIsLoadingAll(true);
      await Promise.all([
        fetchAllProject(),
        fetchAllIntern(),
        fetchAllStaff(),
        fetchLogsAnalytics(logsFilter),
        fetchLogs(),
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
    fetchLogs,
  ]);

  const COLORS = {
    CREATE: "#10b981",
    UPDATE: "#3b82f6",
    DELETE: "#ef4444",
    READ: "#f59e0b",
  };

  const cardClass =
    "w-full h-full overflow-hidden border bg-white dark:bg-sidebar border-black/10 dark:border-white/10 backdrop-blur-md text-foreground";

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

        <div className="w-full flex flex-row space-x-4">
          <div className="max-w-[92rem] w-full flex flex-col space-x-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8">
              <Card className={cardClass}>
                <CardHeader className="flex justify-between flex-row pb-2">
                  <CardTitle>Total Research Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.totalResearchProjects}
                  </div>
                  <p className="text-xs text-muted-foreground">Project Riset</p>
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
            </div>

            <Card className={cardClass}>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle>Logs</CardTitle>
                    <CardDescription>Aktivitas seluruh admin</CardDescription>
                  </div>

                  <Select value={filter} onValueChange={applyFilter}>
                    <SelectTrigger className="w-[200px] bg-sidebar border border-black/10 dark:border-white/10">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>

                    <SelectContent className="bg-sidebar border border-black/10 dark:border-white/10">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="today">Hari ini</SelectItem>
                      <SelectItem value="3d">3 Hari Terakhir</SelectItem>
                      <SelectItem value="7d">7 Hari Terakhir</SelectItem>
                      <SelectItem value="1m">1 Bulan Terakhir</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent>
                {filteredLogs.length === 0 ? (
                  <div className="text-center text-muted py-6">
                    Tidak ada log
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 p-3 rounded-lg bg-sidebar/20 border border-black/10 dark:border-white/10"
                      >
                        <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-full">
                          <span className="font-bold text-sm">
                            {log.adminName.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1">
                          <p className="font-medium">{log.adminName}</p>
                          <p className="text-xs text-muted">
                            Table: {log.target_table} | ID: {log.target_id}
                          </p>

                          {log.description && (
                            <p className="text-xs italic text-muted">
                              {log.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <p
                            className={`text-xs font-semibold px-2 py-1 rounded-md text-white ${
                              log.action === "CREATE"
                                ? "bg-green-500"
                                : log.action === "UPDATE"
                                ? "bg-blue-500"
                                : log.action === "DELETE"
                                ? "bg-red-500"
                                : "bg-gray-400"
                            }`}
                          >
                            {log.action}
                          </p>

                          <span className="text-muted text-xs">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="w-full">
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
                        entries.length % 2 !== 0 &&
                        index === entries.length - 1;
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
