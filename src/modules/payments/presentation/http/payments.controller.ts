import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CurrentUser, type AuthenticatedUser } from '../../../identity/public/index.js';
import { IdempotencyInterceptor } from '../../../../shared/idempotency/idempotency.interceptor.js';
import type { Env } from '../../../../infrastructure/config/env.schema.js';
import {
  PaymentInitiatedView,
  PaymentView,
} from '../../application/results/payment-views.js';
import { InitiatePaymentUseCase } from '../../application/use-cases/initiate-payment.use-case.js';
import { ListOrderPaymentsUseCase } from '../../application/use-cases/list-order-payments.use-case.js';

@Controller('orders/:orderId/payments')
export class PaymentsController {
  constructor(
    private readonly initiatePayment: InitiatePaymentUseCase,
    private readonly listOrderPayments: ListOrderPaymentsUseCase,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(IdempotencyInterceptor)
  initiate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<PaymentInitiatedView> {
    return this.initiatePayment.execute({
      orderId,
      customerId: user.id,
      providerName: this.config.get('PAYMENT_PROVIDER', { infer: true }),
    });
  }

  @Get()
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<PaymentView[]> {
    return this.listOrderPayments.execute({ orderId, customerId: user.id });
  }
}
