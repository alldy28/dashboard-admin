export interface Bankinfo {
    id: number;
    outlet_uuid: string;
    bank: string;
    kode_bank: string;
    nomor_account: string;
    nama: string;
    cabang: string;
    status: string;
  }
  
  export interface Outlet {
    uuid: string;
    nama: string;
    alamat: string;
    pic_nama: string;
    pic_email: string;
    pic_telepon: string;
    bank?: Bankinfo[];
  }