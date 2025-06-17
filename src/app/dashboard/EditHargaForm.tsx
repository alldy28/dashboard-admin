// src/app/dashboard/EditHargaForm.tsx

import { useState, type FC } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateHarga } from "./api";

interface EditHargaFormProps {
  type: "gold" | "silver";
  initialBeli?: number;
  initialJual?: number;
  onSuccess: () => void;
}

export const EditHargaForm: FC<EditHargaFormProps> = ({
  type,
  initialBeli = 0,
  initialJual = 0,
  onSuccess,
}) => {
  const [beli, setBeli] = useState(initialBeli);
  const [jual, setJual] = useState(initialJual);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      if (!token) throw new Error("Token tidak valid");
      await updateHarga(token, type, beli, jual);
      onSuccess();
    } catch (err: any) {
      toast.error("Gagal Mengupdate", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="harga-beli">Harga Beli</Label>
        <Input
          id="harga-beli"
          type="number"
          value={beli}
          onChange={(e) => setBeli(Number(e.target.value))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="harga-jual">Harga Jual</Label>
        <Input
          id="harga-jual"
          type="number"
          value={jual}
          onChange={(e) => setJual(Number(e.target.value))}
          required
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
};
