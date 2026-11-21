import { MigrationInterface, QueryRunner } from "typeorm";

export class Idempotency1795268096126 implements MigrationInterface {
    name = 'Idempotency1795268096126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "idempotency_keys" ("key" character varying(255) NOT NULL, "ownerId" uuid NOT NULL, "requestFingerprint" character varying(64) NOT NULL, "responseStatus" integer NOT NULL, "responseBody" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_064421dc7615b93308778d19359" PRIMARY KEY ("key", "ownerId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "idempotency_keys"`);
    }

}
