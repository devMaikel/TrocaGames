"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Game } from "@/types/games";
import GameCard from "../home/components/GameCard";
import { toast } from "react-toastify";
import { getUserDataByToken } from "@/services/userService";

export default function MyGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserGames = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Token não encontrado no localStorage");
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const response = await getUserDataByToken();

        if (response.ok) {
          const data = await response.json();
          setGames(data.games || []);
        } else if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
          toast.error("Sessão expirada. Faça login novamente.");
        } else {
          setError("Erro ao buscar dados do usuário");
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGames();
  }, [router]);

  if (loading) {
    return <p className="text-center text-gray-600">Carregando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Meus Jogos
      </h1>

      {games.length === 0 ? (
        <p className="text-center text-gray-600">Nenhum jogo cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
