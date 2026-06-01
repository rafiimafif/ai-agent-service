'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PROJECT_STATUS_CONFIG } from '@/types';
import type { ProjectStatus } from '@/types';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
  client: { name: string };
  _count: { tasks: number; invoices: number };
  tasks: Array<{ progress: number }>;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL'
    ? projects
    : projects.filter((p) => p.status === filter);

  const getProgress = (tasks: Array<{ progress: number }>) => {
    if (tasks.length === 0) return 0;
    return Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage all your client projects in one place.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-sm mb-lg" style={{ overflowX: 'auto' }}>
        <button
          className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setFilter('ALL')}
        >
          All ({projects.length})
        </button>
        {(Object.keys(PROJECT_STATUS_CONFIG) as ProjectStatus[]).map((status) => {
          const count = projects.filter((p) => p.status === status).length;
          const config = PROJECT_STATUS_CONFIG[status];
          return (
            <button
              key={status}
              className={`btn btn-sm`}
              style={
                filter === status
                  ? { background: config.color, color: '#fff' }
                  : { background: config.bg, color: config.color, border: `1px solid ${config.color}30` }
              }
              onClick={() => setFilter(status)}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="project-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card card-body">
              <div className="skeleton" style={{ width: '70%', height: 20, marginBottom: 12 }} />
              <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: '80%', height: 14, marginBottom: 16 }} />
              <div className="skeleton" style={{ width: '100%', height: 8, borderRadius: 99 }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <div className="empty-state-title">No projects found</div>
          <div className="empty-state-desc">
            {filter === 'ALL'
              ? 'Start by creating your first project.'
              : `No projects with status "${PROJECT_STATUS_CONFIG[filter as ProjectStatus]?.label}".`}
          </div>
        </div>
      ) : (
        <div className="project-grid">
          {filtered.map((project) => {
            const config = PROJECT_STATUS_CONFIG[project.status];
            const progress = getProgress(project.tasks);

            return (
              <Link
                href={`/dashboard/projects/${project.id}`}
                key={project.id}
                className="card card-interactive card-body project-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="project-card-header">
                  <div>
                    <div className="project-card-title">{project.title}</div>
                  </div>
                  <span
                    className="badge badge-dot"
                    style={{ background: config.bg, color: config.color }}
                  >
                    {config.label}
                  </span>
                </div>

                <p className="project-card-desc">{project.description}</p>

                {/* Progress */}
                {project.tasks.length > 0 && (
                  <div style={{ marginBottom: 'var(--space-md)' }}>
                    <div className="flex justify-between mb-sm" style={{ fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                      <span style={{ fontWeight: 600 }}>{progress}%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="project-card-meta">
                  <div className="project-card-meta-item">
                    👤 {project.client.name}
                  </div>
                  <div className="project-card-meta-item">
                    💰 {formatCurrency(project.budget, 'id')}
                  </div>
                  {project.deadline && (
                    <div className="project-card-meta-item">
                      📅 {formatDate(project.deadline, 'en')}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
