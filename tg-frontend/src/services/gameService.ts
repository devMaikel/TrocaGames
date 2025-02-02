import { GamesApiResponse } from "@/types/games";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = localStorage.getItem("access_token");

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

export const gameDetails = async (id: string): Promise<Response> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Erro ao conectar com o servidor.");
  }
};
