import 'dotenv/config';
import { AppDataSource } from './data-source.js';

async function migrate(): Promise<void> {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  await AppDataSource.destroy();
}

await migrate();
