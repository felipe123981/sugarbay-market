import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class UpdateOrdersAndOrdersProducts1775799000001
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Update orders table
    // Check if customer_id exists before dropping (for idempotency)
    const table = await queryRunner.getTable('orders');
    if (table && table.findColumnByName('customer_id')) {
      await queryRunner.dropForeignKey('orders', 'OrdersCustomer');
      await queryRunner.dropColumn('orders', 'customer_id');
    }

    await queryRunner.addColumns('orders', [
      new TableColumn({
        name: 'buyer_id',
        type: 'uuid',
        isNullable: false,
      }),
      new TableColumn({
        name: 'seller_ids',
        type: 'uuid',
        isArray: true,
        isNullable: false,
      }),
      new TableColumn({
        name: 'total',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: false,
      }),
    ]);

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'OrdersBuyer',
        columnNames: ['buyer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // 2. Update orders_products table
    await queryRunner.addColumns('orders_products', [
      new TableColumn({
        name: 'final_price',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: false,
      }),
      new TableColumn({
        name: 'seller_id',
        type: 'uuid',
        isNullable: false,
      }),
      new TableColumn({
        name: 'buyer_id',
        type: 'uuid',
        isNullable: false,
      }),
    ]);

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'OrdersProductsSeller',
        columnNames: ['seller_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'orders_products',
      new TableForeignKey({
        name: 'OrdersProductsBuyer',
        columnNames: ['buyer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('orders_products', 'OrdersProductsBuyer');
    await queryRunner.dropForeignKey('orders_products', 'OrdersProductsSeller');
    await queryRunner.dropColumn('orders_products', 'buyer_id');
    await queryRunner.dropColumn('orders_products', 'seller_id');
    await queryRunner.dropColumn('orders_products', 'final_price');

    await queryRunner.dropForeignKey('orders', 'OrdersBuyer');
    await queryRunner.dropColumn('orders', 'total');
    await queryRunner.dropColumn('orders', 'seller_ids');
    await queryRunner.dropColumn('orders', 'buyer_id');

    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'OrdersCustomer',
        columnNames: ['customer_id'],
        referencedTableName: 'customers',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }
}
