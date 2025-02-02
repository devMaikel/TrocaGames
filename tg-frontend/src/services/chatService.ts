const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = localStorage.getItem("access_token");

export const createChat = async (gameId: number): Promise<Response> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ gameId }),
    });
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Erro ao criar o chat.");
  }
};

export const getChatsByUserToken = async (): Promise<Response> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Erro ao buscar chats de usuário.");
  }
};

export const postNewChatMessage = async (
  chatId: number,
  content: string
): Promise<Response> => {
  try {
    const response = await fetch(`${API_BASE_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chatId,
        content,
      }),
    });
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Erro postar nova mensagem.");
  }
};
