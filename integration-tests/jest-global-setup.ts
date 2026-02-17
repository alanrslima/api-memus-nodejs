export default async () => {
  process.env.MYSQL_HOST = "127.0.0.1";
  process.env.MYSQL_USER = "root";
  process.env.MYSQL_PASSWORD = "root";
  process.env.MYSQL_DATABASE = "memus";
  process.env.MYSQL_PORT = "3306";
};
