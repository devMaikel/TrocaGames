"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { gameAdd, gameAddImage } from "@/services/gameService";

export default function NewGamePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [forTrade, setForTrade] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setImages((prevImages) => [...prevImages, ...files]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Faça login para cadastrar um jogo.");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const gameResponse = await gameAdd(
        title,
        description,
        platform,
        genre,
        price,
        forTrade
      );
      if (!gameResponse.ok) {
        throw new Error("Erro ao cadastrar o jogo.");
      }

      const gameData = await gameResponse.json();
      const gameId = gameData.id;

      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);

        const imageResponse = await gameAddImage(gameId, formData);

        if (!imageResponse.ok) {
          throw new Error("Erro ao enviar uma imagem.");
        }
      }

      toast.success("Jogo cadastrado com sucesso!");
      router.push("/my-games");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar o jogo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Cadastrar Novo Jogo
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descrição:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Plataforma:
          </label>
          <input
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gênero:
          </label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preço:
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Disponível para troca:
          </label>
          <select
            value={forTrade ? "true" : "false"}
            onChange={(e) => setForTrade(e.target.value === "true")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Imagens (até 5):
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-900"
          />
          {images.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-900">
                {images.length} imagem(s) selecionada(s).
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? "Cadastrando..." : "Cadastrar Jogo"}
        </button>
      </form>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">
              Aguarde um instante enquanto conectamos ao servidor...(pode levar
              até um minuto)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
