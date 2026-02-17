import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateMemory1740967161468 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "memory",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            length: "45",
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "start_date",
            type: "datetime",
            isNullable: true,
          },
          {
            name: "cover_image",
            type: "varchar",
            length: "45",
            isNullable: true,
          },
          {
            name: "selected_plan_id",
            type: "varchar",
            length: "45",
            isNullable: true,
          },
          {
            name: "user_id",
            type: "varchar",
            length: "45",
            isNullable: false,
          },
          {
            name: "automatic_guest_approval",
            type: "boolean",
            default: true,
          },
          {
            name: "status",
            type: "varchar",
            length: "45",
            isNullable: true,
          },
          {
            name: "privacy_mode",
            type: "varchar",
            length: "45",
          },
          {
            name: "about",
            type: "text",
            isNullable: true,
          },
          {
            name: "photos_count",
            type: "int",
            default: 0,
          },
          {
            name: "videos_count",
            type: "int",
            default: 0,
          },
          {
            name: "photos_granted",
            type: "int",
            isNullable: true,
          },
          {
            name: "videos_granted",
            type: "int",
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
      "memory",
      new TableForeignKey({
        name: "FK_memory_user_id",
        columnNames: ["user_id"],
        referencedTableName: "user",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("memory", "FK_memory_user_id");
    await queryRunner.dropTable("memory");
  }
}
