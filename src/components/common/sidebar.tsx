"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    if (confirm("Yakin ingin logout?")) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-6">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <ul className="space-y-4">
        <li>
          <Link
            href="/dashboard"
            className={`hover:text-gray-300 ${
              pathname === "/dashboard" ? "font-bold underline" : ""
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/outlets"
            className={`hover:text-gray-300 ${
              pathname === "/dashboard/outlets" ? "font-bold underline" : ""
            }`}
          >
            List Outlet
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="mt-4 text-left w-full text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
