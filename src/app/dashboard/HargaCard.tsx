// src/app/dashboard/HargaCard.tsx

import Image from "next/image";
import { type FC } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditHargaForm } from "./EditHargaForm";

interface HargaCardProps {
  type: "gold" | "silver";
  title: string;
  icon: string;
  hargaBeli?: number;
  hargaJual?: number;
  onUpdateSuccess: () => void;
}

const formatRupiah = (value?: number) => {
  if (value === undefined || value === null) return "Data tidak tersedia";
  return `Rp ${value.toLocaleString("id-ID")}`;
};

export const HargaCard: FC<HargaCardProps> = ({
  type,
  title,
  icon,
  hargaBeli,
  hargaJual,
  onUpdateSuccess,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Image src={icon} alt={title} width={40} height={40} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatRupiah(hargaJual)}</div>
        <p className="text-xs text-muted-foreground">Harga Jual per Gram</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm">
          <strong>Beli:</strong> {formatRupiah(hargaBeli)}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Edit Harga</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Harga {title}</DialogTitle>
            </DialogHeader>
            <EditHargaForm
              type={type}
              initialBeli={hargaBeli}
              initialJual={hargaJual}
              onSuccess={() => {
                // Menutup dialog (dikelola oleh komponen Dialog)
                onUpdateSuccess(); // Memuat ulang data di halaman utama
                toast.success(`Harga ${title} berhasil diupdate!`);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
