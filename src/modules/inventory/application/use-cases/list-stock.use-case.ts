import { Inject, Injectable } from '@nestjs/common';
import {
  INVENTORY_PORT,
  type InventoryPort,
  type StockBalanceView,
} from '../../public/inventory.port.js';

@Injectable()
export class ListStockUseCase {
  constructor(
    @Inject(INVENTORY_PORT) private readonly inventory: InventoryPort,
  ) {}

  execute(): Promise<StockBalanceView[]> {
    return this.inventory.listBalances();
  }
}
