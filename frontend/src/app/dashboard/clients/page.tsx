'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface ClientData {
  id: string;
  name: string;
  email: string;
  locale: string;
  createdAt: string;
  _count: { projects: number };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then(setClients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-subtitle">Manage your client relationships.</p>
        </div>
      </div>

      {loading ? (
        <div className="card card-body">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-md" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
              <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '40%', height: 18, marginBottom: 6 }} />
                <div className="skeleton" style={{ width: '60%', height: 14 }} />
              </div>
            </div>
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-title">No clients yet</div>
          <div className="empty-state-desc">Clients will appear when they register.</div>
        </div>
      ) : (
        <div className="card">
          {clients.map((client, i) => (
            <div
              key={client.id}
              className="flex items-center gap-md"
              style={{
                padding: 'var(--space-md) var(--space-lg)',
                borderBottom: i < clients.length - 1 ? '1px solid var(--border-light)' : 'none',
                transition: 'background var(--transition-fast)',
              }}
            >
              <div className="avatar avatar-lg" style={{
                background: `hsl(${(i * 72) % 360}, 60%, 55%)`,
              }}>
                {getInitials(client.name)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{client.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {client.email}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: 4 }}>
                  {client._count.projects} {client._count.projects === 1 ? 'project' : 'projects'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Joined {formatDate(client.createdAt, 'en')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
