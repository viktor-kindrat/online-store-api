import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_ADDRESS_REPOSITORY } from './application/ports/customer-address.repository.port.js';
import { CUSTOMER_PROFILE_REPOSITORY } from './application/ports/customer-profile.repository.port.js';
import { AddMyAddressUseCase } from './application/use-cases/add-my-address.use-case.js';
import { GetMyProfileUseCase } from './application/use-cases/get-my-profile.use-case.js';
import { ListMyAddressesUseCase } from './application/use-cases/list-my-addresses.use-case.js';
import { RemoveMyAddressUseCase } from './application/use-cases/remove-my-address.use-case.js';
import { UpdateMyAddressUseCase } from './application/use-cases/update-my-address.use-case.js';
import { UpdateMyProfileUseCase } from './application/use-cases/update-my-profile.use-case.js';
import { CustomerAddressOrmEntity } from './infrastructure/persistence/customer-address.orm-entity.js';
import { CustomerProfileOrmEntity } from './infrastructure/persistence/customer-profile.orm-entity.js';
import { TypeOrmCustomerAddressRepository } from './infrastructure/persistence/typeorm-customer-address.repository.js';
import { TypeOrmCustomerProfileRepository } from './infrastructure/persistence/typeorm-customer-profile.repository.js';
import { AddressesController } from './presentation/http/addresses.controller.js';
import { CustomersController } from './presentation/http/customers.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerProfileOrmEntity,
      CustomerAddressOrmEntity,
    ]),
  ],
  controllers: [CustomersController, AddressesController],
  providers: [
    GetMyProfileUseCase,
    UpdateMyProfileUseCase,
    ListMyAddressesUseCase,
    AddMyAddressUseCase,
    UpdateMyAddressUseCase,
    RemoveMyAddressUseCase,
    {
      provide: CUSTOMER_PROFILE_REPOSITORY,
      useClass: TypeOrmCustomerProfileRepository,
    },
    {
      provide: CUSTOMER_ADDRESS_REPOSITORY,
      useClass: TypeOrmCustomerAddressRepository,
    },
  ],
})
export class CustomersModule {}
