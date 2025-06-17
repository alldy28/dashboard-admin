// src/app/dashboard/outlets/OutletForm.tsx (Setelah Diperbaiki)

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// ✅ BENAR: Impor 'toast' langsung dari library 'sonner'
import { toast } from "sonner";

// ❌ SALAH: Hapus baris ini
// import { useToast } from "@/components/ui/sonner";

interface OutletFormProps {
  onSuccess: () => void;
}

export function OutletForm({ onSuccess }: OutletFormProps) {
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [picNama, setPicNama] = useState("");
  const [picEmail, setPicEmail] = useState("");
  const [picTelepon, setPicTelepon] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ❌ SALAH: Hapus baris ini, tidak lagi diperlukan
  // const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      if (!token) throw new Error("Token tidak valid");

      const response = await fetch("https://api.belikoin.me/pusat/outlet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama,
          alamat,
          pic_nama: picNama,
          pic_email: picEmail,
          pic_telepon: picTelepon,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal menambahkan outlet");
      }
      onSuccess();
    } catch (err: any) {
      // ✅ BENAR: Panggil toast.error() untuk notifikasi error
      toast.error("Oh, tidak! Terjadi kesalahan.", {
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {/* ... (semua input fields tidak berubah) ... */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nama" className="text-right">
          Nama
        </Label>
        <Input
          id="nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="alamat" className="text-right">
          Alamat
        </Label>
        <Input
          id="alamat"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="picNama" className="text-right">
          Nama PIC
        </Label>
        <Input
          id="picNama"
          value={picNama}
          onChange={(e) => setPicNama(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="picEmail" className="text-right">
          Email PIC
        </Label>
        <Input
          id="picEmail"
          type="email"
          value={picEmail}
          onChange={(e) => setPicEmail(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="picTelepon" className="text-right">
          Telepon PIC
        </Label>
        <Input
          id="picTelepon"
          value={picTelepon}
          onChange={(e) => setPicTelepon(e.target.value)}
          className="col-span-3"
          required
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
