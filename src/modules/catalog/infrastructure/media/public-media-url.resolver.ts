import type { MediaUrlResolver } from '../../application/ports/media-url.resolver.port.js';

export class PublicMediaUrlResolver implements MediaUrlResolver {
  constructor(private readonly baseUrl: string | undefined) {}

  resolve(objectKey: string, backendFallbackUrl: string): string {
    if (this.baseUrl) {
      return `${this.baseUrl}/${objectKey}`;
    }
    return backendFallbackUrl;
  }
}
