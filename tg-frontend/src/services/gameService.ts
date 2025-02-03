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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const gameAddImage = async (gameId: number, formData: FormData) => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/image/game/${gameId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Erro ao adicionar imagem ao jogo.");
  }
};

export const gameAdd = async (
  title: string,
  description: string,
  platform: string,
  genre: string,
  price: string | number,
  forTrade: boolean
) => {
  const token = localStorage.getItem("access_token");
  try {
    const response = await fetch(`${API_BASE_URL}/game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        platform,
        genre,
        price: Number(price),
        forTrade,
      }),
    });
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Erro ao adicionar jogo.");
  }
};
