
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL,
  });

  const destinations = [
    {
      nameVi: "Vịnh Hạ Long",
      nameEn: "Ha Long Bay",
      slug: "ha-long-bay",
      description: "Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi kỳ vĩ và hang động độc đáo.",
      imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
      regionSlug: "mien-bac",
      sortOrder: 1
    },
    {
      nameVi: "Thủ đô Hà Nội",
      nameEn: "Hanoi Capital",
      slug: "hanoi",
      description: "Thủ đô ngàn năm văn hiến với Hồ Gươm, Phố Cổ và nét ẩm thực tinh tế.",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      regionSlug: "mien-bac",
      sortOrder: 2
    },
    {
      nameVi: "Sa Pa",
      nameEn: "Sapa",
      slug: "sapa",
      description: "Thị trấn trong sương với những ruộng bậc thang tuyệt đẹp và đỉnh Fansipan hùng vĩ.",
      imageUrl: "https://images.unsplash.com/photo-1504457047772-27faf1c00561",
      regionSlug: "mien-bac",
      sortOrder: 3
    },
    {
      nameVi: "Đà Nẵng",
      nameEn: "Da Nang",
      slug: "da-nang",
      description: "Thành phố biển năng động với Cầu Vàng, Bà Nà Hills và bãi biển Mỹ Khê.",
      imageUrl: "https://images.unsplash.com/photo-1559592442-7e18ad73d700",
      regionSlug: "mien-trung",
      sortOrder: 1
    },
    {
      nameVi: "Phố cổ Hội An",
      nameEn: "Hoi An Ancient Town",
      slug: "hoi-an",
      description: "Di sản văn hóa thế giới với những con phố vàng rực và ánh đèn lồng lung linh.",
      imageUrl: "https://images.unsplash.com/photo-1582260273873-195c697c5f88",
      regionSlug: "mien-trung",
      sortOrder: 2
    },
    {
      nameVi: "Cố đô Huế",
      nameEn: "Hue Imperial City",
      slug: "hue",
      description: "Vẻ đẹp tĩnh lặng và cổ kính của kinh thành xưa bên dòng sông Hương thơ mộng.",
      imageUrl: "https://images.unsplash.com/photo-1599708153386-62e249767253",
      regionSlug: "mien-trung",
      sortOrder: 3
    },
    {
      nameVi: "TP. Hồ Chí Minh",
      nameEn: "Ho Chi Minh City",
      slug: "ho-chi-minh-city",
      description: "Trung tâm kinh tế sầm uất mang vẻ đẹp trẻ trung, hiện đại và không bao giờ ngủ.",
      imageUrl: "https://images.unsplash.com/photo-1529154036614-a60975f5c760",
      regionSlug: "mien-nam",
      sortOrder: 1
    },
    {
      nameVi: "Đảo ngọc Phú Quốc",
      nameEn: "Phu Quoc Island",
      slug: "phu-quoc",
      description: "Thiên đường nghỉ dưỡng với biển xanh, cát trắng và những khu vui chơi giải trí đẳng cấp.",
      imageUrl: "https://images.unsplash.com/photo-1589815462524-814d24176180",
      regionSlug: "mien-nam",
      sortOrder: 2
    },
    {
      nameVi: "Cần Thơ",
      nameEn: "Can Tho",
      slug: "can-tho",
      description: "Thủ phủ vùng sông nước Cửu Long với chợ nổi Cái Răng và vườn trái cây trĩu quả.",
      imageUrl: "https://images.unsplash.com/photo-1563811771046-ba984ff30900",
      regionSlug: "mien-nam",
      sortOrder: 3
    }
  ];

  console.log("🚀 Seeding destinations...");
  try {
    for (const dest of destinations) {
      const region = await prisma.region.findUnique({
        where: { slug: dest.regionSlug }
      });

      if (region) {
        await prisma.destination.upsert({
          where: { slug: dest.slug },
          update: {},
          create: {
            nameVi: dest.nameVi,
            nameEn: dest.nameEn,
            slug: dest.slug,
            description: dest.description,
            imageUrl: dest.imageUrl,
            regionId: region.id,
            sortOrder: dest.sortOrder
          }
        });
        console.log(`✅ Seeded: ${dest.nameVi}`);
      } else {
        console.warn(`⚠️ Region not found: ${dest.regionSlug}`);
      }
    }
    console.log("✨ Destination seeding completed!");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
