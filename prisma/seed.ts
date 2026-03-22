import { PrismaClient, Role } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

async function main() {
  // Dùng DIRECT_URL để đảm bảo kết nối ổn định khi seeding (giống npx prisma db push)
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL,
  });
  console.log("🌱 Starting seeding...");
  console.log("DEBUG: DIRECT_URL present:", !!process.env.DIRECT_URL);

  try {
    // 1. Phân quyền Admin
    const ADMIN_EMAIL = "admin.vivu@gmail.com";
    const ADMIN_PASSWORD = "123456aA@";
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (SERVICE_ROLE_KEY) {
      console.log(`📡 Creating/Checking Admin account: ${ADMIN_EMAIL}...`);
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

      // Tìm user ID qua email
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        console.error("❌ Error listing users:", listError.message);
      } else {
        let userId = users.find(u => u.email === ADMIN_EMAIL)?.id;

        if (!userId) {
          console.log("🆕 Admin user not found. Creating new one...");
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
          });

          if (createError) {
            console.error("❌ Failed to create admin user:", createError.message);
          } else {
            userId = newUser.user.id;
          }
        }

        if (userId) {
          console.log(`🔑 Promoting user ${userId} to ADMIN in Prisma...`);
          await prisma.profile.upsert({
            where: { id: userId },
            update: { role: Role.ADMIN, displayName: "System Admin" },
            create: {
              id: userId,
              role: Role.ADMIN,
              displayName: "System Admin",
            },
          });
          console.log("✅ Admin role assigned successfully!");
        }
      }
    } else {
      console.log("⚠️ SUPABASE_SERVICE_ROLE_KEY not found in environment.");
      console.log("💡 Tip: Add it to .env.local OR register manually on the web first.");
      console.log(`💡 Then use: ADMIN_USER_ID=your-id npx prisma db seed`);
    }

    // 2. Tạo nội dung Pháp lý mẫu
    console.log("📄 Seeding legal contents...");
    const legalPages = [
      {
        slug: "dieu-khoan-dich-vu",
        title: "Điều khoản Dịch vụ",
        content: [
          { title: "Chấp thuận điều khoản", content: "Bằng việc sử dụng Vivu Travel, bạn đồng ý với các điều khoản này..." },
          { title: "Quyền hạn", content: "Chúng tôi có quyền thay đổi dịch vụ mà không cần báo trước." }
        ],
      },
      {
        slug: "chinh-sach-bao-mat",
        title: "Chính sách Bảo mật",
        content: [
          { title: "Thu thập thông tin", content: "Chúng tôi thu thập email và số điện thoại để xử lý đặt chỗ." },
          { title: "Bảo mật", content: "Dữ liệu của bạn được mã hóa chuẩn AES-256." }
        ],
      }
    ];

    for (const page of legalPages) {
      await prisma.legalContent.upsert({
        where: { slug: page.slug },
        update: {},
        create: {
          slug: page.slug,
          title: page.title,
          content: page.content as any,
          version: "1.0",
        },
      });
    }
    console.log("✅ Legal contents seeded.");
    
    // 3. Tạo các Vùng miền (Bắc, Trung, Nam)
    console.log("🌏 Seeding regions...");
    const regions = [
      { slug: "mien-bac", nameVi: "Miền Bắc", nameEn: "North", sortOrder: 1 },
      { slug: "mien-trung", nameVi: "Miền Trung", nameEn: "Central", sortOrder: 2 },
      { slug: "mien-nam", nameVi: "Miền Nam", nameEn: "South", sortOrder: 3 },
    ];

    for (const region of regions) {
      await prisma.region.upsert({
        where: { slug: region.slug },
        update: {},
        create: {
          slug: region.slug,
          nameVi: region.nameVi,
          nameEn: region.nameEn,
          sortOrder: region.sortOrder,
        },
      });
    }
    console.log("✅ Regions seeded.");

    console.log("✨ Seeding completed successfully!");
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  });
