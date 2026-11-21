import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
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
const STORAGE_DRIVER = process.env.STORAGE_DRIVER ?? 'local';
const s3 =
  STORAGE_DRIVER === 's3'
    ? new S3Client({ region: process.env.AWS_REGION ?? 'eu-central-1' })
    : null;

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

function wrapName(name: string): string[] {
  if (name.length <= 20) {
    return [name];
  }
  const words = name.split(' ');
  const lines = ['', ''];
  let index = 0;
  for (const word of words) {
    if (index === 0 && `${lines[0]} ${word}`.trim().length > 18) {
      index = 1;
    }
    lines[index] = `${lines[index]} ${word}`.trim();
  }
  return lines.filter((line) => line.length > 0);
}

function tileSvg(
  name: string,
  label: string,
  initial: string,
  from: string,
  to: string,
): Buffer {
  const lines = wrapName(name);
  const nameText = lines
    .map(
      (line, i) =>
        `<text x="320" y="${340 + i * 34}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#ffffff">${escapeXml(line)}</text>`,
    )
    .join('');
  const labelY = 340 + lines.length * 34 + 10;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="640" height="640" fill="url(#g)"/><text x="320" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="230" font-weight="700" fill="#ffffff" opacity="0.12">${escapeXml(initial)}</text>${nameText}<text x="320" y="${labelY}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#ffffff" opacity="0.85" letter-spacing="1">${escapeXml(label)}</text><text x="320" y="602" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800" fill="#ffffff" opacity="0.9" letter-spacing="3">M&amp;H</text></svg>`;
  return Buffer.from(svg, 'utf8');
}

interface SeedProduct {
  name: string;
  description: string;
  priceMinor: number;
  onHand: number;
  attributes: { name: string; value: string }[];
}

interface SeedCategory {
  category: { name: string; slug: string };
  initial: string;
  from: string;
  to: string;
  products: SeedProduct[];
}

function sized(value: string): { name: string; value: string } {
  return { name: 'Розміри', value: value };
}

