import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../../../identity/public/index.js';
import { GetProductImageUseCase } from '../../application/use-cases/get-product-image.use-case.js';

@Controller('media')
export class MediaController {
  constructor(private readonly getProductImage: GetProductImageUseCase) {}

  @Public()
  @Get(':id')
  async serve(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() response: Response,
  ): Promise<void> {
    const stored = await this.getProductImage.execute(id);
    response.setHeader('Content-Type', stored.contentType);
    response.send(stored.data);
  }
}
