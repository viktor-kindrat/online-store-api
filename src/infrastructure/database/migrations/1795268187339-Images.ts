import { MigrationInterface, QueryRunner } from "typeorm";

export class Images1795268187339 implements MigrationInterface {
    name = 'Images1795268187339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_images" ("id" uuid NOT NULL, "productId" uuid NOT NULL, "objectKey" character varying(500) NOT NULL, "sortOrder" integer NOT NULL, CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b367708bf720c8dd62fc683316" ON "product_images"  ("productId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b367708bf720c8dd62fc683316"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
    }

}
