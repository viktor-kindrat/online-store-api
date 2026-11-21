import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';
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

@Injectable()
export class LocalFilesystemStorageAdapter implements StoragePort {
  private readonly baseDir: string;

  constructor(config: ConfigService<Env, true>) {
    this.baseDir = resolve(config.get('STORAGE_DIR', { infer: true }));
  }

  async put(objectKey: string, data: Buffer, contentType: string): Promise<void> {
    const target = this.pathFor(objectKey);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, data);
    await writeFile(`${target}.type`, contentType);
  }

  async read(objectKey: string): Promise<StoredObject | null> {
    try {
      const target = this.pathFor(objectKey);
      const data = await readFile(target);
      const contentType = await this.readContentType(target, objectKey);
      return { data, contentType };
    } catch {
      return null;
    }
  }

  private async readContentType(
    target: string,
    objectKey: string,
  ): Promise<string> {
    try {
      return (await readFile(`${target}.type`, 'utf8')).trim();
    } catch {
      return (
        CONTENT_TYPE_BY_EXTENSION[extname(objectKey).toLowerCase()] ??
        'application/octet-stream'
      );
    }
  }

  private pathFor(objectKey: string): string {
    const full = resolve(join(this.baseDir, objectKey));
    if (full !== this.baseDir && !full.startsWith(this.baseDir + sep)) {
      throw new Error('Invalid object key');
    }
    return full;
  }
}
