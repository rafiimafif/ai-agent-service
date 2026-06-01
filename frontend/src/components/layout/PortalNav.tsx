'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function PortalNav() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch session details on mount
    fetch('/api/auth/session')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error('Error fetching session:', err));

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'C';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="portal-nav">
      <Link href="/portal" style={{ textDecoration: 'none' }}>
        <div className="topbar-title" style={{ color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontWeight: 'bold' }}>
          <span>⚡</span>
          <span>AgentFlow Portal</span>
        </div>
      </Link>
      
      <div className="topbar-right" ref={dropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        {user?.role?.toUpperCase() === 'ADMIN' && (
          <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ fontWeight: 600 }}>
            ⚙️ Admin Dashboard
          </Link>
        )}
        
        <div 
          className="avatar avatar-md" 
          style={{ 
            cursor: 'pointer', 
            background: 'var(--gradient-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            userSelect: 'none',
            boxShadow: 'var(--shadow-sm)',
            transition: 'transform var(--transition-fast)'
          }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          title={user?.name || 'Client Menu'}
        >
          {user ? getInitials(user.name) : 'C'}
        </div>

        {dropdownOpen && (
          <div 
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(var(--topbar-height) - 10px)',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              minWidth: '240px',
              zIndex: 1000,
              padding: 'var(--space-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
              animation: 'fadeIn 0.2s ease-out forwards'
            }}
          >
            {user ? (
              <div style={{ paddingBottom: 'var(--space-xs)', borderBottom: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
                <div style={{ alignSelf: 'flex-start', fontSize: '0.6875rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 'bold', marginTop: 'var(--space-xs)', textTransform: 'capitalize' }}>
                  {user.role}
                </div>
              </div>
            ) : (
              <div style={{ paddingBottom: 'var(--space-xs)', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Loading session...
                </div>
              </div>
            )}
            
            <button
              className="btn btn-ghost btn-sm"
              style={{ 
                justifyContent: 'flex-start', 
                width: '100%', 
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-sm)',
                cursor: 'pointer'
              }}
              onClick={handleLogout}
              id="logout-button"
            >
              <span>🚪</span> Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
