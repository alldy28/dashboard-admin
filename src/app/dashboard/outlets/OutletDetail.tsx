// src/app/dashboard/outlets/OutletDetail.tsx

"use client";

import { useEffect, useState } from "react";
import { type Outlet } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface OutletDetailProps {
  uuid: string;
}

export function OutletDetail({ uuid }: OutletDetailProps) {
  const [detail, setDetail] = useState<Outlet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token tidak ditemukan.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `https://api.belikoin.me/pusat/outlet/${uuid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (!response.ok || !data.success)
          throw new Error(data.message || "Gagal memuat detail.");
        setDetail(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [uuid]);

  if (loading) return <p className="text-center py-8">Memuat detail...</p>;
  if (error)
    return <p className="text-center py-8 text-destructive">Error: {error}</p>;
  if (!detail) return <p className="text-center py-8">Data tidak ditemukan.</p>;

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div>
          <strong className="block font-medium">Alamat</strong>
          {detail.alamat}
        </div>
        <div>
          <strong className="block font-medium">Nama PIC</strong>
          {detail.pic_nama}
        </div>
        <div>
          <strong className="block font-medium">Email PIC</strong>
          {detail.pic_email}
        </div>
        <div>
          <strong className="block font-medium">Telepon PIC</strong>
          {detail.pic_telepon}
        </div>
      </div>
      {detail.bank && detail.bank.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 text-base">Rekening Bank</h3>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead>
                  <TableHead>No. Rekening</TableHead>
                  <TableHead>Atas Nama</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.bank.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <Badge variant="outline">{b.bank}</Badge>
                    </TableCell>
                    <TableCell>{b.nomor_account}</TableCell>
                    <TableCell>{b.nama}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
