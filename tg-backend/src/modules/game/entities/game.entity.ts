import { User } from '../../user/entities/user.entity';

export class Game {
  id: number = 0;
  title: string = '';
  description?: string;
  platform: string = '';
  genre: string = '';
  price: number = 0;
  forTrade: boolean = false;
  images?: string[] = [];
  createdAt: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
  ownerId: string = '';
  owner?: User;
}
