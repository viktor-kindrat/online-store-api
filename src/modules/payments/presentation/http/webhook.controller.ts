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
  async receive(
    @Param('provider') provider: string,
    @Body() payload: unknown,
  ): Promise<{ received: boolean }> {
    await this.handleWebhook.execute({ providerName: provider, payload });
    return { received: true };
  }
}
