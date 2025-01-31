import { ReactNode } from "react";
import Sidebar from "../components/SideBar";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">{children}</div>
    </div>
  );
}
