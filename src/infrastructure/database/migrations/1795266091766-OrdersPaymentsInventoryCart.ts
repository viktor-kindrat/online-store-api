import { MigrationInterface, QueryRunner } from "typeorm";

export class OrdersPaymentsInventoryCart1795266091766 implements MigrationInterface {
    name = 'OrdersPaymentsInventoryCart1795266091766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL, "orderId" uuid NOT NULL, "amountMinor" integer NOT NULL, "provider" character varying(30) NOT NULL, "status" character varying(20) NOT NULL, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_af929a5f2a400fdb6913b4967e" ON "payments"  ("orderId") `);
        await queryRunner.query(`CREATE TABLE "cart_items" ("id" uuid NOT NULL, "cartId" uuid NOT NULL, "productId" uuid NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_edd714311619a5ad0952504583" ON "cart_items"  ("cartId") `);
        await queryRunner.query(`CREATE TABLE "carts" ("id" uuid NOT NULL, "customerId" uuid NOT NULL, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a4393093f31aabad6de1f54b0e" ON "carts"  ("customerId") `);
        await queryRunner.query(`CREATE TABLE "stock_balances" ("productId" uuid NOT NULL, "onHand" integer NOT NULL DEFAULT '0', "reserved" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_6840607b19b9f629d9c6845f31c" PRIMARY KEY ("productId"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL, "orderId" uuid NOT NULL, "productId" uuid NOT NULL, "productName" character varying(200) NOT NULL, "unitPriceMinor" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f1d359a55923bb45b057fbdab0" ON "order_items"  ("orderId") `);
        await queryRunner.query(`CREATE TABLE "payment_attempts" ("id" uuid NOT NULL, "paymentId" uuid NOT NULL, "providerReference" character varying(100) NOT NULL, "status" character varying(20) NOT NULL, CONSTRAINT "PK_a0d8a67c07a0fef98dfd20214e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6657761cef2e4909ca5c6cd201" ON "payment_attempts"  ("paymentId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_70e945ab8168e57ef104cf824f" ON "payment_attempts"  ("providerReference") `);
        await queryRunner.query(`CREATE TABLE "stock_reservations" ("id" uuid NOT NULL, "orderId" uuid NOT NULL, "productId" uuid NOT NULL, "quantity" integer NOT NULL, "status" character varying(20) NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_46ec0f5605d70f64654ad4e7bd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7a419986b1189abd6a4c618360" ON "stock_reservations"  ("orderId") `);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL, "customerId" uuid NOT NULL, "status" character varying(20) NOT NULL, "subtotalMinor" integer NOT NULL, "discountMinor" integer NOT NULL, "deliveryMethod" character varying(30) NOT NULL, "deliveryFeeMinor" integer NOT NULL, "totalMinor" integer NOT NULL, "shippingAddress" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e5de51ca888d8b1f5ac25799dd" ON "orders"  ("customerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_775c9f06fc27ae3ff8fb26f2c4" ON "orders"  ("status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_775c9f06fc27ae3ff8fb26f2c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e5de51ca888d8b1f5ac25799dd"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7a419986b1189abd6a4c618360"`);
        await queryRunner.query(`DROP TABLE "stock_reservations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70e945ab8168e57ef104cf824f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6657761cef2e4909ca5c6cd201"`);
        await queryRunner.query(`DROP TABLE "payment_attempts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1d359a55923bb45b057fbdab0"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "stock_balances"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a4393093f31aabad6de1f54b0e"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_edd714311619a5ad0952504583"`);
        await queryRunner.query(`DROP TABLE "cart_items"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af929a5f2a400fdb6913b4967e"`);
        await queryRunner.query(`DROP TABLE "payments"`);
    }

}
