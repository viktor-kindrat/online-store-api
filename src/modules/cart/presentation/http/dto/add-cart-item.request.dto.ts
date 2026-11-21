import { IsInt, IsUUID, Max, Min } from 'class-validator';
import { CART_LIMITS } from '../../../domain/cart.constants.js';

export class AddCartItemRequestDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(1)
  @Max(CART_LIMITS.MAX_ITEM_QUANTITY)
  quantity!: number;
}
