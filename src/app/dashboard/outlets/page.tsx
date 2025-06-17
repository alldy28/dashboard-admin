// src/app/dashboard/outlets/page.tsx (Hasil Akhir)

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { type Outlet } from "./types";

// Komponen Shadcn UI
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Komponen baru yang kita buat
import { OutletForm } from "./OutletForm";
import { OutletDetail } from "./OutletDetail";

const ITEMS_PER_PAGE = 5;

// Fungsi untuk fetching data, dipisahkan dari komponen
async function fetchAllOutlets(): Promise<Outlet[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login kembali.");

  const response = await fetch(
    "https://api.belikoin.me/pusat/outlets?start=1&end=1000",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal memuat data outlet");
  }
  return data.data || [];
}

// Komponen Halaman Utama
export default function ListOutletsPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const refetchOutlets = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAllOutlets()
      .then(setOutlets)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetchOutlets();
  }, [refetchOutlets]);

  const totalPages = Math.ceil(outlets.length / ITEMS_PER_PAGE);
  const displayedOutlets = outlets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (direction: "next" | "prev") => {
    setCurrentPage((current) => {
      const newPage = direction === "next" ? current + 1 : current - 1;
      if (newPage > 0 && newPage <= totalPages) {
        return newPage;
      }
      return current;
    });
  };

  if (loading)
    return <div className="p-8 text-center">Memuat data outlet...</div>;
  if (error)
    return (
      <div className="p-8 text-center text-destructive">Error: {error}</div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Manajemen Outlet</CardTitle>
              <CardDescription>
                Tambah, lihat, dan kelola semua outlet Anda.
              </CardDescription>
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>+ Tambah Outlet</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Outlet Baru</DialogTitle>
                </DialogHeader>
                <OutletForm
                  onSuccess={() => {
                    setIsFormOpen(false);
                    refetchOutlets();
                    toast.success("Outlet baru berhasil ditambahkan!");
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Outlet</TableHead>
                  <TableHead className="hidden md:table-cell">Alamat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedOutlets.map((outlet) => (
                  <TableRow key={outlet.uuid}>
                    <TableCell className="font-medium">{outlet.nama}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {outlet.alamat}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Detail
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Detail: {outlet.nama}</DialogTitle>
                          </DialogHeader>
                          <OutletDetail uuid={outlet.uuid} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange("prev")}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm font-medium">
                  Halaman {currentPage} dari {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange("next")}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}
