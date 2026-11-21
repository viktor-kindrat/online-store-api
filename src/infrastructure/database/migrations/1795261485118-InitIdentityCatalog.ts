import { MigrationInterface, QueryRunner } from "typeorm";

export class InitIdentityCatalog1795261485118 implements MigrationInterface {
    name = 'InitIdentityCatalog1795261485118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL, "name" character varying(150) NOT NULL, "slug" character varying(160) NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_420d9f679d41281f282f5bc7d0" ON "categories"  ("slug") `);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL, "categoryId" uuid NOT NULL, "name" character varying(200) NOT NULL, "description" text NOT NULL, "priceMinor" integer NOT NULL, "status" character varying(20) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ff56834e735fa78a15d0cf2192" ON "products"  ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1846199852a695713b1f8f5e9a" ON "products"  ("status") `);
        await queryRunner.query(`CREATE TABLE "refresh_sessions" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "tokenHash" character varying(64) NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_9190032f6967b7971dca07d69f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_78744bff965517952df6c02da7" ON "refresh_sessions"  ("userId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2cc521fed1a42c97ac78b1ffb6" ON "refresh_sessions"  ("tokenHash") `);
        await queryRunner.query(`CREATE TABLE "user_accounts" ("id" uuid NOT NULL, "email" character varying(320) NOT NULL, "passwordHash" character varying(255) NOT NULL, "role" character varying(20) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_125e915cf23ad1cfb43815ce59b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_df3802ec9c31dd9491e3589378" ON "user_accounts"  ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_df3802ec9c31dd9491e3589378"`);
        await queryRunner.query(`DROP TABLE "user_accounts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2cc521fed1a42c97ac78b1ffb6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78744bff965517952df6c02da7"`);
        await queryRunner.query(`DROP TABLE "refresh_sessions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1846199852a695713b1f8f5e9a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff56834e735fa78a15d0cf2192"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_420d9f679d41281f282f5bc7d0"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
