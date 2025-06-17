// src/app/dashboard/page.tsx (Hasil Akhir)

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type Harga, fetchHarga as fetchHargaAPI } from "./api";

// Komponen Shadcn UI
import { Skeleton } from "@/components/ui/skeleton";

// Komponen baru yang kita buat
import { HargaCard } from "./HargaCard";

export default function DashboardPage() {
  const router = useRouter();
  const [harga, setHarga] = useState<Harga | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHarga = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
      const data = await fetchHargaAPI(token);
      setHarga(data);
    } catch (err: any) {
      toast.error("Gagal Memuat Data", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchHarga();
  }, [fetchHarga]);

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <>
            <Skeleton className="h-[150px] w-full rounded-xl" />
            <Skeleton className="h-[150px] w-full rounded-xl" />
          </>
        ) : (
          <>
            <HargaCard
              type="gold"
              title="Harga Emas"
              hargaBeli={harga?.gold?.beli}
              hargaJual={harga?.gold?.jual}
              icon="/assets/gold.png"
              onUpdateSuccess={fetchHarga}
            />
            <HargaCard
              type="silver"
              title="Harga Perak"
              hargaBeli={harga?.silver?.beli}
              hargaJual={harga?.silver?.jual}
              icon="/assets/silver.png"
              onUpdateSuccess={fetchHarga}
            />
          </>
        )}
      </div>
    </main>
  );
}
