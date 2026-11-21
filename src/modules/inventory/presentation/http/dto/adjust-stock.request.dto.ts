import { IsInt, IsUUID, Max, Min } from 'class-validator';

const MAX_ON_HAND = 1_000_000;

export class AdjustStockRequestDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(0)
  @Max(MAX_ON_HAND)
  onHand!: number;
}
