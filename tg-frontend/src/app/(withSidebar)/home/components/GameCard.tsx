import { Game } from "@/types/games";
import Image from "next/image";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const imageUrl = game.images[0]
    ? `${game.images[0]}?w=300&h=200&c=fill&f=webp`
    : "/images/defaultGame2.webp";

  return (
    <div key={game.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="relative w-full h-48 rounded-md mb-4">
        <Image
          src={imageUrl}
          alt={game.title}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{game.title}</h2>
      <p className="text-gray-600">{game.description}</p>
      <p className="text-gray-700 mt-2">
        <strong>Plataforma:</strong> {game.platform}
      </p>
      <p className="text-gray-700">
        <strong>Gênero:</strong> {game.genre}
      </p>
      <p className="text-gray-700">
        <strong>Preço:</strong> R$ {game.price}
      </p>
      <p className="text-gray-700">
        <strong>Disponível para troca:</strong> {game.forTrade ? "Sim" : "Não"}
      </p>
    </div>
  );
}
