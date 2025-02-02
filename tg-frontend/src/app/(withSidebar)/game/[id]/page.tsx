// export default function GameDetails() {
//   return <div>Ainda não tem nada aqui rsrs</div>;
// }
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Game } from "@/types/games";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { toast } from "react-toastify";
import { gameDetails } from "@/services/gameService";
import { createChat } from "@/services/chatService";

interface GameDetailsProps {
  params: Params;
}

type Params = Promise<{ id: string }>;

export default function GameDetails({ params }: GameDetailsProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  const paramsUse = use(params);
  const id = paramsUse.id;

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await gameDetails(id);

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setGame(data);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{game.title}</h1>
      <div className="mb-6">
        {game.images && game.images.length > 0 ? (
          <Swiper
            pagination={{
              type: "fraction",
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="w-full h-64 rounded-lg overflow-hidden"
          >
            {game.images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-64">
                  <Image
                    src={image}
                    alt={`Imagem ${index + 1} do jogo ${game.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
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
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição:
          </label>
          <p className="mt-1 text-gray-900">{game.description}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Plataforma:
          </label>
          <p className="mt-1 text-gray-900">{game.platform}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gênero:
          </label>
          <p className="mt-1 text-gray-900">{game.genre}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preço:
          </label>
          <p className="mt-1 text-gray-900">R$ {game.price}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Disponível para troca:
          </label>
          <p className="mt-1 text-gray-900">{game.forTrade ? "Sim" : "Não"}</p>
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
      </div>
    </div>
  );
}
