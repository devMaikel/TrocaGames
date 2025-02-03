"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Game } from "@/types/games";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  deleteGame,
  gameAddImage,
  gameDetails,
  patchGame,
} from "@/services/gameService";
import { createChat } from "@/services/chatService";
import Modal from "react-modal";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface GameDetailsProps {
  params: Params;
}

type Params = Promise<{ id: string }>;

export default function GameDetails({ params }: GameDetailsProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedGame, setEditedGame] = useState<Partial<Game>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  const paramsUse = use(params);
  const id = paramsUse.id;

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleAddImageBtn = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      game && prevIndex < game.images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const prevImage = () => {
    if (game) {
      setCurrentImageIndex((prevIndex) =>
        game && prevIndex > 0 ? prevIndex - 1 : game.images.length - 1
      );
    }
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      if (game) {
        try {
          const response = await gameAddImage(game.id, formData);

          if (response.ok) {
            toast.success("Foto adicionada com sucesso!");
            router.push("/my-games");
          } else if (response.status === 401) {
            localStorage.removeItem("access_token");
            toast.error("Sessão expirada. Faça login novamente.");
            router.push("/login");
          } else {
            console.error("Erro ao fazer upload da foto");
          }
        } catch (err) {
          console.error("Erro ao conectar com o servidor:", err);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await gameDetails(id);

        if (response.ok) {
          const data = await response.json();
          setGame(data);
          setEditedGame(data);
        } else if (response.status === 404) {
          setError("Jogo não encontrado.");
        } else if (response.status === 401) {
          localStorage.removeItem("access_token");
          alert("Sessão expirada. Faça login novamente.");
          router.push("/login");
        } else {
          setError("Erro ao buscar detalhes do jogo.");
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id, token, router]);

  const handleMakeOffer = async () => {
    if (!token) {
      alert("Faça login para fazer uma oferta.");
      router.push("/login");
      return;
    }

    try {
      const response = await createChat(+id);

      if (response.ok) {
        toast.success("Chat criado com sucesso!");
        router.push(`/messages`);
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        alert("Sessão expirada. Faça login novamente.");
        router.push("/login");
      } else {
        alert("Erro ao criar o chat.");
      }
    } catch (err) {
      console.log(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleEditGame = () => {
    setIsEditing(true);
  };

  const handleDeleteGame = async () => {
    try {
      setIsLoading(true);
      const response = await deleteGame(id);
      if (response.ok) {
        toast.success("Jogo deletado com sucesso!");
        router.push("/my-games");
      } else {
        toast.error("Erro ao deletar o jogo");
      }
    } catch (err) {
      console.log(err);
      toast.error("Erro ao deletar o jogo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (game) {
      setEditedGame(game);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditedGame((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateGame = async () => {
    try {
      const response = await patchGame(id, {
        title: editedGame.title,
        platform: editedGame.platform,
        genre: editedGame.genre,
        description: editedGame.description,
        price: editedGame.price ? Number(editedGame.price) : 0,
        forTrade: editedGame.forTrade === "true",
      });

      if (response.ok) {
        const updatedGame = await response.json();
        setGame(updatedGame);
        setIsEditing(false);
        toast.success("Jogo atualizado com sucesso!");
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        alert("Sessão expirada. Faça login novamente.");
        router.push("/login");
      } else {
        alert("Erro ao atualizar o jogo.");
      }
    } catch (err) {
      console.log(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Carregando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!game) {
    return <p className="text-center text-gray-600">Jogo não encontrado.</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editedGame.title || ""}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ) : (
          game.title
        )}
      </h1>
      <div className="mb-6">
        {game.images && game.images.length > 0 && !isModalOpen ? (
          <Swiper
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="w-full h-64 rounded-lg overflow-hidden z-10"
          >
            {game.images.map((image, index) => (
              <SwiperSlide
                key={index}
                className="relative w-full h-64"
                onClick={() => openModal(index)}
              >
                <Image
                  src={image}
                  alt={`Imagem ${index + 1} do jogo ${game.title}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src="/images/defaultGame2.webp"
              alt="Imagem padrão do jogo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição:
          </label>
          {isEditing ? (
            <textarea
              name="description"
              value={editedGame.description || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded text-gray-900"
              rows={4}
            />
          ) : (
            <p className="mt-1 text-gray-900">{game.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Plataforma:
          </label>
          {isEditing ? (
            <input
              type="text"
              name="platform"
              value={editedGame.platform || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p className="mt-1 text-gray-900">{game.platform}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gênero:
          </label>
          {isEditing ? (
            <input
              type="text"
              name="genre"
              value={editedGame.genre || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          ) : (
            <p className="mt-1 text-gray-900">{game.genre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preço:
          </label>
          {isEditing ? (
            <input
              type="number"
              name="price"
              value={editedGame.price || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded text-gray-900"
            />
          ) : (
            <p className="mt-1 text-gray-900">R$ {game.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Disponível para troca:
          </label>
          {isEditing ? (
            <select
              name="forTrade"
              value={editedGame.forTrade ? "true" : "false"}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded text-gray-900"
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          ) : (
            <p className="mt-1 text-gray-900">
              {game.forTrade ? "Sim" : "Não"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Publicado em:
          </label>
          <p className="mt-1 text-gray-900">
            {new Date(game.createdAt).toLocaleDateString()}
          </p>
        </div>

        {userId !== game.ownerId && (
          <button
            onClick={handleMakeOffer}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Fazer uma oferta
          </button>
        )}

        {userId === game.ownerId && (
          <div className="mt-6">
            {isEditing ? (
              <div className="space-x-4">
                <button
                  onClick={handleUpdateGame}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleEditGame}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Editar
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={handleAddImageBtn}
                  disabled={game.images.length >= 5}
                >
                  Adicionar nova imagem
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAddImage}
                    className="hidden"
                    accept="image/*"
                  />
                </button>
                <button
                  onClick={handleDeleteGame}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Apagar
                </button>
              </div>
            )}
          </div>
        )}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-999"
          overlayClassName="fixed inset-0 bg-black bg-opacity-70"
        >
          <div className="relative">
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={closeModal}
            >
              ✖
            </button>
            <button
              className="absolute left-4 top-1/2 text-white text-2xl"
              onClick={prevImage}
            >
              ⬅
            </button>
            <button
              className="absolute right-4 top-1/2 text-white text-2xl"
              onClick={nextImage}
            >
              ➡
            </button>

            <Image
              src={game.images[currentImageIndex]}
              alt="Imagem ampliada"
              width={800}
              height={600}
              className="max-w-full max-h-[90vh] rounded-lg"
            />
          </div>
        </Modal>
      </div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Carregando...</p>
          </div>
        </div>
      )}
    </div>
  );
}
