import { join } from "path";
import { DataSource } from "typeorm";
import { env } from "../../main";

export const typeormDataSource = new DataSource({
  type: "mysql",
  host: env.MYSQL_HOST,
  port: Number(env.MYSQL_PORT),
  username: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  migrationsRun: true,
  synchronize: false,
  logging: false,
  migrations: [join(__dirname, "mysql-migrations", "*.{ts,js}")],
});
