export const MEDIA_URL_RESOLVER = 'MEDIA_URL_RESOLVER';

export interface MediaUrlResolver {
  resolve(objectKey: string, backendFallbackUrl: string): string;
}
