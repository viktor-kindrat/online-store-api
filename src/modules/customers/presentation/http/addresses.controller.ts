import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser, type AuthenticatedUser } from '../../../identity/public/index.js';
import { CustomerAddressView } from '../../application/results/customer-views.js';
import { AddMyAddressUseCase } from '../../application/use-cases/add-my-address.use-case.js';
import { ListMyAddressesUseCase } from '../../application/use-cases/list-my-addresses.use-case.js';
import { RemoveMyAddressUseCase } from '../../application/use-cases/remove-my-address.use-case.js';
import { UpdateMyAddressUseCase } from '../../application/use-cases/update-my-address.use-case.js';
import { AddressRequestDto } from './dto/address.request.dto.js';

@Controller('customers/me/addresses')
export class AddressesController {
  constructor(
    private readonly listMyAddresses: ListMyAddressesUseCase,
    private readonly addMyAddress: AddMyAddressUseCase,
    private readonly updateMyAddress: UpdateMyAddressUseCase,
    private readonly removeMyAddress: RemoveMyAddressUseCase,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser): Promise<CustomerAddressView[]> {
    return this.listMyAddresses.execute(user.id);
  }

  @Post()
  add(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddressRequestDto,
  ): Promise<CustomerAddressView> {
    return this.addMyAddress.execute({ userId: user.id, input: dto });
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddressRequestDto,
  ): Promise<CustomerAddressView> {
    return this.updateMyAddress.execute({
      userId: user.id,
      addressId: id,
      input: dto,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.removeMyAddress.execute({ userId: user.id, addressId: id });
  }
}
