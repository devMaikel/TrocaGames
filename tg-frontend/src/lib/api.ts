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
  try {
    // 1. Faz o login e obtém o access_token
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      throw new Error("Erro ao fazer login");
    }

    // 2. Salva o access_token no localStorage
    localStorage.setItem("access_token", loginData.access_token);

    // 3. Usa o access_token para buscar os dados do usuário
    const userResponse = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error("Erro ao buscar dados do usuário");
    }

    // 4. Salva o user_id no localStorage
    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("user_name", userData.name);

    return "Login successful!";
  } catch (error) {
    console.error("Erro durante o login:", error);
    throw error; // Propaga o erro para ser tratado no componente que chamou a função
  }
}
