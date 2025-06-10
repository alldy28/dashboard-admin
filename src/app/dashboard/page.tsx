"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [harga, setHarga] = useState<{
    gold?: { beli: number; jual: number };
    silver?: { beli: number; jual: number };
  }>({});



  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false);
      fetchHarga(token);
    }
  }, [router]);

  const fetchHarga = async (token: string) => {
    try {
      const res = await fetch("https://api.belikoin.me/pusat/harga-emas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal mengambil data harga");
      }

      const newHarga: any = {};
      json.data.forEach((item: any) => {
        if (item.type === "gold" || item.type === "silver") {
          newHarga[item.type] = {
            beli: parseFloat(item.harga_beli),
            jual: parseFloat(item.harga_jual),
          };
        }
      });

      setHarga(newHarga);
    } catch (err) {
      console.error("Fetch harga gagal:", err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <h1 className="text-2xl text-green-800 font-semibold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 text-green-700 md:grid-cols-2 gap-6 mb-8">
          <HargaCard
            title="Harga Emas"
            image="/assets/gold.png"
            beli={harga.gold?.beli}
            jual={harga.gold?.jual}
          />
          <HargaCard
            title="Harga Silver"
            image="/assets/silver.png"
            beli={harga.silver?.beli}
            jual={harga.silver?.jual}
          />
        </div>
      </main>
    </div>
  );
}

function HargaCard({
  title,
  beli,
  image,
  jual,
}: {
  title: string;
  beli?: number;
  image: string;
  jual?: number;
}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-start gap-6">
      <div className="bg-gray-200 p-4 rounded-md">
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="rounded"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>

            <div className="text-gray-700 space-y-1">
              <p>
                <strong>Harga Beli:</strong>{" "}
                {beli !== undefined
                  ? `Rp ${beli.toLocaleString("id-ID")}`
                  : "Tidak tersedia"}
              </p>
              <p>
                <strong>Harga Jual:</strong>{" "}
                {jual !== undefined
                  ? `Rp ${jual.toLocaleString("id-ID")}`
                  : "Tidak tersedia"}
              </p>
            </div>
          </div>

          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 h-fit rounded-md ml-4">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}