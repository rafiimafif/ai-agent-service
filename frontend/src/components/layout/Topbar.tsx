'use client';

import { usePathname, useRouter } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/projects': 'Projects',
  '/dashboard/agents': 'AI Agents',
  '/dashboard/invoices': 'Invoices',
  '/dashboard/clients': 'Clients',
  '/dashboard/settings': 'Settings',
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Find the matching title
  const title = Object.entries(pageTitles).find(([path]) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  })?.[1] || 'Dashboard';

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
  };

  return (
    <header className="topbar" id="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <button className="btn btn-ghost btn-icon" style={{ position: 'relative', fontSize: '1.25rem' }} title="Notifications">
          🔔
          <span className="notification-badge">3</span>
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleLogout}
          id="logout-button"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
