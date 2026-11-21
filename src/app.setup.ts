import {
  type INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

const DEFAULT_BODY_LIMIT = '256kb';
const REQUEST_ID_HEADER = 'x-request-id';

export function configureApp(app: INestApplication): void {
  const bodyLimit = process.env.BODY_LIMIT ?? DEFAULT_BODY_LIMIT;
  app.use(cookieParser());
  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim()),
    credentials: true,
  });

  const isWebhook = (request: Request): boolean =>
    request.path.startsWith('/api/v1/webhooks/payments');

  app.use(
    '/api/v1/webhooks/payments',
    express.text({ type: () => true, limit: bodyLimit }),
    (request: Request, _response: Response, next: NextFunction) => {
      const raw = typeof request.body === 'string' ? request.body : '';
      let parsed: unknown = {};
      if (raw.length > 0) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          try {
            const firstKey = [...new URLSearchParams(raw).keys()][0] ?? '';
            parsed = firstKey.length > 0 ? JSON.parse(firstKey) : {};
          } catch {
            parsed = {};
          }
        }
      }
      request.body = parsed;
      next();
    },
  );

  const jsonParser = express.json({ limit: bodyLimit });
  const urlencodedParser = express.urlencoded({ extended: true, limit: bodyLimit });
  app.use((request: Request, response: Response, next: NextFunction) =>
    isWebhook(request) ? next() : jsonParser(request, response, next),
  );
  app.use((request: Request, response: Response, next: NextFunction) =>
    isWebhook(request) ? next() : urlencodedParser(request, response, next),
  );
  app.use((request: Request, response: Response, next: NextFunction) => {
    const header = request.headers[REQUEST_ID_HEADER];
    const requestId =
      typeof header === 'string' && header.length > 0 ? header : randomUUID();
    response.setHeader('X-Request-Id', requestId);
    next();
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
}
