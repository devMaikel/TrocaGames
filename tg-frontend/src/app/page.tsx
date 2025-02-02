"use client";

import { validateToken } from "@/services/userService";
import { redirect } from "next/navigation";

export default function Home() {
  const isAuthenticated =
    typeof window !== "undefined" && localStorage.getItem("access_token");

  console.log(isAuthenticated);
  validateToken(isAuthenticated || "");

  if (isAuthenticated) {
    redirect("/home");
  } else {
    redirect("/login");
  }
}

