/* eslint-disable no-console */
import type { HomeModule } from "../src/types/builder";
import type { HomeSetting } from "../src/types/settings";

import { Prisma, PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import sharp from "sharp";

import { cloudinary } from "../src/lib/cloudinary";

function toHomeSettingJson(modules: HomeModule[]): Prisma.InputJsonValue {
  const payload: HomeSetting = { modules };

  return payload as unknown as Prisma.InputJsonValue;
}

function buildDefaultModules(
  heroUrl: string,
  hoiAnUrl: string,
  destinationIds: string[],
): HomeModule[] {
  return [
    {
      id: "hero_default",
      type: "HERO",
      isVisible: true,
      content: {
        type: "image",
        layoutVariant: "fullscreen",
        heroTitle: {
          vi: "Khám phá Việt Nam theo cách riêng của bạn",
          en: "Discover Vietnam your way",
        },
        heroDescription: {
          vi: "Hành trình di sản, trải nghiệm đẳng cấp.",
          en: "Heritage journey, premium experience.",
        },
        heroImages: heroUrl ? [heroUrl] : [],
        ctaText: { vi: "Bạn muốn đi đâu?", en: "Where do you want to go?" },
        buttonText: { vi: "Tìm hiểu thêm", en: "Learn more" },
        searchSuggestions: [],
      },
    },
    {
      id: "destinations_default",
      type: "DESTINATIONS",
      isVisible: true,
      content: {
        sectionTitle: { vi: "Điểm đến hàng đầu", en: "Top Destinations" },
        selectedIds: destinationIds,
        layoutPattern: "grid",
      },
    },
    {
      id: "why_vivu_default",
      type: "WHY_VIVU",
      isVisible: true,
      content: {
        sectionTitle: {
          vi: "Tại sao chọn Vivu Travel?",
          en: "Why Vivu Travel?",
        },
        sectionSubtitle: {
          vi: "Đồng hành cùng bạn trên mọi hành trình",
          en: "Your trusted travel companion",
        },
        featuredImage: hoiAnUrl,
        items: [
          {
            icon: "ShieldCheck",
            title: { vi: "Uy tín hàng đầu", en: "Top Reputation" },
            desc: {
              vi: "Kinh nghiệm du lịch chuyên nghiệp.",
              en: "Professional travel experience.",
            },
          },
          {
            icon: "Heart",
            title: { vi: "Tận tâm phục vụ", en: "Dedicated Service" },
            desc: { vi: "Đồng hành cùng bạn 24/7.", en: "24/7 Support." },
          },
        ],
      },
    },
    {
      id: "promotion_default",
      type: "PROMOTION",
      isVisible: true,
      content: {
        content: {
          vi: "Ưu đãi mùa hè rực rỡ - Giảm tới 45%",
          en: "Summer Promo - Up to 45% Off",
        },
        deadline: "2026-06-30 23:59:59",
        theme: "gold",
      },
    },
    {
      id: "story_default",
      type: "STORYTELLING",
      isVisible: true,
      content: {
        title: {
          vi: "Mỗi hành trình là một câu chuyện cảm hứng",
          en: "Every journey is an inspiring story",
        },
        items: [
          {
            author: "Minh Anh",
            role: "Travel Blogger",
            quote: "Vivu Travel mang đến những góc nhìn thật khác về Việt Nam.",
            rating: 5,
          },
        ],
      },
    },
  ];
}

// Cloudinary Config - Serverside
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

/**
 * Tải ảnh từ URL, chuyển đổi sang WebP bằng Sharp (Yêu cầu user) và upload lên Cloudinary
 */
async function processAndUpload(
  url: string,
  publicId: string,
  folder: string = "vivu_travel/seeding",
) {
  try {
    console.log(`📸 Processing & Uploading: ${publicId}...`);
    // 1. Tải ảnh từ URL với User-Agent để tránh bị Unsplash chặn
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    const buffer = Buffer.from(response.data);

    // 2. Chuyển đổi sang WebP bằng Sharp
    const webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();

    // 3. Upload lên Cloudinary từ Buffer
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          format: "webp",
          resource_type: "image",
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            console.error(
              `❌ Cloudinary upload failed for ${publicId}:`,
              error,
            );
            reject(error);
          } else {
            console.log(`✅ Success: ${result?.secure_url}`);
            resolve(result?.secure_url || "");
          }
        },
      );

      uploadStream.end(webpBuffer);
    });
  } catch (error) {
    console.error(`❌ Failed to process ${publicId}:`, error);

    return "";
  }
}

