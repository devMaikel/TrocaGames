import { GamesApiResponse } from "@/types/games";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  const token = localStorage.getItem("access_token");
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

export const patchGame = async (
  id: string,
  editedGame: any
): Promise<Response> => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await fetch(`${API_BASE_URL}/game/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedGame),
    });
    console.log("ress", response);
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Erro ao atualizar dados do jogo.");
  }
};
