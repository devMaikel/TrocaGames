import { Game } from '../../game/entities/game.entity';

export class User {
  id: string = '';
  name: string = '';
  email: string = '';
  password: string = '';
  profilePicture?: string;
  bio?: string;
  createdAt: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
  games?: Game[];
}
