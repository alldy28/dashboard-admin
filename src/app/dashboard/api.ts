
export type Harga = {
    gold?: { beli: number; jual: number };
    silver?: { beli: number; jual: number };
  };
  
  // Tipe data untuk item tunggal dari API
  type HargaItem = {
    id: number;
    type: "gold" | "silver";
    harga_beli: string;
    harga_jual: string;
  };
  
  // Fungsi untuk mengambil dan memformat data harga
  export async function fetchHarga(token: string): Promise<Harga> {
    const res = await fetch("https://api.belikoin.me/pusat/harga-emas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
  
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Gagal mengambil data harga");
    }
  
    // Mengubah array menjadi objek yang lebih mudah digunakan
    return json.data.reduce((acc: Harga, item: HargaItem) => {
      if (item.type === "gold" || item.type === "silver") {
        acc[item.type] = {
          beli: parseFloat(item.harga_beli),
          jual: parseFloat(item.harga_jual),
        };
      }
      return acc;
    }, {});
  }
  
  // Fungsi untuk mengupdate harga
  export async function updateHarga(
    token: string,
    type: "gold" | "silver",
    hargaBeli: number,
    hargaJual: number
  ) {
    // CATATAN: Ganti URL endpoint ini dengan URL API Anda untuk 'update'
    const res = await fetch("https://api.belikoin.me/pusat/update-harga", {
      method: "POST", // atau PUT/PATCH
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        harga_beli: hargaBeli,
        harga_jual: hargaJual,
      }),
    });
  
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || `Gagal mengupdate harga ${type}`);
    }
    return json.data;
  }