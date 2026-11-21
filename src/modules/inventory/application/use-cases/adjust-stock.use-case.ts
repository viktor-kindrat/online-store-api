import { Inject, Injectable } from '@nestjs/common';
import { INVENTORY_PORT, type InventoryPort } from '../../public/inventory.port.js';

export interface AdjustStockCommand {
  productId: string;
  onHand: number;
}

@Injectable()
export class AdjustStockUseCase {
  constructor(
    @Inject(INVENTORY_PORT) private readonly inventory: InventoryPort,
  ) {}

  execute(command: AdjustStockCommand): Promise<void> {
    return this.inventory.setOnHand(command.productId, command.onHand);
  }
}
