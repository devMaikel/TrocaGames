export interface User {
  id: string;
  name: string;
}

export interface Game {
  title: string;
  platform: string;
  price: string;
}

export interface Message {
  sender: User;
  content: string;
  createdAt: string;
}

export interface Chat {
  id: number;
  gameId: number;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  game: Game;
  buyer: User;
  seller: User;
  messages: Message[];
}
