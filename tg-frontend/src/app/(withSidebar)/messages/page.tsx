"use client";

import Modal from "@/app/components/Modal";
import { useState, useEffect } from "react";
import { Chat, Message } from "./types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  console.log("selectedChat", selectedChat?.messages);
  const userId = localStorage.getItem("user_id") || "";
  const userName = localStorage.getItem("user_name") || "";

  const fetchChats = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch(
        "https://gamestrade.onrender.com/chat/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data: Chat[] = await response.json();
        const sortedChats = data.sort((a, b) => {
          const lastMessageA =
            a.messages[a.messages.length - 1]?.createdAt ||
            "1970-01-01T00:00:00.000Z";
          const lastMessageB =
            b.messages[b.messages.length - 1]?.createdAt ||
            "1970-01-01T00:00:00.000Z";
          return (
            new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime()
          );
        });
        setChats(sortedChats);
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/login");
        toast.error("Sessão expirada. Faça login novamente.");
      } else {
        setError("Erro ao carregar chats");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openChatModal = (chat: Chat) => {
    setSelectedChat(chat);
    setIsModalOpen(true);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch("https://gamestrade.onrender.com/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat.id,
          content: newMessage,
        }),
      });

      if (response.status === 201) {
        const newMessageData: Message = await response.json();
        setSelectedChat((prevChat) => ({
          ...prevChat!,
          messages: [...prevChat!.messages, newMessageData],
        }));
        setNewMessage("");
        router.push("/home");
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/login");
        toast.error("Sessão expirada. Faça login novamente.");
      } else {
        setError("Erro ao enviar mensagem");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Carregando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mensagens</h1>

      <div className="space-y-4">
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          const otherUser = chat.buyerId === userId ? chat.seller : chat.buyer;

          return (
            <div
              key={chat.id}
              onClick={() => openChatModal(chat)}
              className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {otherUser.name} - {chat.game.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {lastMessage ? lastMessage.content : "Nenhuma mensagem"}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {lastMessage
                    ? new Date(lastMessage.createdAt).toLocaleString()
                    : "Sem mensagens"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedChat && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Chat com{" "}
              {selectedChat.buyerId === userId
                ? selectedChat.seller.name
                : selectedChat.buyer.name}
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto p-2">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.createdAt}
                  className={`p-4 rounded-lg max-w-xs ${
                    message.sender?.name === userName
                      ? "bg-blue-100 ml-auto text-right"
                      : "bg-gray-100 text-left"
                  }`}
                >
                  <p className="text-sm font-bold text-gray-800">
                    {message.sender?.name}
                  </p>
                  <p className="text-sm text-gray-800">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite sua mensagem..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Enviar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
