import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser, type AuthenticatedUser } from '../../../identity/public/index.js';
import type { QuoteView } from '../../application/results/quote-view.js';
import { QuoteCheckoutUseCase } from '../../application/use-cases/quote-checkout.use-case.js';
import { QuoteCheckoutRequestDto } from './dto/quote-checkout.request.dto.js';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly quoteCheckout: QuoteCheckoutUseCase) {}

  @Post('quote')
  @HttpCode(HttpStatus.OK)
  quote(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: QuoteCheckoutRequestDto,
  ): Promise<QuoteView> {
    return this.quoteCheckout.execute({
      customerId: user.id,
      deliveryMethod: dto.deliveryMethod,
      ...(dto.promoCode !== undefined ? { promoCode: dto.promoCode } : {}),
    });
  }
}
