import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';

async function exportOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    preview: true,
    logger: false,
  });
  configureApp(app);
  const config = new DocumentBuilder()
    .setTitle('Online Store API')
    .setDescription('Variant 13 — online store management system')
    .setVersion('1')
    .addCookieAuth('access_token')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('openapi.json', `${JSON.stringify(document, null, 2)}\n`);
  await app.close();
}

await exportOpenApi();
