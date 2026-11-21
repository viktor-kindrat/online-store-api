import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3';
import { extname } from 'node:path';
import type { Env } from '../../../../infrastructure/config/env.schema.js';
import type {
  StoragePort,
  StoredObject,
} from '../../application/ports/storage.port.js';

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

interface S3ErrorShape {
  name?: string;
  $metadata?: { httpStatusCode?: number };
}

function isNotFound(error: unknown): boolean {
  const shape = error as S3ErrorShape;
  return (
    shape?.name === 'NoSuchKey' ||
    shape?.name === 'NotFound' ||
    shape?.$metadata?.httpStatusCode === 404
  );
}

@Injectable()
export class S3StorageAdapter implements StoragePort {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: ConfigService<Env, true>) {
    const bucket = config.get('S3_BUCKET', { infer: true });
    if (!bucket) {
      throw new Error('S3_BUCKET is required when STORAGE_DRIVER=s3');
    }
    this.bucket = bucket;
    const endpoint = config.get('S3_ENDPOINT', { infer: true });
    const clientConfig: S3ClientConfig = {
      region: config.get('AWS_REGION', { infer: true }),
    };
    if (endpoint) {
      clientConfig.endpoint = endpoint;
      clientConfig.forcePathStyle = config.get('S3_FORCE_PATH_STYLE', {
        infer: true,
      });
    }
    this.client = new S3Client(clientConfig);
  }

  async put(objectKey: string, data: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
        Body: data,
        ContentType: contentType,
      }),
    );
  }

  async read(objectKey: string): Promise<StoredObject | null> {
    try {
      const response = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: objectKey }),
      );
      if (!response.Body) {
        return null;
      }
      const bytes = await response.Body.transformToByteArray();
      return {
        data: Buffer.from(bytes),
        contentType:
          response.ContentType ??
          CONTENT_TYPE_BY_EXTENSION[extname(objectKey).toLowerCase()] ??
          'application/octet-stream',
      };
    } catch (error) {
      if (isNotFound(error)) {
        return null;
      }
      throw error;
    }
  }
}
