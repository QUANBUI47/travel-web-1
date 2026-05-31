/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import sharp from "sharp";

import { cloudinary } from "../src/lib/cloudinary";

async function processAndUpload(url: string, publicId: string) {
  try {
    console.log(`📸 Processing image: ${publicId}...`);
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });
    const buffer = Buffer.from(response.data);
    const webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();

    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "vivu_travel/tours",
          public_id: publicId,
          format: "webp",
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url || "");
        },
      );

      uploadStream.end(webpBuffer);
    });
  } catch (error) {
    console.error(`❌ Failed to process ${publicId}:`, error);

    return "";
  }
}

const prisma = new PrismaClient();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("🌱 SEEDING PREMIUM TOURS WITH CLOUDINARY (RETRY STRATEGY)...");

  const destinations = await prisma.destination.findMany();
  const getDestId = (slug: string) =>
    destinations.find((d) => d.slug === slug)?.id;

  const haLongId = getDestId("ha-long-bay");
  const sapaId = getDestId("sapa");
  const hueId = getDestId("hue");
  const hoiAnId = getDestId("hoi-an");
  const daNangId = getDestId("da-nang");
  const hanoiId = getDestId("hanoi");
  const phuQuocId = getDestId("phu-quoc");
  const canThoId = getDestId("can-tho");
  const hcmId = getDestId("ho-chi-minh-city");

  const tourData = [
    {
      nameVi: "Du thuyền Hạ Long Heritage 5 Sao - 2 Ngày 1 Đêm",
      slug: "du-thuyen-ha-long-heritage-5-sao",
      imgUrl:
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2000",
      destinationId: haLongId,
      price: 3500000,
      duration: "2 Ngày 1 Đêm",
    },
    {
      nameVi: "Sa Pa - Chinh phục Fansipan - Bản Cát Cát",
      slug: "sa-pa-fansipan-cat-cat",
      imgUrl:
        "https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=2000",
      destinationId: sapaId,
      price: 2800000,
      duration: "3 Ngày 2 Đêm",
    },
    {
      nameVi: "Khám phá Cố đô Huế - Vẻ đẹp di sản",
      slug: "kham-pha-co-do-hue",
      imgUrl:
        "https://images.unsplash.com/photo-1608753529548-3898cb559f48?q=80&w=2000", // Verified URL
      destinationId: hueId,
      price: 1500000,
      duration: "1 Ngày",
    },
    {
      nameVi: "Hội An Hoài Cổ - Trải nghiệm đèn lồng",
      slug: "hoi-an-hoai-co",
      imgUrl:
        "https://images.unsplash.com/photo-1569271532956-3fb81a207115?q=80&w=2000",
      destinationId: hoiAnId,
      price: 1200000,
      duration: "1 Ngày",
    },
    {
      nameVi: "Đà Nẵng - Bà Nà Hills - Cầu Vàng",
      slug: "da-nang-ba-na-hills",
      imgUrl:
        "https://images.unsplash.com/photo-1741138327956-dfa75763b50d?q=80&w=2000",
      destinationId: daNangId,
      price: 2200000,
      duration: "1 Ngày",
    },
    {
      nameVi: "Ninh Bình - Tuyệt tác Tràng An - Bái Đính",
      slug: "ninh-binh-trang-an-bai-dinh",
      imgUrl:
        "https://images.unsplash.com/photo-1763218412689-7140df124269?q=80&w=2000", // Verified URL
      destinationId: hanoiId,
      price: 1800000,
      duration: "1 Ngày",
    },
    {
      nameVi: "Phú Quốc - Đảo Ngọc Thiên Đường",
      slug: "phu-quoc-dao-ngoc",
      imgUrl:
        "https://images.unsplash.com/photo-1732243395944-cb3ff9311091?q=80&w=2000",
      destinationId: phuQuocId,
      price: 4500000,
      duration: "3 Ngày 2 Đêm",
    },
    {
      nameVi: "Miền Tây - Chợ nổi Cái Răng - Cần Thơ",
      slug: "mien-tay-cho-noi-cai-rang",
      imgUrl:
        "https://images.unsplash.com/photo-1529271230144-e8c648ef570d?q=80&w=2000",
      destinationId: canThoId,
      price: 950000,
      duration: "1 Ngày",
    },
    {
      nameVi: "Sài Gòn City Tour - Hòn Ngọc Viễn Đông",
      slug: "sai-gon-city-tour",
      imgUrl:
        "https://images.unsplash.com/photo-1758295124283-d9eb271dd1ce?q=80&w=2000",
      destinationId: hcmId,
      price: 750000,
      duration: "1 Ngày",
    },
  ];

  for (const t of tourData) {
    if (!t.destinationId) continue;

    await sleep(1500); // Thêm delay 1.5s giữa các ảnh để tránh bị Unsplash chặn
    const uploadedUrl = await processAndUpload(t.imgUrl, `tour_${t.slug}`);

    await prisma.tour.upsert({
      where: { slug: t.slug },
      update: { imageUrls: [uploadedUrl] },
      create: {
        nameVi: t.nameVi,
        nameEn: t.slug.replace(/-/g, " "),
        slug: t.slug,
        description:
          "<h2>Khám phá vẻ đẹp tuyệt vời</h2><p>Hành trình trải nghiệm đẳng cấp và đầy cảm hứng.</p>",
        priceAdult: t.price,
        durationDays: parseInt(t.duration),
        imageUrls: [uploadedUrl],
        destinationId: t.destinationId,
        departurePoint: "Hà Nội",
        tourType: "SERIES",
        transport: "Xe cao cấp",
        inclusions: "<p>Bao gồm trọn gói ăn uống và lưu trú.</p>",
        exclusions: "<p>Không bao gồm chi phí cá nhân.</p>",
        policy: "<p>Chính sách linh hoạt.</p>",
      },
    });
    console.log(`✅ Upserted Tour: ${t.nameVi}`);
  }

  console.log("✨ SEEDING COMPLETED!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
