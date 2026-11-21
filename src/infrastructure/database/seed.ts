import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CategoryOrmEntity } from '../../modules/catalog/infrastructure/persistence/category.orm-entity.js';
import { ProductOrmEntity } from '../../modules/catalog/infrastructure/persistence/product.orm-entity.js';
import { ProductImageOrmEntity } from '../../modules/catalog/infrastructure/persistence/product-image.orm-entity.js';
import { ProductAttributeOrmEntity } from '../../modules/catalog/infrastructure/persistence/product-attribute.orm-entity.js';
import { UserAccountOrmEntity } from '../../modules/identity/infrastructure/persistence/user-account.orm-entity.js';
import { StockBalanceOrmEntity } from '../../modules/inventory/infrastructure/persistence/stock-balance.orm-entity.js';
import { PromotionOrmEntity } from '../../modules/promotions/infrastructure/persistence/promotion.orm-entity.js';
import { AppDataSource } from './data-source.js';

const SALT_ROUNDS = 12;
const SEED_ASSETS_DIR = resolve(import.meta.dirname, '../../../seed-assets');
const STORAGE_DRIVER = process.env.STORAGE_DRIVER ?? 'local';
const s3 =
  STORAGE_DRIVER === 's3'
    ? new S3Client({ region: process.env.AWS_REGION ?? 'eu-central-1' })
    : null;

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

async function putObject(
  objectKey: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  if (s3) {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: objectKey,
        Body: body,
        ContentType: contentType,
      }),
    );
    return;
  }
  const baseDir = resolve(process.env.STORAGE_DIR ?? 'storage/uploads');
  const target = join(baseDir, objectKey);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, body);
  await writeFile(`${target}.type`, contentType);
}

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[char] ?? char,
  );
}

