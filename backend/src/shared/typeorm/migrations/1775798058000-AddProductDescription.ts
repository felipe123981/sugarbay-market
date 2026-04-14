import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProductDescription1775798058000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.hasColumn('products', 'description');

    if (!columnExists) {
      await queryRunner.addColumn(
        'products',
        new TableColumn({
          name: 'description',
          type: 'text',
          isNullable: true,
          default: null,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.hasColumn('products', 'description');

    if (columnExists) {
      await queryRunner.dropColumn('products', 'description');
    }
  }
}
