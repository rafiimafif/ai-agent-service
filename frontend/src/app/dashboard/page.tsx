'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { PROJECT_STATUS_CONFIG } from '@/types';
import type { ProjectStatus } from '@/types';

interface AnalyticsData {
  totalRevenue: number;
  pendingRevenue: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalClients: number;
  totalTasks: number;
  completedTasks: number;
  recentActivity: Array<{
    id: string;
    action: string;
    detail: string;
    createdAt: string;
    user: { name: string };
    project: { id: string; title: string };
  }>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back! Here&apos;s your agency overview.</p>
          </div>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card stat-card">
              <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)' }} />
              <div className="stat-content">
                <div className="skeleton" style={{ width: '60%', height: 28, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: '40%', height: 14 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: 'Total Revenue',
      value: formatCurrency(data.totalRevenue, 'id'),
      change: 27,
      icon: '💰',
      color: '#10B981',
      bg: '#ECFDF5',
    },
    {
      label: 'Active Projects',
      value: data.activeProjects,
      change: 12,
      icon: '📁',
      color: '#3B82F6',
      bg: '#EFF6FF',
    },
    {
      label: 'Total Clients',
      value: data.totalClients,
      change: 8,
      icon: '👥',
      color: '#8B5CF6',
      bg: '#F5F3FF',
    },
    {
      label: 'Completion Rate',
      value: data.totalTasks > 0
        ? `${Math.round((data.completedTasks / data.totalTasks) * 100)}%`
        : '0%',
      change: 5,
      icon: '✅',
      color: '#E8652D',
      bg: '#FFF3ED',
    },
  ];

  const maxRevenue = Math.max(...data.monthlyRevenue.map((m) => m.revenue));

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here&apos;s your agency overview.</p>
        </div>
        <Link href="/dashboard/projects" className="btn btn-primary">
          + New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="card stat-card">
            <div
              className="stat-icon"
              style={{ background: stat.bg, color: stat.color, fontSize: '1.5rem' }}
            >
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-change stat-change-up`}>
                ↑ {stat.change}% from last month
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Revenue Chart */}
        <div className="card chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Revenue Overview</h3>
            <span className="badge" style={{ background: '#ECFDF5', color: '#10B981' }}>
              Last 6 months
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200 }}>
            {data.monthlyRevenue.map((month) => (
              <div
                key={month.month}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${(month.revenue / maxRevenue) * 160}px`,
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                    transition: 'height 0.5s ease',
                    minHeight: 4,
                  }}
                />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                  {month.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <div className="chart-header">
            <h3 className="chart-title">Recent Activity</h3>
          </div>
          <div className="timeline">
            {data.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-time">{timeAgo(activity.createdAt, 'en')}</div>
                  <div className="timeline-title">{activity.detail}</div>
                  <div className="timeline-desc">
                    <Link href={`/dashboard/projects/${activity.project.id}`}>
                      {activity.project.title}
                    </Link>{' '}
                    · {activity.user.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Pipeline */}
      <div className="card" style={{ padding: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
        <div className="chart-header">
          <h3 className="chart-title">Project Pipeline</h3>
          <Link href="/dashboard/projects" className="btn btn-ghost btn-sm">
            View All →
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', overflowX: 'auto', padding: 'var(--space-xs) 0' }}>
          {(Object.keys(PROJECT_STATUS_CONFIG) as ProjectStatus[]).filter(s => s !== 'CANCELLED').map((status) => {
            const config = PROJECT_STATUS_CONFIG[status];
            return (
              <div
                key={status}
                style={{
                  flex: '1 0 180px',
                  background: config.bg,
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-md)',
                  textAlign: 'center',
                  border: `1px solid ${config.color}20`,
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: config.color }}>
                  {data.totalProjects > 0 ? (
                    (() => {
                      const found = (data as AnalyticsData & { projectCounts?: Array<{ status: string; _count: number }> })
                        .projectCounts?.find((pc: { status: string }) => pc.status === status);
                      return found ? found._count : 0;
                    })()
                  ) : 0}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: config.color }}>
                  {config.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
