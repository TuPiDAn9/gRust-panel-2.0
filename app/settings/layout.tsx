export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-background">
      <div className="container py-4">{children}</div>
    </div>
  );
}
