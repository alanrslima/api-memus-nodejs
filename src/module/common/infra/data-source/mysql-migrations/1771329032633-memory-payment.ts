import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class MemoryPayment1771329032633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "memory_payment",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "45",
            isPrimary: true,
          },
          {
            name: "order_id",
            type: "varchar",
            length: "45",
            isNullable: false,
          },
          {
            name: "provider",
            type: "varchar",
            length: "45",
            isNullable: false,
          },
          {
            name: "provider_payment_id",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "currency_code",
            type: "varchar",
            length: "3",
          },
          {
            name: "amount",
            type: "integer",
          },
          {
            name: "status",
            type: "varchar",
            length: "45",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      "memory_payment",
      new TableForeignKey({
        name: "FK_memory_payment_order_id",
        columnNames: ["order_id"],
        referencedTableName: "memory_order",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      "memory_payment",
      "FK_memory_payment_order_id",
    );
    await queryRunner.dropTable("memory_payment");
  }
}
