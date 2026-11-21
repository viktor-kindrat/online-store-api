import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Env } from '../../../../infrastructure/config/env.schema.js';
import { S3StorageAdapter } from './s3-storage.adapter.js';

function configWith(values: Partial<Env>): ConfigService<Env, true> {
  const defaults: Partial<Env> = {
    S3_BUCKET: 'test-bucket',
    AWS_REGION: 'eu-central-1',
    S3_FORCE_PATH_STYLE: false,
  };
  const merged = { ...defaults, ...values } as Record<string, unknown>;
  return {
    get: (key: string): unknown => merged[key],
  } as unknown as ConfigService<Env, true>;
}

describe('S3StorageAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when the bucket is not configured', () => {
    expect(() => new S3StorageAdapter(configWith({ S3_BUCKET: undefined }))).toThrow(
      /S3_BUCKET/,
    );
  });

  it('puts an object with bucket, key and content type', async () => {
    const send = vi
      .spyOn(S3Client.prototype, 'send')
      .mockResolvedValue(undefined as never);
    const adapter = new S3StorageAdapter(configWith({}));

    await adapter.put('editor/pic.png', Buffer.from('bytes'), 'image/png');

    expect(send).toHaveBeenCalledTimes(1);
    const command = send.mock.calls[0][0] as PutObjectCommand;
    expect(command).toBeInstanceOf(PutObjectCommand);
    expect(command.input.Bucket).toBe('test-bucket');
    expect(command.input.Key).toBe('editor/pic.png');
    expect(command.input.ContentType).toBe('image/png');
  });

  it('reads an object and returns bytes with content type', async () => {
    const send = vi.spyOn(S3Client.prototype, 'send').mockResolvedValue({
      Body: { transformToByteArray: async () => new Uint8Array([1, 2, 3]) },
      ContentType: 'image/webp',
    } as never);
    const adapter = new S3StorageAdapter(configWith({}));

    const result = await adapter.read('editor/pic.webp');

    const command = send.mock.calls[0][0] as GetObjectCommand;
    expect(command).toBeInstanceOf(GetObjectCommand);
    expect(result).not.toBeNull();
    expect(result?.contentType).toBe('image/webp');
    expect(Array.from(result?.data ?? [])).toEqual([1, 2, 3]);
  });

  it('returns null when the object is missing', async () => {
    vi.spyOn(S3Client.prototype, 'send').mockRejectedValue(
      Object.assign(new Error('missing'), { name: 'NoSuchKey' }),
    );
    const adapter = new S3StorageAdapter(configWith({}));

    await expect(adapter.read('editor/missing.png')).resolves.toBeNull();
  });
});
