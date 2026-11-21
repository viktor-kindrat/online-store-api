import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Public } from '../../../identity/public/index.js';
import { HandlePaymentWebhookUseCase } from '../../application/use-cases/handle-payment-webhook.use-case.js';

@Controller('webhooks/payments')
export class PaymentWebhookController {
  constructor(
    private readonly handleWebhook: HandlePaymentWebhookUseCase,
  ) {}

  @Public()
  @Post(':provider')
  @HttpCode(HttpStatus.OK)
  receive(
    @Param('provider') provider: string,
    @Body() payload: unknown,
  ): Promise<unknown> {
    return this.handleWebhook.execute({ providerName: provider, payload });
  }
}
