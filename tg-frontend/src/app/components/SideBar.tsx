"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Catálogo de jogos", href: "/home" },
    { name: "Meus jogos", href: "/my-games" },
    { name: "Mensagens", href: "/messages" },
    { name: "Minha conta", href: "/profile" },
    { name: "Sair", href: "/login" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 p-2 bg-gray-800 text-white rounded-lg md:hidden z-51"
      >
        {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 transform transition-transform duration-300 z-50 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex md:flex-col`}
      >
        <h2 className="text-2xl font-bold mb-6">GamesTrade</h2>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link
                onClick={() => {
                  if (item.href === "/login") {
                    localStorage.removeItem("access_token");
                  }
                  setIsSidebarOpen(false);
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

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        ></div>
      )}
    </>
  );
}
