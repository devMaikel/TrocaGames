import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GameEntity } from '../../games/entities/game.entity';

@Entity('users') // Nome da tabela
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;

  @OneToMany(() => GameEntity, (game) => game.owner)
  games: GameEntity[];
}