function fallbackSvg(name: string, label: string): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><rect width="640" height="640" fill="#1f2937"/><text x="320" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff">${escapeXml(name)}</text><text x="320" y="356" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" fill="#ffffff" opacity="0.8">${escapeXml(label)}</text><text x="320" y="600" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="3">M&amp;H</text></svg>`;
  return Buffer.from(svg, 'utf8');
}

interface SeedProduct {
  name: string;
  description: string;
  priceMinor: number;
  onHand: number;
  image: string;
  attributes: { name: string; value: string }[];
}

interface SeedCategory {
  category: { name: string; slug: string };
  products: SeedProduct[];
}

const CATALOG: SeedCategory[] = [
  {
    category: { name: 'Сорочки та футболки', slug: 'shirts' },
    products: [
      {
        name: 'Сорочка в клітинку синьо-чорна',
        description:
          '<p>Чоловіча сорочка у <strong>синьо-чорну клітинку</strong>, бавовна, класичний крій.</p>',
        priceMinor: 123000,
        onHand: 40,
        image: 'mens-shirts-0.webp',
        attributes: [
          { name: 'Матеріал', value: 'Бавовна' },
          { name: 'Колір', value: 'Синьо-чорний' },
          { name: 'Розміри', value: 'S–XXL' },
        ],
      },
      {
        name: 'Футболка чоловіча Aorus',
        description:
          '<p>М’яка бавовняна <strong>футболка</strong> з лаконічним принтом.</p>',
        priceMinor: 102500,
        onHand: 55,
        image: 'mens-shirts-1.webp',
        attributes: [
          { name: 'Матеріал', value: 'Бавовна 100%' },
          { name: 'Колір', value: 'Чорний' },
          { name: 'Розміри', value: 'S–XL' },
        ],
      },
      {
        name: 'Сорочка в клітинку плед',
        description:
          '<p>Сорочка у <em>картатий візерунок</em>, щільна тканина, зручний фіт.</p>',
        priceMinor: 143500,
        onHand: 35,
        image: 'mens-shirts-2.webp',
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, фланель' },
          { name: 'Колір', value: 'Різнокольорова' },
          { name: 'Розміри', value: 'S–XXL' },
        ],
      },
      {
        name: 'Сорочка з коротким рукавом',
        description:
          '<p>Легка <strong>сорочка з коротким рукавом</strong> для теплої погоди.</p>',
        priceMinor: 82000,
        onHand: 48,
        image: 'mens-shirts-3.webp',
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, льон' },
          { name: 'Колір', value: 'Світлий' },
          { name: 'Розміри', value: 'S–XL' },
        ],
      },
      {
        name: 'Сорочка картата класична',
        description:
          '<p>Універсальна <em>картата сорочка</em>, пасує на щодень і в офіс.</p>',
        priceMinor: 114800,
        onHand: 42,
        image: 'mens-shirts-4.webp',
        attributes: [
          { name: 'Матеріал', value: 'Бавовна' },
          { name: 'Колір', value: 'Клітинка' },
          { name: 'Розміри', value: 'S–XXL' },
        ],
      },
    ],
  },
  {
    category: { name: 'Сукні', slug: 'dresses' },
    products: [
      {
        name: 'Сукня блакитна',
        description:
          '<p>Ніжна <strong>блакитна сукня</strong>, легка тканина, жіночний силует.</p>',
        priceMinor: 123000,
        onHand: 30,
        image: 'tops-0.webp',
        attributes: [
          { name: 'Матеріал', value: 'Віскоза' },
          { name: 'Колір', value: 'Блакитний' },
          { name: 'Розміри', value: 'XS–L' },
        ],
      },
      {
        name: 'Літня сукня',
        description: '<p>Легка <em>літня сукня</em> вільного крою.</p>',
        priceMinor: 82000,
        onHand: 34,
        image: 'tops-1.webp',
        attributes: [
          { name: 'Матеріал', value: 'Бавовна' },
          { name: 'Колір', value: 'Світлий' },
          { name: 'Розміри', value: 'XS–L' },
        ],
      },
      {
        name: 'Сукня сіра',
        description:
          '<p>Елегантна <strong>сіра сукня</strong>, мінімалістичний дизайн.</p>',
        priceMinor: 143500,
        onHand: 26,
        image: 'tops-2.webp',
        attributes: [
          { name: 'Матеріал', value: 'Поліестер, віскоза' },
          { name: 'Колір', value: 'Сірий' },
          { name: 'Розміри', value: 'XS–L' },
        ],
      },
      {
        name: 'Сукня коротка',
        description: '<p>Трендова <em>коротка сукня</em> для яскравих виходів.</p>',
        priceMinor: 102500,
        onHand: 28,
        image: 'tops-3.webp',
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, еластан' },
          { name: 'Колір', value: 'Світлий' },
          { name: 'Розміри', value: 'XS–L' },
        ],
      },
      {
        name: 'Сукня в клітинку тартан',
        description:
          '<p>Стильна сукня у <strong>тартан</strong>, акцент осіннього гардероба.</p>',
        priceMinor: 163900,
        onHand: 22,
        image: 'tops-4.webp',
        attributes: [
          { name: 'Матеріал', value: 'Вовна, поліестер' },
          { name: 'Колір', value: 'Клітинка' },
          { name: 'Розміри', value: 'XS–L' },
        ],
      },
      {
        name: 'Вечірня сукня чорна',
        description:
          '<p>Розкішна <strong>чорна вечірня сукня</strong> для особливих подій.</p>',
        priceMinor: 533000,
        onHand: 14,
        image: 'dresses-0.webp',
        attributes: [
          { name: 'Матеріал', value: 'Сатин' },
          { name: 'Колір', value: 'Чорний' },
          { name: 'Розміри', value: 'XS–L' },
        ],
      },
      {
        name: 'Сукня з корсетом і спідницею',
        description:
          '<p>Ефектна сукня з <em>корсетом</em> та пишною спідницею.</p>',
        priceMinor: 369000,
        onHand: 16,
        image: 'dresses-1.webp',
        attributes: [
          { name: 'Матеріал', value: 'Еко-шкіра, текстиль' },
          { name: 'Колір', value: 'Темний' },
          { name: 'Розміри', value: 'XS–M' },
        ],
      },
      {
        name: 'Корсетна сукня з чорною спідницею',
        description:
          '<p>Корсетний верх і <strong>чорна спідниця</strong> — сміливий образ.</p>',
        priceMinor: 328000,
        onHand: 15,
        image: 'dresses-2.webp',
        attributes: [
          { name: 'Матеріал', value: 'Текстиль' },
          { name: 'Колір', value: 'Чорний' },
          { name: 'Розміри', value: 'XS–M' },
        ],
      },
      {
        name: 'Сукня Pea повсякденна',
        description: '<p>Зручна <em>повсякденна сукня</em> на кожен день.</p>',
        priceMinor: 205000,
        onHand: 24,
        image: 'dresses-3.webp',
        attributes: [
          { name: 'Матеріал', value: 'Бавовна' },
          { name: 'Колір', value: 'Світлий' },
          { name: 'Розміри', value: 'XS–L' },
        ],
      },
      {
        name: 'Костюм Marni червоно-чорний',
        description:
          '<p>Дизайнерський <strong>костюм Marni</strong> у червоно-чорній гамі.</p>',
        priceMinor: 738000,
        onHand: 10,
        image: 'dresses-4.webp',
        attributes: [
          { name: 'Бренд', value: 'Marni' },
          { name: 'Колір', value: 'Червоно-чорний' },
          { name: 'Розміри', value: 'XS–L' },
        ],
      },
    ],
  },
  {
    category: { name: 'Кросівки', slug: 'sneakers' },
    products: [
      {
        name: 'Кросівки Nike Air Jordan 1',
        description:
          '<p>Легендарні <strong>Nike Air Jordan 1</strong> у червоно-чорному кольорі.</p>',
        priceMinor: 615000,
        onHand: 25,
        image: 'mens-shoes-0.webp',
        attributes: [
          { name: 'Бренд', value: 'Nike' },
          { name: 'Колір', value: 'Червоно-чорний' },
          { name: 'Розміри', value: '40–46' },
        ],
      },
      {
        name: 'Бейсбольні шиповки Nike',
        description: '<p>Спортивні <em>шиповки Nike</em> для активних тренувань.</p>',
        priceMinor: 328000,
        onHand: 20,
        image: 'mens-shoes-1.webp',
        attributes: [
          { name: 'Бренд', value: 'Nike' },
          { name: 'Колір', value: 'Чорний' },
          { name: 'Розміри', value: '40–46' },
        ],
      },
      {
        name: 'Кросівки Puma Future Rider',
        description:
          '<p>Стильні <strong>Puma Future Rider</strong>, зручна амортизація.</p>',
        priceMinor: 369000,
        onHand: 28,
        image: 'mens-shoes-2.webp',
        attributes: [
          { name: 'Бренд', value: 'Puma' },
          { name: 'Колір', value: 'Різнокольорові' },
          { name: 'Розміри', value: '40–46' },
        ],
      },
      {
        name: 'Кросівки Off-White червоні',
        description: '<p>Яскраві спортивні <em>кросівки</em> в біло-червоній гамі.</p>',
        priceMinor: 492000,
        onHand: 18,
        image: 'mens-shoes-3.webp',
        attributes: [
          { name: 'Матеріал', value: 'Текстиль, гума' },
          { name: 'Колір', value: 'Біло-червоний' },
          { name: 'Розміри', value: '40–46' },
        ],
      },
      {
        name: 'Спортивні кросівки Off-White',
        description: '<p>Легкі <strong>спортивні кросівки</strong> на щодень.</p>',
        priceMinor: 451000,
        onHand: 22,
        image: 'mens-shoes-4.webp',
        attributes: [
          { name: 'Матеріал', value: 'Сітка, гума' },
          { name: 'Колір', value: 'Білий' },
          { name: 'Розміри', value: '40–46' },
        ],
      },
    ],
  },
  {
    category: { name: 'Жіноче взуття', slug: 'womens-shoes' },
    products: [
      {
        name: 'Капці чорно-коричневі',
        description: '<p>Домашні <strong>капці</strong>, м’які й теплі.</p>',
        priceMinor: 82000,
        onHand: 44,
        image: 'womens-shoes-0.webp',
        attributes: [
          { name: 'Матеріал', value: 'Текстиль' },
          { name: 'Колір', value: 'Чорно-коричневий' },
          { name: 'Розміри', value: '36–41' },
        ],
      },
      {
        name: 'Туфлі на підборах Calvin Klein',
        description:
          '<p>Елегантні <strong>туфлі Calvin Klein</strong> на підборах.</p>',
        priceMinor: 328000,
        onHand: 20,
        image: 'womens-shoes-1.webp',
        attributes: [
          { name: 'Бренд', value: 'Calvin Klein' },
          { name: 'Колір', value: 'Чорний' },
          { name: 'Розміри', value: '36–41' },
        ],
      },
      {
        name: 'Золотисті туфлі',
        description: '<p>Святкові <em>золотисті туфлі</em> для особливих подій.</p>',
        priceMinor: 205000,
        onHand: 18,
        image: 'womens-shoes-2.webp',
        attributes: [
          { name: 'Матеріал', value: 'Еко-шкіра' },
          { name: 'Колір', value: 'Золотистий' },
          { name: 'Розміри', value: '36–41' },
        ],
      },
      {
        name: 'Туфлі Pampi',
        description: '<p>Комфортні <strong>туфлі</strong> для щоденного носіння.</p>',
        priceMinor: 123000,
        onHand: 30,
        image: 'womens-shoes-3.webp',
        attributes: [
          { name: 'Матеріал', value: 'Еко-шкіра' },
          { name: 'Колір', value: 'Світлий' },
          { name: 'Розміри', value: '36–41' },
        ],
      },
      {
        name: 'Червоні туфлі',
        description: '<p>Яскраві <em>червоні туфлі</em> — акцент образу.</p>',
        priceMinor: 143500,
        onHand: 24,
        image: 'womens-shoes-4.webp',
        attributes: [
          { name: 'Матеріал', value: 'Еко-шкіра' },
          { name: 'Колір', value: 'Червоний' },
          { name: 'Розміри', value: '36–41' },
        ],
      },
    ],
  },
  {
    category: { name: 'Сумки', slug: 'bags' },
    products: [
      {
        name: 'Синя жіноча сумка',
        description: '<p>Містка <strong>жіноча сумка</strong> насиченого синього кольору.</p>',
        priceMinor: 205000,
        onHand: 26,
        image: 'bags-0.webp',
        attributes: [
          { name: 'Матеріал', value: 'Еко-шкіра' },
          { name: 'Колір', value: 'Синій' },
          { name: 'Тип', value: 'Через плече' },
        ],
      },
      {
        name: 'Шкіряна сумка Heshe',
        description: '<p>Елегантна <strong>шкіряна сумка Heshe</strong>.</p>',
        priceMinor: 533000,
        onHand: 18,
        image: 'bags-1.webp',
        attributes: [
          { name: 'Бренд', value: 'Heshe' },
          { name: 'Матеріал', value: 'Натуральна шкіра' },
          { name: 'Колір', value: 'Коричневий' },
        ],
      },
      {
        name: 'Сумка Prada',
        description: '<p>Преміальна <strong>сумка Prada</strong> — статусний аксесуар.</p>',
        priceMinor: 2460000,
        onHand: 8,
        image: 'bags-2.webp',
        attributes: [
          { name: 'Бренд', value: 'Prada' },
          { name: 'Матеріал', value: 'Натуральна шкіра' },
          { name: 'Колір', value: 'Класичний' },
        ],
      },
      {
        name: 'Рюкзак з еко-шкіри білий',
        description: '<p>Міський <em>білий рюкзак</em> з еко-шкіри.</p>',
        priceMinor: 164000,
        onHand: 30,
        image: 'bags-3.webp',
        attributes: [
          { name: 'Матеріал', value: 'Еко-шкіра' },
          { name: 'Колір', value: 'Білий' },
          { name: 'Тип', value: 'Рюкзак' },
        ],
      },
      {
        name: 'Чорна жіноча сумка',
        description: '<p>Класична <strong>чорна жіноча сумка</strong> на кожен день.</p>',
        priceMinor: 246000,
        onHand: 28,
        image: 'bags-4.webp',
        attributes: [
          { name: 'Матеріал', value: 'Еко-шкіра' },
          { name: 'Колір', value: 'Чорний' },
          { name: 'Тип', value: 'Через плече' },
        ],
      },
    ],
  },
  {
    category: { name: 'Окуляри', slug: 'sunglasses' },
    products: [
      {
        name: 'Сонцезахисні окуляри чорні',
        description: '<p>Стильні <strong>чорні сонцезахисні окуляри</strong>, UV400.</p>',
        priceMinor: 123000,
        onHand: 50,
        image: 'sunglasses-0.webp',
        attributes: [
          { name: 'Захист', value: 'UV400' },
          { name: 'Колір', value: 'Чорний' },
          { name: 'Форма', value: 'Класична' },
        ],
      },
      {
        name: 'Класичні сонцезахисні окуляри',
        description: '<p>Універсальні <em>класичні окуляри</em> від сонця.</p>',
        priceMinor: 102500,
        onHand: 55,
        image: 'sunglasses-1.webp',
        attributes: [
          { name: 'Захист', value: 'UV400' },
          { name: 'Колір', value: 'Чорний' },
          { name: 'Форма', value: 'Вайфарер' },
        ],
      },
      {
        name: 'Окуляри зелено-чорні',
        description: '<p>Трендові <strong>зелено-чорні окуляри</strong>.</p>',
        priceMinor: 143500,
        onHand: 40,
        image: 'sunglasses-2.webp',
        attributes: [
          { name: 'Захист', value: 'UV400' },
          { name: 'Колір', value: 'Зелено-чорний' },
          { name: 'Форма', value: 'Авіатор' },
        ],
      },
      {
        name: 'Вечірні окуляри',
        description: '<p>Акцентні <em>окуляри</em> для яскравих образів.</p>',
        priceMinor: 82000,
        onHand: 38,
        image: 'sunglasses-3.webp',
        attributes: [
          { name: 'Колір', value: 'Різнокольорові' },
          { name: 'Форма', value: 'Фешн' },
          { name: 'Матеріал', value: 'Пластик' },
        ],
      },
      {
        name: 'Сонцезахисні окуляри',
        description: '<p>Легкі <strong>сонцезахисні окуляри</strong> на щодень.</p>',
        priceMinor: 94300,
        onHand: 48,
        image: 'sunglasses-4.webp',
        attributes: [
          { name: 'Захист', value: 'UV400' },
          { name: 'Колір', value: 'Чорний' },
          { name: 'Форма', value: 'Класична' },
        ],
      },
    ],
  },
  {
    category: { name: 'Прикраси', slug: 'jewellery' },
    products: [
      {
        name: 'Сережки із зеленим кристалом',
        description: '<p>Витончені <strong>сережки</strong> із зеленим кристалом.</p>',
        priceMinor: 123000,
        onHand: 35,
        image: 'jewellery-0.webp',
        attributes: [
          { name: 'Матеріал', value: 'Сплав, кристал' },
          { name: 'Колір', value: 'Зелений' },
          { name: 'Тип', value: 'Сережки' },
        ],
      },
      {
        name: 'Зелені овальні сережки',
        description: '<p>Елегантні <em>овальні сережки</em> зеленого відтінку.</p>',
        priceMinor: 102500,
        onHand: 40,
        image: 'jewellery-1.webp',
        attributes: [
          { name: 'Матеріал', value: 'Сплав' },
          { name: 'Колір', value: 'Зелений' },
          { name: 'Тип', value: 'Сережки' },
        ],
      },
      {
        name: 'Тропічні сережки',
        description: '<p>Яскраві <strong>тропічні сережки</strong> для літніх образів.</p>',
        priceMinor: 82000,
        onHand: 42,
        image: 'jewellery-2.webp',
        attributes: [
          { name: 'Матеріал', value: 'Сплав, емаль' },
          { name: 'Колір', value: 'Різнокольорові' },
          { name: 'Тип', value: 'Сережки' },
        ],
      },
    ],
  },
  {
    category: { name: 'Годинники', slug: 'watches' },
    products: [
      {
        name: 'Годинник на шкіряному ремінці',
        description: '<p>Класичний <strong>годинник</strong> на коричневому шкіряному ремінці.</p>',
        priceMinor: 369000,
        onHand: 24,
        image: 'watches-0.webp',
        attributes: [
          { name: 'Матеріал ремінця', value: 'Шкіра' },
          { name: 'Колір', value: 'Коричневий' },
          { name: 'Механізм', value: 'Кварцовий' },
        ],
      },
      {
        name: 'Longines Master Collection',
        description: '<p>Елегантний швейцарський годинник <strong>Longines</strong>.</p>',
        priceMinor: 6150000,
        onHand: 6,
        image: 'watches-1.webp',
        attributes: [
          { name: 'Бренд', value: 'Longines' },
          { name: 'Механізм', value: 'Автоматичний' },
          { name: 'Колір', value: 'Сталевий' },
        ],
      },
      {
        name: 'Rolex Cellini Date',
        description: '<p>Розкішний <strong>Rolex Cellini</strong> з чорним циферблатом.</p>',
        priceMinor: 36900000,
        onHand: 3,
        image: 'watches-2.webp',
        attributes: [
          { name: 'Бренд', value: 'Rolex' },
          { name: 'Механізм', value: 'Автоматичний' },
          { name: 'Колір', value: 'Чорний' },
        ],
      },
      {
        name: 'Rolex Cellini Moonphase',
        description: '<p><strong>Rolex Cellini Moonphase</strong> — фаза місяця, елегантність.</p>',
        priceMinor: 53300000,
        onHand: 2,
        image: 'watches-3.webp',
        attributes: [
          { name: 'Бренд', value: 'Rolex' },
          { name: 'Механізм', value: 'Автоматичний' },
          { name: 'Колір', value: 'Білий' },
        ],
      },
      {
        name: 'Rolex Datejust',
        description: '<p>Легендарний <strong>Rolex Datejust</strong> зі сталі.</p>',
        priceMinor: 45100000,
        onHand: 3,
        image: 'watches-4.webp',
        attributes: [
          { name: 'Бренд', value: 'Rolex' },
          { name: 'Механізм', value: 'Автоматичний' },
          { name: 'Колір', value: 'Сталевий' },
        ],
      },
      {
        name: 'Rolex Submariner',
        description: '<p>Культовий дайверський <strong>Rolex Submariner</strong>.</p>',
        priceMinor: 57400000,
        onHand: 2,
        image: 'watches-5.webp',
        attributes: [
          { name: 'Бренд', value: 'Rolex' },
          { name: 'Механізм', value: 'Автоматичний' },
          { name: 'Водозахист', value: '300 м' },
        ],
      },
      {
        name: 'IWC Ingenieur Automatic',
        description: '<p>Інженерна класика <strong>IWC Ingenieur</strong> зі сталі.</p>',
        priceMinor: 20500000,
        onHand: 4,
        image: 'watches-6.webp',
        attributes: [
          { name: 'Бренд', value: 'IWC' },
          { name: 'Механізм', value: 'Автоматичний' },
          { name: 'Колір', value: 'Сталевий' },
        ],
      },
      {
        name: 'Rolex Cellini Moonphase Platinum',
        description: '<p><strong>Rolex Cellini Moonphase</strong> у преміальному виконанні.</p>',
        priceMinor: 65600000,
        onHand: 1,
        image: 'watches-7.webp',
        attributes: [
          { name: 'Бренд', value: 'Rolex' },
          { name: 'Механізм', value: 'Автоматичний' },
          { name: 'Колір', value: 'Платина' },
        ],
      },
      {
        name: 'Rolex Datejust жіночий',
        description: '<p>Жіночий <strong>Rolex Datejust</strong> — вишуканість деталей.</p>',
        priceMinor: 45100000,
        onHand: 3,
        image: 'watches-8.webp',
        attributes: [
          { name: 'Бренд', value: 'Rolex' },
          { name: 'Механізм', value: 'Автоматичний' },
          { name: 'Колір', value: 'Сталевий' },
        ],
      },
      {
        name: 'Золотий жіночий годинник',
        description: '<p>Ошатний <strong>золотистий годинник</strong> для жінок.</p>',
        priceMinor: 3280000,
        onHand: 10,
        image: 'watches-9.webp',
        attributes: [
          { name: 'Колір', value: 'Золотистий' },
          { name: 'Механізм', value: 'Кварцовий' },
          { name: 'Матеріал', value: 'Нержавіюча сталь' },
        ],
      },
    ],
  },
];

async function seedAdmin(): Promise<void> {
  const users = AppDataSource.getRepository(UserAccountOrmEntity);
  const email = (process.env.ADMIN_EMAIL ?? 'admin@example.com').toLowerCase();
  if (await users.findOne({ where: { email } })) {
    return;
  }
  const admin = new UserAccountOrmEntity();
  admin.id = randomUUID();
  admin.email = email;
  admin.passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? 'admin12345',
    SALT_ROUNDS,
  );
  admin.role = 'ADMIN';
  await users.save(admin);
}

async function seedCatalog(): Promise<void> {
  const categories = AppDataSource.getRepository(CategoryOrmEntity);
  const products = AppDataSource.getRepository(ProductOrmEntity);
  const balances = AppDataSource.getRepository(StockBalanceOrmEntity);
  const images = AppDataSource.getRepository(ProductImageOrmEntity);
  const attributes = AppDataSource.getRepository(ProductAttributeOrmEntity);

  for (const entry of CATALOG) {
    let category = await categories.findOne({
      where: { slug: entry.category.slug },
    });
    if (!category) {
      category = new CategoryOrmEntity();
      category.id = randomUUID();
      category.name = entry.category.name;
      category.slug = entry.category.slug;
      await categories.save(category);
    }

    for (const seedProduct of entry.products) {
      if (await products.findOne({ where: { name: seedProduct.name } })) {
        continue;
      }
      const product = new ProductOrmEntity();
      product.id = randomUUID();
      product.categoryId = category.id;
      product.name = seedProduct.name;
      product.description = seedProduct.description;
      product.priceMinor = seedProduct.priceMinor;
      product.status = 'ACTIVE';
      await products.save(product);

      const balance = new StockBalanceOrmEntity();
      balance.productId = product.id;
      balance.onHand = seedProduct.onHand;
      balance.reserved = 0;
      await balances.save(balance);

      let sort = 0;
      for (const attribute of seedProduct.attributes) {
        const row = new ProductAttributeOrmEntity();
        row.id = randomUUID();
        row.productId = product.id;
        row.name = attribute.name;
        row.value = attribute.value;
        row.sortOrder = sort;
        sort += 1;
        await attributes.save(row);
      }

      const imageId = randomUUID();
      const ext = seedProduct.image.split('.').pop() ?? 'jpg';
      let bytes: Buffer;
      let extension: string;
      let contentType: string;
      try {
        bytes = await readFile(join(SEED_ASSETS_DIR, seedProduct.image));
        extension = ext;
        contentType = CONTENT_TYPE_BY_EXT[ext] ?? 'application/octet-stream';
      } catch {
        bytes = fallbackSvg(seedProduct.name, entry.category.name);
        extension = 'svg';
        contentType = 'image/svg+xml';
      }
      const objectKey = `products/${product.id}/${imageId}.${extension}`;
      await putObject(objectKey, bytes, contentType);
      const image = new ProductImageOrmEntity();
      image.id = imageId;
      image.productId = product.id;
      image.objectKey = objectKey;
      image.sortOrder = 0;
      await images.save(image);
    }
  }
}

async function seedPromotion(): Promise<void> {
  const promotions = AppDataSource.getRepository(PromotionOrmEntity);
  if (await promotions.findOne({ where: { code: 'WELCOME10' } })) {
    return;
  }
  const promotion = new PromotionOrmEntity();
  promotion.id = randomUUID();
  promotion.code = 'WELCOME10';
  promotion.discountType = 'PERCENTAGE';
  promotion.value = 10;
  promotion.minOrderMinor = 0;
  promotion.usageLimit = 1000;
  promotion.expiresAt = new Date('2030-01-01T00:00:00.000Z');
  await promotions.save(promotion);
}

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  await seedAdmin();
  await seedCatalog();
  await seedPromotion();
  await AppDataSource.destroy();
}

await seed();
