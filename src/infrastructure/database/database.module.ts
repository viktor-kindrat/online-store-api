import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { Env } from '../config/env.schema.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST', { infer: true }),
        port: config.get('DATABASE_PORT', { infer: true }),
        username: config.get('DATABASE_USER', { infer: true }),
        password: config.get('DATABASE_PASSWORD', { infer: true }),
        database: config.get('DATABASE_NAME', { infer: true }),
        ssl: config.get('DATABASE_SSL', { infer: true }),
        logging: config.get('DATABASE_LOGGING', { infer: true }),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: false,
        migrations: ['dist/infrastructure/database/migrations/*.js'],
      }),
    }),
  ],
})
export class DatabaseModule {}
