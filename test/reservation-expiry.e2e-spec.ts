import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import { ExpireReservationsUseCase } from '../src/modules/orders/application/use-cases/expire-reservations.use-case.js';
import {
  TOKEN_SERVICE,
  type TokenService,
} from '../src/modules/identity/application/ports/token-service.port.js';

type App = Parameters<typeof request>[0];

const TABLES = [
  'payment_attempts',
  'payments',
  'order_items',
  'orders',
  'stock_reservations',
  'stock_balances',
  'cart_items',
  'carts',
  'products',
  'categories',
  'user_accounts',
];

describe('Reservation expiry (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let customerToken: string;
  let productId: string;
  let orderId: string;

  const auth = (token: string): string => `Bearer ${token}`;
  const server = (): App => app.getHttpServer() as App;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();

    const dataSource = app.get(DataSource);
    await dataSource.query(
      `TRUNCATE TABLE ${TABLES.join(', ')} RESTART IDENTITY CASCADE`,
    );

    const tokens = app.get<TokenService>(TOKEN_SERVICE);
    adminToken = await tokens.issueAccessToken({
      sub: randomUUID(),
      role: 'ADMIN',
    });

    const registration = await request(server())
      .post('/api/v1/auth/register')
      .send({ email: 'expiry-buyer@example.com', password: 'customer123' })
      .expect(201);
    customerToken = await tokens.issueAccessToken({
      sub: (registration.body as { id: string }).id,
      role: 'CUSTOMER',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('cancels an unpaid order once its reservation has expired', async () => {
    const category = await request(server())
      .post('/api/v1/admin/categories')
      .set('Authorization', auth(adminToken))
      .send({ name: 'Books', slug: 'books' })
      .expect(201);
    const product = await request(server())
      .post('/api/v1/admin/products')
      .set('Authorization', auth(adminToken))
      .send({
        categoryId: (category.body as { id: string }).id,
        name: 'Book',
        description: 'Book',
        priceMinor: 10000,
      })
      .expect(201);
    productId = (product.body as { id: string }).id;
    await request(server())
      .post('/api/v1/admin/inventory/adjustments')
      .set('Authorization', auth(adminToken))
      .send({ productId, onHand: 5 })
      .expect(204);

    await request(server())
      .post('/api/v1/cart/items')
      .set('Authorization', auth(customerToken))
      .send({ productId, quantity: 2 })
      .expect(201);
    const order = await request(server())
      .post('/api/v1/orders')
      .set('Authorization', auth(customerToken))
      .send({
        deliveryMethod: 'PICKUP',
        shippingAddress: { city: 'Lviv', street: 'Main', postalCode: '79000' },
      })
      .expect(201);
    orderId = (order.body as { id: string }).id;

    const dataSource = app.get(DataSource);
    await dataSource.query(
      `UPDATE stock_reservations SET "expiresAt" = now() - interval '1 hour' WHERE "orderId" = $1`,
      [orderId],
    );

    const cancelled = await app.get(ExpireReservationsUseCase).execute();
    expect(cancelled).toBeGreaterThanOrEqual(1);

    const refreshed = await request(server())
      .get(`/api/v1/orders/${orderId}`)
      .set('Authorization', auth(customerToken))
      .expect(200);
    expect((refreshed.body as { status: string }).status).toBe('CANCELLED');

    const inventory = await request(server())
      .get('/api/v1/admin/inventory')
      .set('Authorization', auth(adminToken))
      .expect(200);
    const balance = (
      inventory.body as Array<{ productId: string; reserved: number }>
    ).find((row) => row.productId === productId);
    expect(balance?.reserved).toBe(0);
  });
});
