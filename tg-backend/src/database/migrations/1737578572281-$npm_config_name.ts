import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUsersAndGamesTables implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'bio',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'profilePicture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'games',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'platform',
            type: 'enum',
            enum: [
              'Atari',
              'Nintendo',
              'Super Nintendo',
              'Nintendo 64',
              'GameCube',
              'Wii',
              'Wii U',
              'Switch',
              'PlayStation 1',
              'PlayStation 2',
              'PlayStation 3',
              'PlayStation 4',
              'PlayStation 5',
              'Xbox',
              'Xbox 360',
              'Xbox One',
              'Xbox Series X',
              'PC',
            ],
            isNullable: false,
          },
          {
            name: 'genre',
            type: 'enum',
            enum: [
              'Action',
              'Adventure',
              'RPG',
              'First-Person Shooter',
              'Strategy',
              'Simulation',
              'Sports',
              'Fighting',
              'Puzzle',
              'Horror',
              'Platformer',
              'Racing',
            ],
            isNullable: false,
          },
          {
            name: 'price',
            type: 'decimal(10,2)',
            isNullable: true,
          },
          {
            name: 'forTrade',
            type: 'boolean',
            default: false,
          },
          {
            name: 'coverImage',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'ownerId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    // Criando a chave estrangeira entre jogos e usuários
    await queryRunner.createForeignKey(
      'games',
      new TableForeignKey({
        columnNames: ['ownerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('games', 'FK_games_ownerId'); // Substitua pelo nome da chave estrangeira gerada
    await queryRunner.dropTable('games');
    await queryRunner.dropTable('users');
  }
}
