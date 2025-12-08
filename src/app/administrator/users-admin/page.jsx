"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, KeyRound, Eye, EyeOff, UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";

import request, { getCurrentAdmin } from "@/utils/request";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const UserAdmin = () => {
  const router = useRouter();

  const [admins, setAdmins] = useState([]);
  const [currentAdminRole, setCurrentAdminRole] = useState(null);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fetchCurrentAdmin = useCallback(() => {
    const admin = getCurrentAdmin();

    if (!admin) return setCurrentAdminRole(null);

    if (admin.username === "master admin") {
      setCurrentAdminRole("master admin");
    } else {
      setCurrentAdminRole("admin");
    }
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await request.get("/admin");
      setAdmins(res.data || []);
    } catch {
      toast.error("Gagal memuat data admin");
    }
  }, []);

  const handlePasswordUpdate = async () => {
    if (currentAdminRole !== "master admin")
      return toast.error("Hanya master admin yang boleh mengganti password!");

    if (!newPass.trim()) return toast.error("Password tidak boleh kosong!");

    try {
      await request.patch(`/admin/${selectedAdminId}/password`, {
        new_password: newPass,
      });

      toast.success("Password berhasil diperbarui!");
      setOpenModal(false);
      setNewPass("");
      router.push("/login");
    } catch {
      toast.error("Gagal memperbarui password");
    }
  };

  const createAdmin = async () => {
    if (currentAdminRole !== "master admin")
      return toast.error("Hanya master admin yang boleh menambah admin!");

    if (!newUsername.trim() || !newPassword.trim())
      return toast.error("Username dan password wajib diisi!");

    try {
      await request.post("/admin", {
        username: newUsername,
        password: newPassword,
      });

      toast.success("Admin baru berhasil dibuat!");
      setOpenAdd(false);
      setNewUsername("");
      setNewPassword("");
      fetchAdmins();
    } catch {
      toast.error("Gagal menambah admin");
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen p-8 text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Management</h1>

          {currentAdminRole === "master admin" && (
            <Button
              className="flex items-center gap-2"
              onClick={() => setOpenAdd(true)}
            >
              <UserPlus size={18} />
              Tambah Admin
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((admin) => (
            <Card
              key={admin.id}
              className="bg-white dark:bg-sidebar border border-black/10 dark:border-white/10"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{admin.username}</CardTitle>
                <Users size={20} />
              </CardHeader>

              <CardContent>
                <p className="text-sm">
                  Role:{" "}
                  {admin.username === "master admin" ? "master admin" : "admin"}
                </p>

                {currentAdminRole === "master admin" && (
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => {
                      setSelectedAdminId(admin.id);
                      setOpenModal(true);
                    }}
                  >
                    <KeyRound size={16} className="mr-2" /> Ganti Password
                  </Button>
                )}
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

          <Label>Password Baru</Label>
          <div className="relative">
            <Input
              type={showNewPass ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="bg-white pr-10"
            />

            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <DialogFooter>
            <Button onClick={handlePasswordUpdate}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader className="border-b border-black/30 pb-3">
            <DialogTitle>Tambah Admin Baru</DialogTitle>
          </DialogHeader>

          <Label>Username</Label>
          <Input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />

          <Label>Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <DialogFooter>
            <Button onClick={createAdmin}>Tambah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAdmin;
