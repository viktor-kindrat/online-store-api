import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CurrentUser, type AuthenticatedUser } from '../../../identity/public/index.js';
import type {
  PaymentInitiatedView,
  PaymentView,
} from '../../application/results/payment-views.js';
import { InitiatePaymentUseCase } from '../../application/use-cases/initiate-payment.use-case.js';
import { ListOrderPaymentsUseCase } from '../../application/use-cases/list-order-payments.use-case.js';
import { DEFAULT_PAYMENT_PROVIDER } from '../../payments.constants.js';

@Controller('orders/:orderId/payments')
export class PaymentsController {
  constructor(
    private readonly initiatePayment: InitiatePaymentUseCase,
    private readonly listOrderPayments: ListOrderPaymentsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  initiate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<PaymentInitiatedView> {
    return this.initiatePayment.execute({
      orderId,
      customerId: user.id,
      providerName: DEFAULT_PAYMENT_PROVIDER,
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
