import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { Roles } from '../../../identity/public/index.js';
import { PromotionView } from '../../application/results/promotion-view.js';
import { CreatePromotionUseCase } from '../../application/use-cases/create-promotion.use-case.js';
import { ListPromotionsUseCase } from '../../application/use-cases/list-promotions.use-case.js';
import { UpdatePromotionUseCase } from '../../application/use-cases/update-promotion.use-case.js';
import { CreatePromotionRequestDto } from './dto/create-promotion.request.dto.js';
import { UpdatePromotionRequestDto } from './dto/update-promotion.request.dto.js';

@Roles('ADMIN')
@Controller('admin/promotions')
export class AdminPromotionsController {
  constructor(
    private readonly listPromotions: ListPromotionsUseCase,
    private readonly createPromotion: CreatePromotionUseCase,
    private readonly updatePromotion: UpdatePromotionUseCase,
  ) {}

  @Get()
  list(): Promise<PromotionView[]> {
    return this.listPromotions.execute();
  }

  @Post()
  create(@Body() dto: CreatePromotionRequestDto): Promise<PromotionView> {
    return this.createPromotion.execute(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePromotionRequestDto,
  ): Promise<PromotionView> {
    return this.updatePromotion.execute(id, dto);
  }
}
