import { GamesApiResponse } from "@/types/games";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchGames(
  page: number = 1,
  limit: number = 12,
  platform?: string,
  genre?: string,
  title?: string
): Promise<GamesApiResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(platform && { platform }),
    ...(genre && { genre }),
    ...(title && { title }),
  });

  const response = await fetch(`${API_BASE_URL}/game?${queryParams}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar jogos");
  }

  return response.json();
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

export async function fetchFilters(): Promise<{
  platforms: string[];
  genres: string[];
}> {
  const response = await fetch(`${API_BASE_URL}/game/filters`);

  if (!response.ok) {
    throw new Error("Erro ao buscar filtros");
  }

  return response.json();
}

export async function deleteGame(id: string | number): Promise<Response> {
  const token = localStorage.getItem("access_token");
  console.log(`endpoint: ${API_BASE_URL}/game${id}`);
  try {
    const response = await fetch(`${API_BASE_URL}/game/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Erro ao deletar jogo.");
  }
}
