import { IsInt, IsISO8601, IsOptional, Min } from 'class-validator';

export class UpdatePromotionRequestDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  value?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minOrderMinor?: number;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  usageLimit?: number;
}
