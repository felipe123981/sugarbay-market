import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddSenderIdToReviews1692401256518 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.hasColumn('reviews', 'sender_id');

    if (!columnExists) {
      await queryRunner.addColumn(
        'reviews',
        new TableColumn({
          name: 'sender_id',
          type: 'uuid',
          isNullable: true,
        }),
      );
    }

    const table = await queryRunner.getTable('reviews');
    const foreignKeyExists = table?.foreignKeys.find(
      (fk) => fk.name === 'CustomerReviews',
    );

    if (!foreignKeyExists) {
      await queryRunner.createForeignKey(
        'reviews',
        new TableForeignKey({
          name: 'CustomerReviews',
          columnNames: ['sender_id'],
          referencedTableName: 'customers',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('reviews');
    const foreignKeyExists = table?.foreignKeys.find(
      (fk) => fk.name === 'CustomerReviews',
    );

    if (foreignKeyExists) {
      await queryRunner.dropForeignKey('reviews', 'CustomerReviews');
    }

    const columnExists = await queryRunner.hasColumn('reviews', 'sender_id');

    if (columnExists) {
      await queryRunner.dropColumn('reviews', 'sender_id');
    }
  }
}
