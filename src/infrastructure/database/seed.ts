import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { CategoryOrmEntity } from '../../modules/catalog/infrastructure/persistence/category.orm-entity.js';
import { ProductOrmEntity } from '../../modules/catalog/infrastructure/persistence/product.orm-entity.js';
import { UserAccountOrmEntity } from '../../modules/identity/infrastructure/persistence/user-account.orm-entity.js';
import { StockBalanceOrmEntity } from '../../modules/inventory/infrastructure/persistence/stock-balance.orm-entity.js';
import { PromotionOrmEntity } from '../../modules/promotions/infrastructure/persistence/promotion.orm-entity.js';
import { AppDataSource } from './data-source.js';

const SALT_ROUNDS = 12;

interface SeedProduct {
  name: string;
  description: string;
  priceMinor: number;
  onHand: number;
}

const CATALOG: {
  category: { name: string; slug: string };
  products: SeedProduct[];
}[] = [
  {
    category: { name: 'Electronics', slug: 'electronics' },
    products: [
      {
        name: 'Wireless Headphones',
        description: 'Over-ear Bluetooth headphones with active noise cancelling',
        priceMinor: 249900,
        onHand: 25,
      },
      {
        name: 'Mechanical Keyboard',
        description: 'Hot-swappable RGB mechanical keyboard',
        priceMinor: 329900,
        onHand: 15,
      },
      {
        name: 'USB-C Hub',
        description: '7-in-1 USB-C adapter with HDMI and card reader',
        priceMinor: 89900,
        onHand: 40,
      },
    ],
  },
  {
    category: { name: 'Books', slug: 'books' },
    products: [
      {
        name: 'Clean Architecture',
        description: 'Robert C. Martin — a craftsman guide to software structure',
        priceMinor: 59900,
        onHand: 30,
      },
      {
        name: 'Domain-Driven Design',
        description: 'Eric Evans — tackling complexity in the heart of software',
        priceMinor: 74900,
        onHand: 12,
      },
    ],
  },
];

async function seedAdmin(): Promise<void> {
  const users = AppDataSource.getRepository(UserAccountOrmEntity);
  const email = (process.env.ADMIN_EMAIL ?? 'admin@example.com').toLowerCase();
  if (await users.findOne({ where: { email } })) {
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
  await users.save(admin);
}

async function seedCatalog(): Promise<void> {
  const categories = AppDataSource.getRepository(CategoryOrmEntity);
  const products = AppDataSource.getRepository(ProductOrmEntity);
  const balances = AppDataSource.getRepository(StockBalanceOrmEntity);
  for (const entry of CATALOG) {
    let category = await categories.findOne({
      where: { slug: entry.category.slug },
    });
    if (!category) {
      category = new CategoryOrmEntity();
      category.id = randomUUID();
      category.name = entry.category.name;
      category.slug = entry.category.slug;
      await categories.save(category);
    }
    for (const seedProduct of entry.products) {
      if (await products.findOne({ where: { name: seedProduct.name } })) {
        continue;
      }
      const product = new ProductOrmEntity();
      product.id = randomUUID();
      product.categoryId = category.id;
      product.name = seedProduct.name;
      product.description = seedProduct.description;
      product.priceMinor = seedProduct.priceMinor;
      product.status = 'ACTIVE';
      await products.save(product);

      const balance = new StockBalanceOrmEntity();
      balance.productId = product.id;
      balance.onHand = seedProduct.onHand;
      balance.reserved = 0;
      await balances.save(balance);
    }
  }
}

async function seedPromotion(): Promise<void> {
  const promotions = AppDataSource.getRepository(PromotionOrmEntity);
  if (await promotions.findOne({ where: { code: 'WELCOME10' } })) {
    return;
  }
  const promotion = new PromotionOrmEntity();
  promotion.id = randomUUID();
  promotion.code = 'WELCOME10';
  promotion.discountType = 'PERCENTAGE';
  promotion.value = 10;
  promotion.minOrderMinor = 0;
  promotion.usageLimit = 1000;
  promotion.expiresAt = new Date('2030-01-01T00:00:00.000Z');
  await promotions.save(promotion);
}

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  await seedAdmin();
  await seedCatalog();
  await seedPromotion();
  await AppDataSource.destroy();
}

await seed();
