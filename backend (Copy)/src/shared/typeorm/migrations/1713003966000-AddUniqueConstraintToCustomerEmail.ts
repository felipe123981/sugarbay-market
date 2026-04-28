import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddUniqueConstraintToCustomerEmail1713003966000 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primeiro, remover registros duplicados mantendo apenas o mais recente
    await queryRunner.query(`
      DELETE FROM customers
      WHERE id NOT IN (
        SELECT DISTINCT ON (email) id
        FROM customers
        ORDER BY email, created_at DESC
      )
    `);

    // Em seguida, adicionar a restrição UNIQUE
    await queryRunner.query(`
      ALTER TABLE customers
      ADD CONSTRAINT "UQ_customer_email" UNIQUE (email)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE customers
      DROP CONSTRAINT "UQ_customer_email"
    `);
  }

}