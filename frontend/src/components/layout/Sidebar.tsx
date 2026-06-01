'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/projects', label: 'Projects', icon: '📁' },
  { href: '/dashboard/agents', label: 'AI Agents', icon: '🤖' },
  { href: '/dashboard/invoices', label: 'Invoices', icon: '💰' },
  { href: '/dashboard/clients', label: 'Clients', icon: '👥' },
];

const bottomItems = [
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <span className="sidebar-logo-text">AgentFlow</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">Main Menu</div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
            id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        <div style={{ flex: 1 }} />

        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-link ${isActive(item.href) ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="flex items-center gap-md">
          <div className="avatar avatar-sm" style={{ background: 'var(--gradient-primary)' }}>
            AR
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }} className="truncate-text">
              Ahmad Rizki
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)' }}>
              Admin
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
