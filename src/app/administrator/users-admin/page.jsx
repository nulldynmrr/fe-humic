"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Users, KeyRound } from "lucide-react";
import request from "@/utils/request";
import toast from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UserAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentAdminRole, setCurrentAdminRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [newPass, setNewPass] = useState("");

  const fetchCurrentAdmin = useCallback(async () => {
    try {
      const res = await request.get("/"); 
      setCurrentAdminRole(res.data.role || null);
    } catch {
      setCurrentAdminRole(null);
    }
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      const response = await request.get("/admin");
      setAdmins(Array.isArray(response.data) ? response.data : []);
    } catch {
      toast.error("Gagal memuat data admin");
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

  const handlePasswordUpdate = async () => {
    if (!newPass.trim()) return toast.error("Password tidak boleh kosong!");

    try {
      await request.put(`/admin/${selectedAdminId}/password`, {
        password: newPass,
      });

      toast.success("Password berhasil diperbarui!");
      setOpenModal(false);
      setNewPass("");
    } catch {
      toast.error("Gagal memperbarui password");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchCurrentAdmin(), fetchAdmins(), fetchLogs()]);
      setLoading(false);
    };
    load();
  }, [fetchAdmins, fetchLogs, fetchCurrentAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted">Loading...</p>
      </div>
    );
  }

  const cardClass =
    "bg-white dark:bg-sidebar border border-black/10 dark:border-white/10 backdrop-blur-md text-foreground dark:text-gray-50";

  return (
    <div className="min-h-screen p-8 text-foreground">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {admins.map((admin) => (
            <Card key={admin.id} className={cardClass}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {admin.username}
                </CardTitle>
                <Users className="h-5 w-5 text-muted" />
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted">
                  Role: {admin.role || "admin"}
                </p>

                {currentAdminRole === "master admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => {
                      setSelectedAdminId(admin.id);
                      setOpenModal(true);
                    }}
                  >
                    <KeyRound className="w-4 h-4 mr-2" />
                    Ganti Password
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
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
              <div className="text-center text-muted py-6">Tidak ada log</div>
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

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ganti Password Admin</DialogTitle>
          </DialogHeader>

          <Input
            type="password"
            placeholder="Password baru"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="mb-4"
          />

          <DialogFooter>
            <Button onClick={handlePasswordUpdate}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAdmin;
