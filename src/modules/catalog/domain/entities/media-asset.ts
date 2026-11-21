import { randomUUID } from 'node:crypto';

export class MediaAsset {
  constructor(
    public readonly id: string,
    public readonly objectKey: string,
    public readonly contentType: string,
  ) {}

  static create(objectKey: string, contentType: string): MediaAsset {
    return new MediaAsset(randomUUID(), objectKey, contentType);
  }
}
