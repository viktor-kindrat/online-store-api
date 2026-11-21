import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: '5433',
      DATABASE_USER: 'online_store',
      DATABASE_PASSWORD: 'online_store',
      DATABASE_NAME: 'online_store_test',
      DATABASE_SSL: 'false',
      DATABASE_LOGGING: 'false',
      JWT_ACCESS_SECRET: 'test_access_secret_change_me_32chars',
      JWT_ACCESS_TTL: '900s',
      REFRESH_TTL_DAYS: '7',
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'admin12345',
    },
  },
});
