import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../../identity/public/index.js';
import { InvalidMediaAssetError } from '../../domain/errors/invalid-media-asset.error.js';
import { MediaAssetView } from '../../application/results/catalog-views.js';
import { UploadMediaUseCase } from '../../application/use-cases/upload-media.use-case.js';

const MAX_MEDIA_BYTES = 5 * 1024 * 1024;

interface UploadedMediaFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Roles('ADMIN')
@Controller('admin/media')
export class AdminMediaController {
  constructor(private readonly uploadMedia: UploadMediaUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_MEDIA_BYTES } }),
  )
  upload(
    @UploadedFile() file: UploadedMediaFile | undefined,
  ): Promise<MediaAssetView> {
    if (!file) {
      throw new InvalidMediaAssetError();
    }
    return this.uploadMedia.execute({
      originalName: file.originalname,
      buffer: file.buffer,
      contentType: file.mimetype,
    });
  }
}
