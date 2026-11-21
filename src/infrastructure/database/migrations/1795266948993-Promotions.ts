import { MigrationInterface, QueryRunner } from "typeorm";

export class Promotions1795266948993 implements MigrationInterface {
    name = 'Promotions1795266948993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promotion_redemptions" ("id" uuid NOT NULL, "promotionId" uuid NOT NULL, "orderId" uuid NOT NULL, CONSTRAINT "PK_17e98da71097f78ff330df148f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b6fe6571338dcc58ad782a14a8" ON "promotion_redemptions"  ("promotionId") `);
        await queryRunner.query(`CREATE TABLE "promotions" ("id" uuid NOT NULL, "code" character varying(50) NOT NULL, "discountType" character varying(20) NOT NULL, "value" integer NOT NULL, "minOrderMinor" integer NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "usageLimit" integer NOT NULL, CONSTRAINT "PK_380cecbbe3ac11f0e5a7c452c34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8ab10e580f70c3d2e2e4b31ebf" ON "promotions"  ("code") `);
        await queryRunner.query(`ALTER TABLE "orders" ADD "promotionId" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "promotionId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ab10e580f70c3d2e2e4b31ebf"`);
        await queryRunner.query(`DROP TABLE "promotions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b6fe6571338dcc58ad782a14a8"`);
        await queryRunner.query(`DROP TABLE "promotion_redemptions"`);
    }

}
