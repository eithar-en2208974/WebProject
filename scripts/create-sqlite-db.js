const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

async function main() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  const migrationPath = path.join(__dirname, "..", "prisma", "migrations", "000_init", "migration.sql");
  const dbPath = path.join(__dirname, "..", "prisma", "dev.db");

  db.run(fs.readFileSync(migrationPath, "utf8"));
  fs.writeFileSync(dbPath, Buffer.from(db.export()));
  db.close();

  console.log(`Created ${dbPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
