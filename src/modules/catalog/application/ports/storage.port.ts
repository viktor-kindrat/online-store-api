export const STORAGE_PORT = 'STORAGE_PORT';

export interface StoredObject {
  data: Buffer;
  contentType: string;
}

export interface StoragePort {
  put(objectKey: string, data: Buffer, contentType: string): Promise<void>;
  read(objectKey: string): Promise<StoredObject | null>;
}
