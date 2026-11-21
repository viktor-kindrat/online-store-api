import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';
import {
  TOKEN_SERVICE,
  type TokenService,
} from '../src/modules/identity/application/ports/token-service.port.js';

const TABLES = [
  'payment_attempts',
  'payments',
  'order_items',
  'orders',
  'stock_reservations',
  'stock_balances',
  'cart_items',
  'carts',
  'promotion_redemptions',
  'promotions',
  'products',
  'categories',
  'refresh_sessions',
  'user_accounts',
];

describe('Online store purchase flow (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let customerToken: string;
  let categoryId: string;
  let productId: string;
  let orderId: string;
  let providerReference: string;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a customer', async () => {
    const response = await request(server())
      .post('/api/v1/auth/register')
      .send({ email: 'buyer@example.com', password: 'customer123' })
      .expect(201);
    const body = response.body as { id: string; role: string };
    expect(body.role).toBe('CUSTOMER');
    const tokens = app.get<TokenService>(TOKEN_SERVICE);
    customerToken = await tokens.issueAccessToken({
      sub: body.id,
      role: 'CUSTOMER',
    });
  });

  it('rejects a customer on an admin route', async () => {
    await request(server())
      .post('/api/v1/admin/categories')
      .set('Authorization', auth(customerToken))
      .send({ name: 'X', slug: 'x' })
      .expect(403);
  });

  it('rejects an unauthenticated cart request', async () => {
    await request(server()).get('/api/v1/cart').expect(401);
  });

  it('lets an admin create a category and product with stock', async () => {
    const category = await request(server())
      .post('/api/v1/admin/categories')
      .set('Authorization', auth(adminToken))
      .send({ name: 'Books', slug: 'books' })
      .expect(201);
    categoryId = (category.body as { id: string }).id;

    const product = await request(server())
      .post('/api/v1/admin/products')
      .set('Authorization', auth(adminToken))
      .send({
        categoryId,
        name: 'Clean Architecture',
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
  });

  it('adds to cart and places an order that reserves stock', async () => {
    const cart = await request(server())
      .post('/api/v1/cart/items')
      .set('Authorization', auth(customerToken))
      .send({ productId, quantity: 2 })
      .expect(201);
    expect((cart.body as { subtotalMinor: number }).subtotalMinor).toBe(20000);

    const order = await request(server())
      .post('/api/v1/orders')
      .set('Authorization', auth(customerToken))
      .send({
        deliveryMethod: 'COURIER',
        shippingAddress: { city: 'Lviv', street: 'Main 1', postalCode: '79000' },
      })
      .expect(201);
    const body = order.body as { id: string; status: string; totalMinor: number };
    orderId = body.id;
    expect(body.status).toBe('PENDING_PAYMENT');
    expect(body.totalMinor).toBe(25000);
  });

  it('pays the order via webhook and marks it PAID', async () => {
    const payment = await request(server())
      .post(`/api/v1/orders/${orderId}/payments`)
      .set('Authorization', auth(customerToken))
      .expect(201);
    providerReference = (
      payment.body as { providerReference: string }
    ).providerReference;

    await request(server())
      .post('/api/v1/webhooks/payments/mock')
      .send({ providerReference, outcome: 'SUCCEEDED' })
      .expect(200);

    const order = await request(server())
      .get(`/api/v1/orders/${orderId}`)
      .set('Authorization', auth(customerToken))
      .expect(200);
    expect((order.body as { status: string }).status).toBe('PAID');
  });

  it('is idempotent on a repeated webhook', async () => {
    await request(server())
      .post('/api/v1/webhooks/payments/mock')
      .send({ providerReference, outcome: 'SUCCEEDED' })
      .expect(200);
    const order = await request(server())
      .get(`/api/v1/orders/${orderId}`)
      .set('Authorization', auth(customerToken))
      .expect(200);
    expect((order.body as { status: string }).status).toBe('PAID');
  });

  it('rejects an order that exceeds available stock', async () => {
    await request(server())
      .post('/api/v1/cart/items')
      .set('Authorization', auth(customerToken))
      .send({ productId, quantity: 100 })
      .expect(201);

    const response = await request(server())
      .post('/api/v1/orders')
      .set('Authorization', auth(customerToken))
      .send({
        deliveryMethod: 'PICKUP',
        shippingAddress: { city: 'Lviv', street: 'Main 1', postalCode: '79000' },
      })
      .expect(409);
    expect((response.body as { code: string }).code).toBe('INSUFFICIENT_STOCK');
  });

  it('reports revenue for the paid order', async () => {
    const response = await request(server())
      .get('/api/v1/admin/reports/revenue')
      .set('Authorization', auth(adminToken))
      .expect(200);
    const body = response.body as { totalMinor: number; orderCount: number };
    expect(body.totalMinor).toBe(25000);
    expect(body.orderCount).toBe(1);
  });
});

type App = Parameters<typeof request>[0];
