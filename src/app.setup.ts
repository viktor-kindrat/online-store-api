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
  app.use(express.json({ limit: bodyLimit }));
  app.use(express.urlencoded({ extended: true, limit: bodyLimit }));
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