async function main() {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL,
  });

  console.log("🌱 STARTING FINAL ICONIC SEEDING (WebP + Cloudinary)...");

  try {
    // 1. Admin Auth - ĐỒNG BỘ QUYỀN ADMIN (Dành cho user đã tạo thủ công)
    const ADMIN_EMAIL = "admin.vivu@gmail.com";
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (SERVICE_ROLE_KEY) {
      console.log("🔐 [AUTH] Elevating Admin User...");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        SERVICE_ROLE_KEY,
      );

      const {
        data: { users },
        error: listError,
      } = await supabase.auth.admin.listUsers();

      if (listError) throw listError;

      const user = users.find((u) => u.email === ADMIN_EMAIL);

      if (!user) {
        console.error(
          `❌ [AUTH] User ${ADMIN_EMAIL} not found! Please create it in Supabase first.`,
        );
      } else {
        const userId = user.id;

        console.log(`✅ [AUTH] Found user ${ADMIN_EMAIL} (ID: ${userId})`);

        // Cấp quyền Admin trong Auth Metadata
        await supabase.auth.admin.updateUserById(userId, {
          app_metadata: { role: "ADMIN" },
        });

        // Cấp quyền Admin trong Database Profile
        await prisma.profile.upsert({
          where: { id: userId },
          update: { role: "ADMIN" },
          create: {
            id: userId,
            role: "ADMIN",
            displayName: "System Admin",
          },
        });
        console.log("🚀 [SUCCESS] Account elevated to ADMIN.");
      }
    }

    // 2. Regions
    const regions = [
      {
        code: "mb",
        slug: "mien-bac",
        nameVi: "Miền Bắc",
        nameEn: "North",
        sortOrder: 1,
      },
      {
        code: "mt",
        slug: "mien-trung",
        nameVi: "Miền Trung",
        nameEn: "Central",
        sortOrder: 2,
      },
      {
        code: "mn",
        slug: "mien-nam",
        nameVi: "Miền Nam",
        nameEn: "South",
        sortOrder: 3,
      },
    ];

    for (const r of regions) {
      await prisma.region.upsert({
        where: { slug: r.slug },
        update: {},
        create: r,
      });
    }

    // 3. Destinations - FINAL VERIFIED URLS (STABLE)
    const configs = [
      {
        nameVi: "Vịnh Hạ Long",
        slug: "ha-long-bay",
        url: "https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?q=80&w=2000",
        region: "mien-bac",
        order: 1,
      },
      {
        nameVi: "Cố đô Huế",
        slug: "hue",
        url: "https://images.unsplash.com/photo-1608753529548-3898cb559f48?q=80&w=2000",
        region: "mien-trung",
        order: 1,
      },
      {
        nameVi: "Đảo Ngọc Phú Quốc",
        slug: "phu-quoc",
        url: "https://images.unsplash.com/photo-1732243395944-cb3ff9311091?q=80&w=2000",
        region: "mien-nam",
        order: 1,
      },
      {
        nameVi: "Thủ đô Hà Nội",
        slug: "hanoi",
        url: "https://images.unsplash.com/photo-1763218412689-7140df124269?q=80&w=2000",
        region: "mien-bac",
        order: 2,
      },
      {
        nameVi: "Cầu Vàng Đà Nẵng",
        slug: "da-nang",
        url: "https://images.unsplash.com/photo-1741138327956-dfa75763b50d?q=80&w=2000",
        region: "mien-trung",
        order: 2,
      },
      {
        nameVi: "TP. Hồ Chí Minh",
        slug: "ho-chi-minh-city",
        url: "https://images.unsplash.com/photo-1758295124283-d9eb271dd1ce?q=80&w=2000",
        region: "mien-nam",
        order: 2,
      },
      {
        nameVi: "Sa Pa",
        slug: "sapa",
        url: "https://images.unsplash.com/photo-1758002514616-7688e17ab6c7?q=80&w=2000",
        region: "mien-bac",
        order: 3,
      },
      {
        nameVi: "Phố cổ Hội An",
        slug: "hoi-an",
        url: "https://images.unsplash.com/photo-1569271532956-3fb81a207115?q=80&w=2000",
        region: "mien-trung",
        order: 3,
      },
      {
        nameVi: "Chợ nổi Cần Thơ",
        slug: "can-tho",
        url: "https://images.unsplash.com/photo-1529271230144-e8c648ef570d?q=80&w=2000",
        region: "mien-nam",
        order: 3,
      },
    ];

    const uploadedUrls: Record<string, string> = {};

    for (const c of configs) {
      const secureUrl = await processAndUpload(c.url, `iconic_${c.slug}`);

      if (secureUrl) {
        uploadedUrls[c.slug] = secureUrl;
        const region = await prisma.region.findUnique({
          where: { slug: c.region },
        });

        if (region) {
          await prisma.destination.upsert({
            where: { slug: c.slug },
            update: { imageUrl: secureUrl },
            create: {
              nameVi: c.nameVi,
              nameEn: c.slug.replace(/-/g, " "),
              slug: c.slug,
              description: `Khám phá vẻ đẹp tuyệt vời tại ${c.nameVi}.`,
              imageUrl: secureUrl,
              regionId: region.id,
              sortOrder: c.order,
            },
          });
        }
      }
    }

    // 4. HomeSetting
    console.log("🏠 Initializing HomeSetting...");
    const heroUrl = uploadedUrls["ha-long-bay"] || "";
    const hoiAnUrl = uploadedUrls["hoi-an"] || "";

    const featuredSlugs = configs.slice(0, 6).map((d) => d.slug);
    const featuredDestinations = await prisma.destination.findMany({
      where: { slug: { in: featuredSlugs } },
      select: { id: true, slug: true },
    });
    const destinationIds = featuredSlugs
      .map(
        (slug) => featuredDestinations.find((d) => d.slug === slug)?.id ?? "",
      )
      .filter(Boolean);

    const defaultModules = buildDefaultModules(
      heroUrl,
      hoiAnUrl,
      destinationIds,
    );
    const homeContent = toHomeSettingJson(defaultModules);

    await prisma.homeSetting.upsert({
      where: { id: "default" },
      update: { content: homeContent },
      create: { id: "default", content: homeContent },
    });

    console.log("✨ FINAL SEEDING SUCCESSFUL!");
  } catch (error) {
    console.error("❌ FAILED:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("❌ Unhandled seed error:", error);
  process.exit(1);
});
