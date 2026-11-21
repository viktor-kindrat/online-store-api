import { IsString, MaxLength, MinLength } from 'class-validator';

export class ProductAttributeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  value!: string;
}
