import PortalNav from '@/components/layout/PortalNav';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <PortalNav />
      <main className="portal-content fade-in">
        {children}
      </main>
    </div>
  );
}

