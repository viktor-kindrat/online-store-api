import { randomUUID } from 'node:crypto';

export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public slug: string,
  ) {}

  static create(name: string, slug: string): Category {
    return new Category(randomUUID(), name, slug);
  }

  rename(name: string): void {
    this.name = name;
  }

  changeSlug(slug: string): void {
    this.slug = slug;
  }
}