const CATALOG: SeedCategory[] = [
  {
    category: { name: 'Футболки', slug: 'tshirts' },
    initial: 'Ф',
    from: '#1f2937',
    to: '#4b5563',
    products: [
      {
        name: 'Базова бавовняна футболка',
        description:
          '<p>М’яка футболка з <strong>100% органічної бавовни</strong>, прямий крій, щільний комір.</p>',
        priceMinor: 49900,
        onHand: 60,
        attributes: [
          { name: 'Матеріал', value: '100% бавовна' },
          { name: 'Колір', value: 'Білий' },
          sized('XS–XXL'),
        ],
      },
      {
        name: 'Футболка Oversize чорна',
        description:
          '<p>Вільний <strong>oversize</strong>-силует, приспущене плече, щільний джерсі 220 г/м².</p>',
        priceMinor: 64900,
        onHand: 45,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна 100%' },
          { name: 'Колір', value: 'Чорний' },
          sized('S–XL'),
        ],
      },
      {
        name: 'Футболка з принтом Graphic',
        description:
          '<p>Бавовняна футболка з <em>авторським принтом</em>, стійким до прання.</p>',
        priceMinor: 69900,
        onHand: 38,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна 95%, еластан 5%' },
          { name: 'Колір', value: 'Графітовий' },
          sized('S–XL'),
        ],
      },
      {
        name: 'Поло класичне',
        description:
          '<p>Сорочка-поло <strong>піке</strong> з коротким рукавом, ґудзикова планка.</p>',
        priceMinor: 79900,
        onHand: 40,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна піке' },
          { name: 'Колір', value: 'Темно-синій' },
          sized('S–XXL'),
        ],
      },
      {
        name: 'Лонгслів базовий',
        description:
          '<p>Футболка з довгим рукавом, м’який еластичний трикотаж, на кожен день.</p>',
        priceMinor: 59900,
        onHand: 50,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна 92%, еластан 8%' },
          { name: 'Колір', value: 'Сірий меланж' },
          sized('XS–XL'),
        ],
      },
      {
        name: 'Футболка жіноча приталена',
        description:
          '<p>Приталений крій, глибокий виріз, ніжний <strong>модал</strong>-трикотаж.</p>',
        priceMinor: 54900,
        onHand: 42,
        attributes: [
          { name: 'Матеріал', value: 'Модал, бавовна' },
          { name: 'Колір', value: 'Пудровий' },
          sized('XS–L'),
        ],
      },
      {
        name: 'Тільник смугастий',
        description:
          '<p>Класичний <em>тільник</em> у морську смужку, щільний трикотаж.</p>',
        priceMinor: 62900,
        onHand: 33,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна 100%' },
          { name: 'Колір', value: 'Синьо-білий' },
          sized('S–XL'),
        ],
      },
    ],
  },
  {
    category: { name: 'Сорочки', slug: 'shirts' },
    initial: 'С',
    from: '#0f766e',
    to: '#14b8a6',
    products: [
      {
        name: 'Класична біла сорочка',
        description:
          '<p>Офісна сорочка прямого крою з <strong>бавовни попліну</strong>, не мнеться.</p>',
        priceMinor: 109900,
        onHand: 35,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна поплін' },
          { name: 'Колір', value: 'Білий' },
          sized('38–46'),
        ],
      },
      {
        name: 'Сорочка в клітинку',
        description:
          '<p>Casual-сорочка у <em>клітинку</em>, нагрудні кишені, зручний фіт.</p>',
        priceMinor: 99900,
        onHand: 30,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, фланель' },
          { name: 'Колір', value: 'Червоно-чорна' },
          sized('S–XXL'),
        ],
      },
      {
        name: 'Сорочка лляна',
        description:
          '<p>Легка <strong>лляна</strong> сорочка для спеки, вільний крій.</p>',
        priceMinor: 119900,
        onHand: 28,
        attributes: [
          { name: 'Матеріал', value: 'Льон 100%' },
          { name: 'Колір', value: 'Бежевий' },
          sized('S–XL'),
        ],
      },
      {
        name: 'Сорочка джинсова',
        description:
          '<p>Щільна <strong>денім</strong>-сорочка з кнопками, універсальний стиль.</p>',
        priceMinor: 134900,
        onHand: 26,
        attributes: [
          { name: 'Матеріал', value: 'Денім, бавовна' },
          { name: 'Колір', value: 'Синій' },
          sized('S–XL'),
        ],
      },
      {
        name: 'Сорочка oversize жіноча',
        description:
          '<p>Подовжена сорочка вільного крою, можна носити як сукню.</p>',
        priceMinor: 104900,
        onHand: 31,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, віскоза' },
          { name: 'Колір', value: 'Блакитний' },
          sized('XS–L'),
        ],
      },
      {
        name: 'Сорочка-футболка (overshirt)',
        description:
          '<p>Тепла <em>overshirt</em> на межі сорочки й куртки, для міжсезоння.</p>',
        priceMinor: 159900,
        onHand: 22,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, поліестер' },
          { name: 'Колір', value: 'Хакі' },
          sized('M–XXL'),
        ],
      },
    ],
  },
  {
    category: { name: 'Худі та світшоти', slug: 'hoodies' },
    initial: 'Х',
    from: '#7c2d12',
    to: '#ea580c',
    products: [
      {
        name: 'Худі базове на флісі',
        description:
          '<p>Тепле худі з капюшоном, <strong>начіс-фліс</strong> зсередини, кишеня-кенгуру.</p>',
        priceMinor: 149900,
        onHand: 48,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна 80%, поліестер 20%' },
          { name: 'Колір', value: 'Чорний' },
          sized('XS–XXL'),
        ],
      },
      {
        name: 'Світшот без капюшона',
        description:
          '<p>Класичний світшот прямого крою, щільний <em>петльовий</em> трикотаж.</p>',
        priceMinor: 129900,
        onHand: 40,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, поліестер' },
          { name: 'Колір', value: 'Сірий' },
          sized('S–XL'),
        ],
      },
      {
        name: 'Худі oversize',
        description:
          '<p>Вільний <strong>oversize</strong>-силует, приспущене плече, подвійний капюшон.</p>',
        priceMinor: 169900,
        onHand: 36,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна 100%' },
          { name: 'Колір', value: 'Молочний' },
          sized('S–XL'),
        ],
      },
      {
        name: 'Зіп-худі на блискавці',
        description:
          '<p>Худі на <strong>блискавці</strong> з бічними кишенями, зручно вдягати.</p>',
        priceMinor: 159900,
        onHand: 34,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, еластан' },
          { name: 'Колір', value: 'Темно-зелений' },
          sized('S–XXL'),
        ],
      },
      {
        name: 'Світшот жіночий crop',
        description:
          '<p>Укорочений <em>crop</em>-світшот, м’який начіс, резинка знизу.</p>',
        priceMinor: 119900,
        onHand: 29,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, поліестер' },
          { name: 'Колір', value: 'Лавандовий' },
          sized('XS–L'),
        ],
      },
      {
        name: 'Худі з вишивкою M&H',
        description:
          '<p>Фірмове худі з <strong>вишитим логотипом</strong>, щільний фліс 320 г/м².</p>',
        priceMinor: 189900,
        onHand: 25,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна 85%, поліестер 15%' },
          { name: 'Колір', value: 'Бордовий' },
          sized('S–XXL'),
        ],
      },
    ],
  },
  {
    category: { name: 'Штани та джинси', slug: 'pants' },
    initial: 'Ш',
    from: '#1e3a8a',
    to: '#3b82f6',
    products: [
      {
        name: 'Джинси прямі Regular',
        description:
          '<p>Класичні прямі джинси <strong>regular fit</strong> зі щільного деніму.</p>',
        priceMinor: 179900,
        onHand: 44,
        attributes: [
          { name: 'Матеріал', value: 'Денім, бавовна 98%, еластан 2%' },
          { name: 'Колір', value: 'Темно-синій' },
          sized('28–38'),
        ],
      },
      {
        name: 'Джинси Slim чорні',
        description:
          '<p>Звужені <em>slim</em>-джинси, тягнуться, добре тримають форму.</p>',
        priceMinor: 184900,
        onHand: 39,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, еластан' },
          { name: 'Колір', value: 'Чорний' },
          sized('28–36'),
        ],
      },
      {
        name: 'Карго-штани',
        description:
          '<p>Практичні <strong>карго</strong> з накладними кишенями, щільна тканина.</p>',
        priceMinor: 164900,
        onHand: 33,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна 100%' },
          { name: 'Колір', value: 'Хакі' },
          sized('S–XXL'),
        ],
      },
      {
        name: 'Джогери спортивні',
        description:
          '<p>М’які <em>джогери</em> з манжетами й кулісою, для спорту та відпочинку.</p>',
        priceMinor: 119900,
        onHand: 52,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, поліестер' },
          { name: 'Колір', value: 'Сірий меланж' },
          sized('XS–XXL'),
        ],
      },
      {
        name: 'Чінос класичні',
        description:
          '<p>Елегантні <strong>чінос</strong> прямого крою, тримають стрілку.</p>',
        priceMinor: 139900,
        onHand: 36,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, еластан' },
          { name: 'Колір', value: 'Бежевий' },
          sized('30–38'),
        ],
      },
      {
        name: 'Джинси жіночі Mom',
        description:
          '<p>Трендові <em>mom</em>-джинси з високою посадкою, вільні на стегнах.</p>',
        priceMinor: 169900,
        onHand: 41,
        attributes: [
          { name: 'Матеріал', value: 'Денім 100%' },
          { name: 'Колір', value: 'Світло-блакитний' },
          sized('25–32'),
        ],
      },
      {
        name: 'Шорти джинсові',
        description:
          '<p>Літні джинсові шорти з підкотом, зручна середня посадка.</p>',
        priceMinor: 94900,
        onHand: 47,
        attributes: [
          { name: 'Матеріал', value: 'Денім, бавовна' },
          { name: 'Колір', value: 'Синій' },
          sized('S–XL'),
        ],
      },
    ],
  },
  {
    category: { name: 'Куртки та верхній одяг', slug: 'jackets' },
    initial: 'К',
    from: '#111827',
    to: '#374151',
    products: [
      {
        name: 'Бомбер класичний',
        description:
          '<p>Куртка-<strong>бомбер</strong> на блискавці з трикотажними манжетами.</p>',
        priceMinor: 259900,
        onHand: 24,
        attributes: [
          { name: 'Матеріал', value: 'Поліестер, підкладка' },
          { name: 'Колір', value: 'Чорний' },
          sized('S–XXL'),
        ],
      },
      {
        name: 'Джинсова куртка',
        description:
          '<p>Культова <em>денім</em>-куртка, щільна тканина, металеві ґудзики.</p>',
        priceMinor: 229900,
        onHand: 27,
        attributes: [
          { name: 'Матеріал', value: 'Денім 100%' },
          { name: 'Колір', value: 'Синій' },
          sized('S–XL'),
        ],
      },
      {
        name: 'Пуховик зимовий',
        description:
          '<p>Теплий <strong>пуховик</strong> з капюшоном, утеплювач до -20°C.</p>',
        priceMinor: 449900,
        onHand: 18,
        attributes: [
          { name: 'Матеріал', value: 'Поліестер, пух-перо' },
          { name: 'Колір', value: 'Темно-синій' },
          sized('S–XXL'),
        ],
      },
      {
        name: 'Вітровка легка',
        description:
          '<p>Складна <em>вітровка</em> з водовідштовхувальним покриттям.</p>',
        priceMinor: 169900,
        onHand: 34,
        attributes: [
          { name: 'Матеріал', value: 'Нейлон' },
          { name: 'Колір', value: 'Оливковий' },
          sized('S–XL'),
        ],
      },
      {
        name: 'Пальто вовняне',
        description:
          '<p>Елегантне <strong>вовняне</strong> пальто прямого крою, на підкладці.</p>',
        priceMinor: 529900,
        onHand: 15,
        attributes: [
          { name: 'Матеріал', value: 'Вовна 70%, поліестер 30%' },
          { name: 'Колір', value: 'Кемел' },
          sized('XS–L'),
        ],
      },
      {
        name: 'Тренч жіночий',
        description:
          '<p>Класичний <em>тренч</em> із поясом, двобортний, стильний силует.</p>',
        priceMinor: 389900,
        onHand: 19,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, поліестер' },
          { name: 'Колір', value: 'Бежевий' },
          sized('XS–L'),
        ],
      },
    ],
  },
  {
    category: { name: 'Сукні', slug: 'dresses' },
    initial: 'Д',
    from: '#9d174d',
    to: '#ec4899',
    products: [
      {
        name: 'Сукня-футболка',
        description:
          '<p>Вільна трикотажна <strong>сукня-футболка</strong> на кожен день.</p>',
        priceMinor: 109900,
        onHand: 30,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, еластан' },
          { name: 'Колір', value: 'Чорний' },
          sized('XS–L'),
        ],
      },
      {
        name: 'Сукня міді в рубчик',
        description:
          '<p>Приталена сукня <em>міді</em> у рубчик, підкреслює силует.</p>',
        priceMinor: 149900,
        onHand: 26,
        attributes: [
          { name: 'Матеріал', value: 'Віскоза, еластан' },
          { name: 'Колір', value: 'Смарагдовий' },
          sized('XS–L'),
        ],
      },
      {
        name: 'Сукня лляна літня',
        description:
          '<p>Легка <strong>лляна</strong> сукня вільного крою для спекотних днів.</p>',
        priceMinor: 169900,
        onHand: 22,
        attributes: [
          { name: 'Матеріал', value: 'Льон 100%' },
          { name: 'Колір', value: 'Білий' },
          sized('XS–L'),
        ],
      },
      {
        name: 'Сукня-сорочка',
        description:
          '<p>Універсальна <em>сукня-сорочка</em> з поясом і ґудзиками.</p>',
        priceMinor: 159900,
        onHand: 24,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, віскоза' },
          { name: 'Колір', value: 'Блакитний' },
          sized('XS–XL'),
        ],
      },
      {
        name: 'Вечірня сукня максі',
        description:
          '<p>Елегантна сукня <strong>максі</strong> з драпіруванням для особливих подій.</p>',
        priceMinor: 289900,
        onHand: 14,
        attributes: [
          { name: 'Матеріал', value: 'Поліестер, сатин' },
          { name: 'Колір', value: 'Винний' },
          sized('XS–L'),
        ],
      },
      {
        name: 'Сарафан джинсовий',
        description:
          '<p>Молодіжний <em>джинсовий сарафан</em> з регульованими бретелями.</p>',
        priceMinor: 134900,
        onHand: 28,
        attributes: [
          { name: 'Матеріал', value: 'Денім, бавовна' },
          { name: 'Колір', value: 'Синій' },
          sized('XS–L'),
        ],
      },
    ],
  },
  {
    category: { name: 'Взуття', slug: 'shoes' },
    initial: 'В',
    from: '#3f3f46',
    to: '#71717a',
    products: [
      {
        name: 'Кросівки білі класичні',
        description:
          '<p>Універсальні білі <strong>кросівки</strong> з мінімалістичним дизайном.</p>',
        priceMinor: 249900,
        onHand: 40,
        attributes: [
          { name: 'Матеріал', value: 'Еко-шкіра, гума' },
          { name: 'Колір', value: 'Білий' },
          sized('36–45'),
        ],
      },
      {
        name: 'Кеди полотняні',
        description:
          '<p>Легкі <em>кеди</em> з текстилю на вулканізованій підошві.</p>',
        priceMinor: 139900,
        onHand: 46,
        attributes: [
          { name: 'Матеріал', value: 'Текстиль, гума' },
          { name: 'Колір', value: 'Чорний' },
          sized('36–45'),
        ],
      },
      {
        name: 'Черевики челсі',
        description:
          '<p>Стильні <strong>челсі</strong> з еластичними вставками, шкіра.</p>',
        priceMinor: 349900,
        onHand: 24,
        attributes: [
          { name: 'Матеріал', value: 'Натуральна шкіра' },
          { name: 'Колір', value: 'Коричневий' },
          sized('39–45'),
        ],
      },
      {
        name: 'Кросівки бігові',
        description:
          '<p>Легкі <em>бігові</em> кросівки з амортизацією та дихаючим верхом.</p>',
        priceMinor: 299900,
        onHand: 32,
        attributes: [
          { name: 'Матеріал', value: 'Сітка, піна EVA' },
          { name: 'Колір', value: 'Сіро-помаранчевий' },
          sized('38–46'),
        ],
      },
      {
        name: 'Лофери замшеві',
        description:
          '<p>Елегантні <strong>лофери</strong> із замші, зручна колодка.</p>',
        priceMinor: 319900,
        onHand: 20,
        attributes: [
          { name: 'Матеріал', value: 'Замша' },
          { name: 'Колір', value: 'Темно-синій' },
          sized('39–44'),
        ],
      },
      {
        name: 'Чоботи зимові',
        description:
          '<p>Теплі <em>зимові</em> чоботи з хутряною підкладкою, нековзна підошва.</p>',
        priceMinor: 429900,
        onHand: 17,
        attributes: [
          { name: 'Матеріал', value: 'Шкіра, хутро' },
          { name: 'Колір', value: 'Чорний' },
          sized('36–41'),
        ],
      },
    ],
  },
  {
    category: { name: 'Аксесуари', slug: 'accessories' },
    initial: 'А',
    from: '#854d0e',
    to: '#d97706',
    products: [
      {
        name: 'Шкіряний ремінь',
        description:
          '<p>Класичний <strong>ремінь</strong> зі справжньої шкіри з металевою пряжкою.</p>',
        priceMinor: 79900,
        onHand: 55,
        attributes: [
          { name: 'Матеріал', value: 'Натуральна шкіра' },
          { name: 'Колір', value: 'Коричневий' },
          sized('95–120 см'),
        ],
      },
      {
        name: 'Шапка-біні',
        description:
          '<p>М’яка в’язана <em>біні</em> дрібної в’язки, тримає тепло.</p>',
        priceMinor: 49900,
        onHand: 60,
        attributes: [
          { name: 'Матеріал', value: 'Акрил, вовна' },
          { name: 'Колір', value: 'Сірий' },
          { name: 'Розмір', value: 'Універсальний' },
        ],
      },
      {
        name: 'Шарф вовняний',
        description:
          '<p>Теплий <strong>вовняний</strong> шарф великої в’язки.</p>',
        priceMinor: 89900,
        onHand: 44,
        attributes: [
          { name: 'Матеріал', value: 'Вовна 50%, акрил 50%' },
          { name: 'Колір', value: 'Бордовий' },
          { name: 'Розмір', value: '180×30 см' },
        ],
      },
      {
        name: 'Рюкзак міський',
        description:
          '<p>Місткий <em>рюкзак</em> з відділенням для ноутбука, водовідштовхувач.</p>',
        priceMinor: 199900,
        onHand: 30,
        attributes: [
          { name: 'Матеріал', value: 'Поліестер' },
          { name: 'Колір', value: 'Чорний' },
          { name: 'Об’єм', value: '20 л' },
        ],
      },
      {
        name: 'Кепка-бейсболка',
        description:
          '<p>Бавовняна <strong>бейсболка</strong> з регулюванням ззаду.</p>',
        priceMinor: 59900,
        onHand: 58,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна 100%' },
          { name: 'Колір', value: 'Бежевий' },
          { name: 'Розмір', value: 'Універсальний' },
        ],
      },
      {
        name: 'Шкарпетки (набір 3 пари)',
        description:
          '<p>Набір бавовняних <em>шкарпеток</em>, 3 пари, посилена п’ята.</p>',
        priceMinor: 39900,
        onHand: 80,
        attributes: [
          { name: 'Матеріал', value: 'Бавовна, еластан' },
          { name: 'Колір', value: 'Асорті' },
          sized('39–45'),
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
      const objectKey = `products/${product.id}/${imageId}.svg`;
      const svg = tileSvg(
        seedProduct.name,
        entry.category.name,
        entry.initial,
        entry.from,
        entry.to,
      );
      await putObject(objectKey, svg, 'image/svg+xml');
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
