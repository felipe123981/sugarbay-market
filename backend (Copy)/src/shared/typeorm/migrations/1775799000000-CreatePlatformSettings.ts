import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePlatformSettings1775799000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'platform_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tax_rate',
            type: 'decimal',
            precision: 10,
            scale: 4,
            default: 0,
          },
          {
            name: 'profit_margin',
            type: 'decimal',
            precision: 10,
            scale: 4,
            default: 0,
          },
          {
            name: 'packaging_cost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'shipping_cost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    );

    // Insert default settings
    await queryRunner.query(
      `INSERT INTO platform_settings (tax_rate, profit_margin, packaging_cost, shipping_cost) VALUES (0.10, 0.20, 2.50, 8.50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('platform_settings');
  }
}
