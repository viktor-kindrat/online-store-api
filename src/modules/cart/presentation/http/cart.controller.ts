import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser, type AuthenticatedUser } from '../../../identity/public/index.js';
import { CartView } from '../../application/results/cart-view.js';
import { AddCartItemUseCase } from '../../application/use-cases/add-cart-item.use-case.js';
import { ChangeCartItemQuantityUseCase } from '../../application/use-cases/change-cart-item-quantity.use-case.js';
import { GetCartUseCase } from '../../application/use-cases/get-cart.use-case.js';
import { RemoveCartItemUseCase } from '../../application/use-cases/remove-cart-item.use-case.js';
import { AddCartItemRequestDto } from './dto/add-cart-item.request.dto.js';
import { ChangeCartItemRequestDto } from './dto/change-cart-item.request.dto.js';

@Controller('cart')
export class CartController {
  constructor(
    private readonly getCart: GetCartUseCase,
    private readonly addItem: AddCartItemUseCase,
    private readonly changeQuantity: ChangeCartItemQuantityUseCase,
    private readonly removeItem: RemoveCartItemUseCase,
  ) {}

  @Get()
  get(@CurrentUser() user: AuthenticatedUser): Promise<CartView> {
    return this.getCart.execute(user.id);
  }

  @Post('items')
  add(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddCartItemRequestDto,
  ): Promise<CartView> {
    return this.addItem.execute({
      customerId: user.id,
      productId: dto.productId,
      quantity: dto.quantity,
    });
  }

  @Patch('items/:id')
  change(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeCartItemRequestDto,
  ): Promise<CartView> {
    return this.changeQuantity.execute({
      customerId: user.id,
      itemId: id,
      quantity: dto.quantity,
    });
  }

  @Delete('items/:id')
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CartView> {
    return this.removeItem.execute({ customerId: user.id, itemId: id });
  }
}
