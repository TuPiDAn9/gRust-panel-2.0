import { Header } from "@/components/header";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-4">{children}</main>
    </div>
  );
}
