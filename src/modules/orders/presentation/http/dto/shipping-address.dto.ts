import { IsString, MaxLength, MinLength } from 'class-validator';

export class ShippingAddressDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  city!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  street!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  postalCode!: string;
}
