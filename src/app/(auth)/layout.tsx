// Route group (auth) — không có Navbar và Footer, dùng layout riêng
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
