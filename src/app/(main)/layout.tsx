import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/config/site";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className='container mx-auto max-w-7xl px-6 flex-grow'>
        {children}
      </main>
      <Footer />
    </div>
  );
}
