export interface Game {
  id: number;
  title: string;
  description: string;
  platform: string;
  genre: string;
  price: string;
  forTrade: boolean | string;
  images: string[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GamesApiResponse {
  data: Game[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
