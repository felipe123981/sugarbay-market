import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProductDetails1692591290831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('products', [
      new TableColumn({
        name: 'categories',
        type: 'varchar[]',
        isNullable: true,
      }),
      new TableColumn({
        name: 'size',
        type: 'varchar',
        isNullable: true,
        comment: 'S, M, L, XL',
      }),
      new TableColumn({
        name: 'number',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
      new TableColumn({
        name: 'width',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
      new TableColumn({
        name: 'height',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
      new TableColumn({
        name: 'length',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
      new TableColumn({
        name: 'weight',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
      new TableColumn({
        name: 'brand',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'model',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'color',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'publisher',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'publisher');
    await queryRunner.dropColumn('products', 'color');
    await queryRunner.dropColumn('products', 'model');
    await queryRunner.dropColumn('products', 'brand');
    await queryRunner.dropColumn('products', 'weight');
    await queryRunner.dropColumn('products', 'length');
    await queryRunner.dropColumn('products', 'height');
    await queryRunner.dropColumn('products', 'width');
    await queryRunner.dropColumn('products', 'number');
    await queryRunner.dropColumn('products', 'size');
    await queryRunner.dropColumn('products', 'categories');
  }
}
