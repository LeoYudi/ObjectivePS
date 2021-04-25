import { createConnection } from 'typeorm';

createConnection().then(async (connection) => {
  await connection.runMigrations();
}).catch((error) => console.log(error));