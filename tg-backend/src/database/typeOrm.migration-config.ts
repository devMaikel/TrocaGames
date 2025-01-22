import { ConfigService } from '@nestjs/config';
import { GameEntity } from 'src/games/entities/game.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [UserEntity, GameEntity],
  migrations: [__dirname + '/migrations/*.ts'],
};

export default new DataSource(dataSourceOptions);
