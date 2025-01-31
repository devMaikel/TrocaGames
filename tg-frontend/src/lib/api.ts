import { GamesApiResponse } from "@/types/games";

const API_BASE_URL = "https://gamestrade.onrender.com";

export async function fetchGames(
  page: number = 1,
  limit: number = 12
): Promise<GamesApiResponse> {
  const response = await fetch(
    `${API_BASE_URL}/game?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Erro ao buscar jogos");
  }
  const data = response.json();
  return data;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error("Erro ao fazer login");
  }
  if (response.ok) {
    localStorage.setItem("access_token", data.access_token);
  }
  return "Login successful!";
}
