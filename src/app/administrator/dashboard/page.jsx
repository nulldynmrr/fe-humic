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
import { PieChart, Pie, Cell } from "recharts";
import request from "@/utils/request";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalResearchProjects: 0,
    totalInternshipMember: 0,
    totalStaff: 0,
  });

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [logsAnalytics, setLogsAnalytics] = useState([]);
  const [logsSummary, setLogsSummary] = useState({
    CREATE: 0,
    READ: 0,
    UPDATE: 0,
    DELETE: 0,
  });

  const [logsFilter, setLogsFilter] = useState("7d");
  const [isLoadingAll, setIsLoadingAll] = useState(true);

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
    } catch (error) {
      console.error("Error fetching logs:", error);
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
      const token = Cookies.get("admin_token");

      if (!token) {
        console.warn("No admin token found, redirecting to login");
        window.location.href = "/login";
        return;
      }

      setIsLoadingAll(true);
      try {
        await Promise.all([
          fetchAllProject(),
          fetchAllIntern(),
          fetchAllStaff(),
          fetchLogsAnalytics(logsFilter),
          fetchLogs(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard:", error);

        if (error?.response?.status === 401) {
          Cookies.remove("admin_token");
          localStorage.removeItem("admin");
          window.location.href = "/login";
        }
      } finally {
        setIsLoadingAll(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    fetchLogsAnalytics(logsFilter);
  }, [logsFilter, fetchLogsAnalytics]);
  useEffect(() => {
    fetchLogsAnalytics(logsFilter);
  }, [logsFilter, fetchLogsAnalytics]);

  const COLORS = {
    CREATE: "#10b981",
    UPDATE: "#3b82f6",
    DELETE: "#ef4444",
    READ: "#f59e0b",
  };

  const cardClass =
    "w-full overflow-hidden border bg-white dark:bg-sidebar border-black/10 dark:border-white/10 backdrop-blur-md text-foreground";

  if (isLoadingAll) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen text-foreground">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className={cardClass}>
            <CardHeader className="flex justify-between flex-row pb-2">
              <CardTitle className="text-base">
                Total Research Projects
              </CardTitle>
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
              <CardTitle className="text-base">Internship Members</CardTitle>
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
              <CardTitle className="text-base">Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                Member Staff Aktif
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className={cardClass}>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle>Logs</CardTitle>
                    <CardDescription>Aktivitas seluruh admin</CardDescription>
                  </div>

                  <Select value={filter} onValueChange={applyFilter}>
                    <SelectTrigger className="w-[180px] bg-sidebar border border-black/10 dark:border-white/10">
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
                  <div className="text-center text-muted-foreground py-8">
                    Tidak ada log
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 p-3 rounded-lg bg-sidebar/20 border border-black/10 dark:border-white/10"
                      >
                        <div className="w-9 h-9 flex items-center justify-center bg-muted rounded-full flex-shrink-0">
                          <span className="font-bold text-sm">
                            {log.adminName.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {log.adminName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Table: {log.target_table} | ID: {log.target_id}
                          </p>
                          {log.description && (
                            <p className="text-xs italic text-muted-foreground mt-1">
                              {log.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span
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
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(log.created_at).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className="text-base">Logs Analytics</CardTitle>
                <CardDescription className="text-xs">
                  Action yang dilakukan admin
                </CardDescription>
                <Select value={logsFilter} onValueChange={setLogsFilter}>
                  <SelectTrigger className="w-full mt-2 bg-sidebar border border-black/10 dark:border-white/10">
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

              <CardContent className="flex flex-col items-center">
                {logsAnalytics.length > 0 ? (
                  <>
                    <PieChart width={280} height={240}>
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

                    <div className="mt-4 w-full grid grid-cols-2 gap-2 text-center text-sm">
                      {Object.entries(logsSummary)
                        .filter(([, value]) => value > 0)
                        .map(([key, value], index, arr) => {
                          const isLastOdd =
                            arr.length % 2 !== 0 && index === arr.length - 1;
                          const colors = {
                            CREATE: "green",
                            READ: "amber",
                            UPDATE: "blue",
                            DELETE: "red",
                          };
                          return (
                            <div
                              key={key}
                              className={`p-2 rounded bg-${
                                colors[key]
                              }-500/10 ${isLastOdd ? "col-span-2" : ""}`}
                            >
                              <p
                                className={`font-bold text-lg text-${colors[key]}-600 dark:text-${colors[key]}-400`}
                              >
                                {value}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {key}
                              </p>
                            </div>
                          );
                        })}

                      {Object.values(logsSummary).every((v) => v === 0) && (
                        <div className="col-span-2 text-muted-foreground text-xs py-4">
                          Tidak ada aktivitas
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Tidak ada data analytics
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
