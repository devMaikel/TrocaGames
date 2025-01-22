import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { GameGenre, Platform } from 'src/utils/enum';
import { IsEnum } from '@nestjs/class-validator';

@Entity('games')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: Platform,
  })
  @IsEnum(Platform, { message: 'Plataforma inválida' })
  platform: Platform;

  @Column({
    type: 'enum',
    enum: GameGenre,
  })
  @IsEnum(GameGenre, { message: 'Gênero inválido' })
  genre: GameGenre;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: false })
  forTrade: boolean;

  @Column({ nullable: true })
  coverImage: string;

  @ManyToOne(() => UserEntity, (user) => user.games, { onDelete: 'CASCADE' })
  owner: UserEntity;
}
