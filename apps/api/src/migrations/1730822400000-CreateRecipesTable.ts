import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRecipesTable1730822400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recipes',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'ingredients',
            type: 'text',
            isNullable: false,
            comment: 'JSON array of ingredient objects',
          },
          {
            name: 'instructions',
            type: 'text',
            isNullable: false,
            comment: 'JSON array of instruction strings',
          },
          {
            name: 'prepTimeMinutes',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'cookTimeMinutes',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'servings',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('recipes');
  }
}
