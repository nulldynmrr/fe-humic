"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Users, KeyRound } from "lucide-react";
import request from "@/utils/request";
import { toast } from "sonner";

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
      setAdmins(response.data);
    } catch {
      toast.error("Gagal memuat data admin");
    }
  }, []);



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
      await Promise.all([fetchCurrentAdmin(), fetchAdmins()]);
      setLoading(false);
    };
    load();
  }, [fetchAdmins, fetchCurrentAdmin]);

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
              </CardContent>
            </Card>
          ))}
        </div>


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
