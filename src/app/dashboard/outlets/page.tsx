"use client";

import React, { useEffect, useState } from "react";
import Modal from "../../../components/common/modal";

interface Outlet {
  uuid: string;
  nama: string;
  alamat: string;
  pic_nama: string;
  pic_email: string;
  pic_telepon: string;
  bank?: Bankinfo [];
}


interface Bankinfo {
  id: number;
  outlet_uuid: string;
  bank: string;
  kode_bank: string;
  nomor_account: string;
  nama: string;
  cabang: string;
  status: string;
}

const ITEMS_PER_PAGE = 3;

const fetchOutlets = async (
  setOutletsFn: (data: Outlet[]) => void,
  setLoadingFn: (val: boolean) => void,
  setErrorFn: (msg: string | null) => void
) => {
  const token = localStorage.getItem("token");
  setLoadingFn(true);

  if (!token) {
    setErrorFn("Token tidak ditemukan di localStorage.");
    setLoadingFn(false);
    return;
  }

  try {
    const response = await fetch(
      "https://api.belikoin.me/pusat/outlets?start=1&end=1000",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Gagal memuat data");
    }

    setOutletsFn(data.data || []);
  } catch (err: any) {
    setErrorFn(err.message);
  } finally {
    setLoadingFn(false);
  }
};

export default function ListOutlets() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [picNama, setPicNama] = useState("");
  const [picEmail, setPicEmail] = useState("");
  const [picTelepon, setPicTelepon] = useState("");

  const [selectedOutletDetail, setSelectOutletDetail] = useState<Outlet | null>(
    null
  );

  const totalPages = Math.ceil(outlets.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchOutlets(setOutlets, setLoading, setError);
  }, []);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token tidak ditemukan.");
      return;
    }

    try {
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

      alert("Outlet berhasil ditambahkan!");
      setNama("");
      setAlamat("");
      setPicNama("");
      setPicEmail("");
      setPicTelepon("");
      setShowFormModal(false);
      fetchOutlets(setOutlets, setLoading, setError);
    } catch (err: any) {
      alert(`Gagal menambahkan outlet: ${err.message}`);
    }
  };

  const displayedOutlets = outlets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const fetchOutletDetail = async (uuid: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token tidak ditemukan.");
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal memuat data");
      }

      setSelectOutletDetail(data.data);
      setShowDetailModal(true);
    } catch (err: any) {
      alert(`Gagal memuat data: ${err.message}`);
    }
  };

  if (loading) return <div className="text-black">Loading...</div>;
  if (error)
    return <div className="text-red-600 bg-gray-100 p-4">Error: {error}</div>;

  return (
    <div className="bg-gray-100 text-black min-h-screen p-4">
      <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-xl font-bold">List of Outlets</h1>
        <button
          onClick={() => setShowFormModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + Tambah Outlet
        </button>
      </div>

      <table className="w-full border-collapse bg-white text-black">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-2">Nama</th>
            <th className="border border-black p-2">Alamat</th>
            <th className="border border-black p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {displayedOutlets.map((outlet) => (
            <tr key={outlet.uuid}>
              <td className="border border-black p-2">{outlet.nama}</td>
              <td className="border border-black p-2">{outlet.alamat}</td>
              <td className="border border-black p-2">
                <button
                  onClick={() => fetchOutletDetail(outlet.uuid)}
                  className="px-3 py-1 bg-gray-300 text-black rounded"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-4 py-2 border rounded ${
                page === currentPage ? "font-bold bg-gray-300" : ""
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Tambah Outlet"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Nama Outlet</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">Alamat</label>
            <input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">Nama PIC</label>
            <input
              type="text"
              value={picNama}
              onChange={(e) => setPicNama(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">Email PIC</label>
            <input
              type="email"
              value={picEmail}
              onChange={(e) => setPicEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block">Telepon PIC</label>
            <input
              type="text"
              value={picTelepon}
              onChange={(e) => setPicTelepon(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowFormModal(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detail Outlet"
      >
        {selectedOutletDetail ? (
          <div className="space-y-4">
            <div>
              <p>
                <strong>Nama:</strong> {selectedOutletDetail.nama}
              </p>
              <p>
                <strong>Alamat:</strong> {selectedOutletDetail.alamat}
              </p>
              <p>
                <strong>PIC Nama:</strong> {selectedOutletDetail.pic_nama}
              </p>
              <p>
                <strong>PIC Email:</strong> {selectedOutletDetail.pic_email}
              </p>
              <p>
                <strong>PIC Telepon:</strong> {selectedOutletDetail.pic_telepon}
              </p>
            </div>

            {selectedOutletDetail.bank &&
              selectedOutletDetail.bank.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Rekening Bank:</h3>
                  <table className="w-full border text-sm bg-white text-black">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Bank</th>
                        <th className="border p-2">Nomor Rekening</th>
                        <th className="border p-2">Nama Pemilik</th>
                        <th className="border p-2">Cabang</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOutletDetail.bank.map((bank) => (
                        <tr key={bank.id}>
                          <td className="border p-2">{bank.bank}</td>
                          <td className="border p-2">{bank.nomor_account}</td>
                          <td className="border p-2">{bank.nama}</td>
                          <td className="border p-2">{bank.cabang}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            <div className="text-right mt-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <p>Memuat detail outlet...</p>
        )}
      </Modal>
    </div>
  );
}
