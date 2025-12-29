"use client";

import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { Users, KeyRound, Eye, EyeOff, UserPlus, Trash2 } from "lucide-react";
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
  DialogDescription,
} from "@/components/ui/dialog";

import request, { getCurrentAdmin } from "@/utils/request";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MASTER_ADMIN_ID = 1;

const UserAdmin = () => {
  const router = useRouter();

  const [admins, setAdmins] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [currentAdminRole, setCurrentAdminRole] = useState(null);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [openDelete, setOpenDelete] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const fetchCurrentAdmin = useCallback(() => {
    const admin = getCurrentAdmin();

    if (!admin) {
      setCurrentAdminRole(null);
      setCurrentAdmin(null);
      return;
    }

    setCurrentAdmin(admin);

    if (admin.id === MASTER_ADMIN_ID) {
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
    if (currentAdmin?.id !== MASTER_ADMIN_ID) {
      toast.error("Hanya master admin yang boleh mengganti password!");
      return;
    }

    if (!newPass.trim()) {
      toast.error("Password tidak boleh kosong!");
      return;
    }

    if (newPass.length < 8) {
      toast.error("Password minimal 8 karakter!");
      return;
    }

    try {
      await request.patch(`/admin/${selectedAdminId}/password`, {
        new_password: newPass,
      });

      toast.success("Password berhasil diperbarui!");
      setOpenModal(false);
      setNewPass("");
      setShowNewPass(false);

      if (selectedAdminId === currentAdmin?.id) {
        toast.info("Anda akan dialihkan ke halaman login");
        setTimeout(() => {
          Cookies.remove("admin_token");
          localStorage.removeItem("admin");
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Gagal memperbarui password"
      );
    }
  };

  const createAdmin = async () => {
    if (currentAdmin?.id !== MASTER_ADMIN_ID) {
      toast.error("Hanya master admin yang boleh menambah admin!");
      return;
    }

    if (!newUsername.trim() || !newPassword.trim()) {
      toast.error("Username dan password wajib diisi!");
      return;
    }

    if (newUsername.length < 3) {
      toast.error("Username minimal 3 karakter!");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password minimal 8 karakter!");
      return;
    }

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
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal menambah admin");
    }
  };

  const handleDeleteAdmin = async () => {
    if (currentAdmin?.id !== MASTER_ADMIN_ID) {
      toast.error("Hanya master admin yang boleh menghapus admin!");
      return;
    }

    if (!adminToDelete) return;

    if (adminToDelete.id === currentAdmin?.id) {
      toast.error("Tidak dapat menghapus akun sendiri!");
      setOpenDelete(false);
      setAdminToDelete(null);
      return;
    }

    if (adminToDelete.id === MASTER_ADMIN_ID) {
      toast.error("Tidak dapat menghapus master admin!");
      setOpenDelete(false);
      setAdminToDelete(null);
      return;
    }

    try {
      await request.delete(`/admin/${adminToDelete.id}`);

      toast.success("Admin berhasil dihapus!");
      setOpenDelete(false);
      setAdminToDelete(null);
      fetchAdmins();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Gagal menghapus admin");
    }
  };

  useEffect(() => {
    const load = async () => {
      const token = Cookies.get("admin_token");

      if (!token) {
        toast.error("Silakan login terlebih dahulu");
        router.push("/login");
        return;
      }

      setLoading(true);
      try {
        await Promise.all([fetchCurrentAdmin(), fetchAdmins()]);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchAdmins, fetchCurrentAdmin, router]);

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
          <div>
            <h1 className="text-3xl font-bold">Admin Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Logged in as:{" "}
              <span className="font-semibold">{currentAdmin?.username}</span>
              {currentAdmin?.id === MASTER_ADMIN_ID && (
                <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded">
                  Master Admin
                </span>
              )}
            </p>
          </div>

          {currentAdmin?.id === MASTER_ADMIN_ID && (
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
          {admins.map((admin) => {
            const isCurrentUser = admin.id === currentAdmin?.id;
            const isMasterAdmin = admin.id === MASTER_ADMIN_ID;

            return (
              <Card
                key={admin.id}
                className={`bg-white dark:bg-sidebar border ${
                  isCurrentUser
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-black/10 dark:border-white/10"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {admin.username}
                      {isCurrentUser && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                          You
                        </span>
                      )}
                      {isMasterAdmin && (
                        <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">
                          Master
                        </span>
                      )}
                    </CardTitle>
                  </div>
                  <Users size={20} />
                </CardHeader>

                <CardContent>
                  <p className="text-sm mb-4">
                    Role: {isMasterAdmin ? "Master Admin" : "Admin"}
                  </p>

                  {currentAdmin?.id === MASTER_ADMIN_ID && (
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedAdminId(admin.id);
                          setOpenModal(true);
                        }}
                      >
                        <KeyRound size={16} className="mr-2" /> Ganti Password
                      </Button>

                      {!isMasterAdmin && !isCurrentUser && (
                        <Button
                          className="w-full"
                          onClick={() => {
                            setAdminToDelete(admin);
                            setOpenDelete(true);
                          }}
                        >
                          <Trash2 size={16} className="mr-2" /> Hapus Admin
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ganti Password Admin</DialogTitle>
            <DialogDescription>
              {selectedAdminId === currentAdmin?.id
                ? "Anda akan logout setelah mengganti password."
                : "Password minimal 8 karakter."}
            </DialogDescription>
          </DialogHeader>

          <Label>Password Baru</Label>
          <div className="relative">
            <Input
              type={showNewPass ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Minimal 8 karakter"
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
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Batal
            </Button>
            <Button onClick={handlePasswordUpdate}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader className="border-b border-black/30 pb-3">
            <DialogTitle>Tambah Admin Baru</DialogTitle>
            <DialogDescription>
              Username minimal 3 karakter, password minimal 8 karakter.
            </DialogDescription>
          </DialogHeader>

          <Label>Username</Label>
          <Input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Minimal 3 karakter"
          />

          <Label>Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAdd(false)}>
              Batal
            </Button>
            <Button onClick={createAdmin}>Tambah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Admin</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus admin{" "}
              <span className="font-bold">{adminToDelete?.username}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenDelete(false);
                setAdminToDelete(null);
              }}
            >
              Batal
            </Button>
            <Button onClick={handleDeleteAdmin}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAdmin;
