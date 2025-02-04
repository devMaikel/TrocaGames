"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Game } from "@/types/games";
import GameCard from "./components/GameCard";
import { fetchGames, fetchFilters } from "@/services/gameService";

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState("");

  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [title, setTitle] = useState("");

  const [platforms, setPlatforms] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");
    if (!token || !userId) {
      router.push("/login");
    } else {
      setUserId(userId);
      loadFilters();
      loadGames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, currentPage, platform, genre, title]);

  const loadFilters = async () => {
    try {
      const data = await fetchFilters();
      setPlatforms(data.platforms);
      setGenres(data.genres);
    } catch (err) {
      console.log(err);
      setError("Erro ao carregar filtros");
    }
  };

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await fetchGames(currentPage, 12, platform, genre, title);
      setGames(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (err) {
      console.log(err);
      setError("Erro ao carregar jogos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Catálogo de jogos
      </h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-auto"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-auto text-gray-800"
        >
          <option value="">Todas as Plataformas</option>
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-auto text-gray-800"
        >
          <option value="">Todos os Gêneros</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Carregando...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              if (game.ownerId !== userId)
                return <GameCard key={game.id} game={game} />;
            })}
          </div>

          <div className="flex justify-center mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`mx-1 px-4 py-2 rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
      {loading && (
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
