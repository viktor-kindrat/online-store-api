import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'media_assets' })
export class MediaAssetOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'varchar', length: 500 })
  objectKey!: string;

  @Column({ type: 'varchar', length: 150 })
  contentType!: string;
}
