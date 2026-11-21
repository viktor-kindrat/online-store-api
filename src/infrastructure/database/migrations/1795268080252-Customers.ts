import { MigrationInterface, QueryRunner } from "typeorm";

export class Customers1795268080252 implements MigrationInterface {
    name = 'Customers1795268080252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer_addresses" ("id" uuid NOT NULL, "customerId" uuid NOT NULL, "city" character varying(120) NOT NULL, "street" character varying(200) NOT NULL, "postalCode" character varying(20) NOT NULL, CONSTRAINT "PK_336bda7b0a0cd04241f719fc834" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7bd088b1c8d3506953240ebf03" ON "customer_addresses"  ("customerId") `);
        await queryRunner.query(`CREATE TABLE "customer_profiles" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "firstName" character varying(100), "lastName" character varying(100), "phone" character varying(30), CONSTRAINT "PK_ece08ee55cbe707d9f870907727" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5b534069c56790acd59665798c" ON "customer_profiles"  ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5b534069c56790acd59665798c"`);
        await queryRunner.query(`DROP TABLE "customer_profiles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7bd088b1c8d3506953240ebf03"`);
        await queryRunner.query(`DROP TABLE "customer_addresses"`);
    }

}
