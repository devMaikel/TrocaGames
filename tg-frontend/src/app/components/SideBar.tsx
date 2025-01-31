"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Catálogo de jogos", href: "/home" },
    { name: "Meus jogos", href: "/my-games" },
    { name: "Mensagens", href: "/messages" },
    { name: "Minha conta", href: "/profile" },
    { name: "Sair", href: "/login" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">GamesTrade</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.name} className="mb-4">
            <Link
              onClick={() => {
                if (item.href === "/login") {
                  localStorage.removeItem("access_token");
                }
              }}
              href={item.href}
              className={`block p-2 rounded ${
                pathname === item.href ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
