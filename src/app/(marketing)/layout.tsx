export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1 w-full pt-16">{children}</main>;
}
