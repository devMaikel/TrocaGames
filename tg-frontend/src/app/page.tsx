// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  const isAuthenticated =
    typeof window !== "undefined" && localStorage.getItem("access_token");

  if (isAuthenticated) {
    redirect("/home");
  } else {
    redirect("/login");
  }
}
