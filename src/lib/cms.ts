import { prisma } from "@/lib/db";
import { news as defaultNews, school as defaultSchool } from "@/lib/data";

export type SchoolSettingsView = {
  name: string;
  shortName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  youtube: string;
  logo: string;
  logoIcon: string;
  heroImage: string;
  aboutImage: string;
  admissionsImage: string;
  aboutText: string;
};

export type NewsArticleView = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  image: string;
  published: boolean;
  date: string;
};

const defaultAboutText = `Trường Trung cấp Y Dược Tuệ Tĩnh Hà Nội kế thừa tinh thần đào tạo y dược cổ truyền gắn với thực tiễn chăm sóc sức khỏe cộng đồng. Mục tiêu của trường không chỉ truyền đạt kiến thức mà còn rèn luyện tay nghề, đạo đức nghề và năng lực hành nghề.`;

export async function getSchoolSettings(): Promise<SchoolSettingsView> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (!row) {
    return {
      ...defaultSchool,
      aboutText: defaultAboutText,
    };
  }
  return {
    name: row.name,
    shortName: row.shortName,
    tagline: row.tagline,
    phone: row.phone,
    email: row.email,
    address: row.address,
    facebook: row.facebook,
    youtube: row.youtube,
    logo: row.logoUrl,
    logoIcon: row.logoIconUrl,
    heroImage: row.heroImageUrl,
    aboutImage: row.aboutImageUrl,
    admissionsImage: row.admissionsImageUrl,
    aboutText: row.aboutText || defaultAboutText,
  };
}

export async function upsertSchoolSettings(
  input: Omit<SchoolSettingsView, "logo" | "logoIcon" | "heroImage" | "aboutImage" | "admissionsImage"> & {
    logo: string;
    logoIcon: string;
    heroImage: string;
    aboutImage: string;
    admissionsImage: string;
  },
) {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      name: input.name,
      shortName: input.shortName,
      tagline: input.tagline,
      phone: input.phone,
      email: input.email,
      address: input.address,
      facebook: input.facebook,
      youtube: input.youtube,
      logoUrl: input.logo,
      logoIconUrl: input.logoIcon,
      heroImageUrl: input.heroImage,
      aboutImageUrl: input.aboutImage,
      admissionsImageUrl: input.admissionsImage,
      aboutText: input.aboutText,
    },
    update: {
      name: input.name,
      shortName: input.shortName,
      tagline: input.tagline,
      phone: input.phone,
      email: input.email,
      address: input.address,
      facebook: input.facebook,
      youtube: input.youtube,
      logoUrl: input.logo,
      logoIconUrl: input.logoIcon,
      heroImageUrl: input.heroImage,
      aboutImageUrl: input.aboutImage,
      admissionsImageUrl: input.admissionsImage,
      aboutText: input.aboutText,
    },
  });
}

function mapNews(row: {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  published: boolean;
  publishedAt: Date;
}): NewsArticleView {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    body: row.body,
    image: row.imageUrl,
    published: row.published,
    date: row.publishedAt.toISOString().slice(0, 10),
  };
}

export async function listPublishedNews(): Promise<NewsArticleView[]> {
  const rows = await prisma.newsArticle.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  if (rows.length === 0) {
    return defaultNews.map((n, i) => ({
      id: `fallback-${i}`,
      slug: n.slug,
      title: n.title,
      category: n.category,
      excerpt: n.excerpt,
      body: "",
      image: n.image,
      published: true,
      date: n.date,
    }));
  }
  return rows.map(mapNews);
}

export async function listAllNews(): Promise<NewsArticleView[]> {
  const rows = await prisma.newsArticle.findMany({
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(mapNews);
}

export async function getNewsBySlug(slug: string): Promise<NewsArticleView | null> {
  const row = await prisma.newsArticle.findUnique({ where: { slug } });
  return row ? mapNews(row) : null;
}

export async function getNewsById(id: string): Promise<NewsArticleView | null> {
  const row = await prisma.newsArticle.findUnique({ where: { id } });
  return row ? mapNews(row) : null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function createNews(input: {
  title: string;
  category: string;
  excerpt: string;
  body?: string;
  imageUrl: string;
  published?: boolean;
  publishedAt?: string;
}) {
  const base = slugify(input.title) || `tin-${Date.now()}`;
  let slug = base;
  let i = 1;
  while (await prisma.newsArticle.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return prisma.newsArticle.create({
    data: {
      slug,
      title: input.title,
      category: input.category,
      excerpt: input.excerpt,
      body: input.body ?? "",
      imageUrl: input.imageUrl,
      published: input.published ?? true,
      publishedAt: input.publishedAt
        ? new Date(input.publishedAt)
        : new Date(),
    },
  });
}

export async function updateNews(
  id: string,
  input: {
    title: string;
    category: string;
    excerpt: string;
    body?: string;
    imageUrl: string;
    published: boolean;
    publishedAt?: string;
  },
) {
  return prisma.newsArticle.update({
    where: { id },
    data: {
      title: input.title,
      category: input.category,
      excerpt: input.excerpt,
      body: input.body ?? "",
      imageUrl: input.imageUrl,
      published: input.published,
      publishedAt: input.publishedAt
        ? new Date(input.publishedAt)
        : undefined,
    },
  });
}

export async function deleteNews(id: string) {
  return prisma.newsArticle.delete({ where: { id } });
}
