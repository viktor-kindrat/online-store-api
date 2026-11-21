import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { UserAccountOrmEntity } from '../../modules/identity/infrastructure/persistence/user-account.orm-entity.js';
import { AppDataSource } from './data-source.js';

const SALT_ROUNDS = 12;

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  const repository = AppDataSource.getRepository(UserAccountOrmEntity);
  const email = (process.env.ADMIN_EMAIL ?? 'admin@example.com').toLowerCase();
  const existing = await repository.findOne({ where: { email } });
  if (existing) {
    await AppDataSource.destroy();
    return;
  }
  const admin = new UserAccountOrmEntity();
  admin.id = randomUUID();
  admin.email = email;
  admin.passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? 'admin12345',
    SALT_ROUNDS,
  );
  admin.role = 'ADMIN';
  await repository.save(admin);
  await AppDataSource.destroy();
}

await seed();
