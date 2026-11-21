import { IsInt, IsUUID, Min } from 'class-validator';

export class AdjustStockRequestDto {
  @IsUUID()
  productId!: string;

  @IsInt()
  @Min(0)
  onHand!: number;
}
