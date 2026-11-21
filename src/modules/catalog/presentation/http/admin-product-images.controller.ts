import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../../identity/public/index.js';
import { InvalidProductImageError } from '../../domain/errors/invalid-product-image.error.js';
import type { ProductImageView } from '../../application/results/catalog-views.js';
import { AddProductImageUseCase } from '../../application/use-cases/add-product-image.use-case.js';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface UploadedImageFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Roles('ADMIN')
@Controller('admin/products')
export class AdminProductImagesController {
  constructor(private readonly addProductImage: AddProductImageUseCase) {}

  @Post(':id/images')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_IMAGE_BYTES } }),
  )
  upload(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: UploadedImageFile | undefined,
  ): Promise<ProductImageView> {
    if (!file) {
      throw new InvalidProductImageError();
    }
    return this.addProductImage.execute({
      productId: id,
      originalName: file.originalname,
      buffer: file.buffer,
      contentType: file.mimetype,
    });
  }
}
