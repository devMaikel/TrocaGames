"use client";

import { validateToken } from "@/services/userService";
import { redirect } from "next/navigation";

export default function Home() {
  const isAuthenticated =
    typeof window !== "undefined" && localStorage.getItem("access_token");

  validateToken();

  if (isAuthenticated) {
    redirect("/home");
  } else {
    redirect("/login");
  }
}

