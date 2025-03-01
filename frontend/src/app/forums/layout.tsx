export default function ForumsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="py-10">
      {children}
    </section>
  );
}
