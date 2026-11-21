import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../../../identity/public/index.js';
import { GetMediaAssetUseCase } from '../../application/use-cases/get-media-asset.use-case.js';

@Controller('media/assets')
export class MediaAssetsController {
  constructor(private readonly getMediaAsset: GetMediaAssetUseCase) {}

  @Public()
  @Get(':id')
  async serve(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() response: Response,
  ): Promise<void> {
    const stored = await this.getMediaAsset.execute(id);
    response.setHeader('Content-Type', stored.contentType);
    response.send(stored.data);
  }
}
