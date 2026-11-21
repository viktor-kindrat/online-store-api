import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductAttributesAndMedia1795274927336 implements MigrationInterface {
    name = 'ProductAttributesAndMedia1795274927336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media_assets" ("id" uuid NOT NULL, "objectKey" character varying(500) NOT NULL, "contentType" character varying(150) NOT NULL, CONSTRAINT "PK_ca47e9f67a5e5d8af1e75d66ee6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_attributes" ("id" uuid NOT NULL, "productId" uuid NOT NULL, "name" character varying(100) NOT NULL, "value" character varying(500) NOT NULL, "sortOrder" integer NOT NULL, CONSTRAINT "PK_4fa18fc5c893cb9894fc40ca921" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5b71e4ee5c131f84708b9a0f35" ON "product_attributes"  ("productId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5b71e4ee5c131f84708b9a0f35"`);
        await queryRunner.query(`DROP TABLE "product_attributes"`);
        await queryRunner.query(`DROP TABLE "media_assets"`);
    }

}
