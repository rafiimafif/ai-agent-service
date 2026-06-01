'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { PROJECT_STATUS_CONFIG } from '@/types';
import type { ProjectStatus } from '@/types';

interface SessionUser {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export default function PortalPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    // Fetch session and then projects
    async function loadData() {
      try {
        // Get session
        const sessionRes = await fetch('/api/auth/session');
        let currentUser: SessionUser | null = null;
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData.user) {
            currentUser = sessionData.user;
            setUser(currentUser);
          }
        }

        // Fetch projects
        const projectsRes = await fetch('/api/projects');
        if (projectsRes.ok) {
          const allProjects = await projectsRes.json();
          // Filter by logged-in user's email, or show all for admin
          if (currentUser && currentUser.role === 'CLIENT') {
            setProjects(allProjects.filter((p: any) => p.client.email === currentUser!.email));
          } else {
            setProjects(allProjects);
          }
        }
      } catch (error) {
        console.error('Failed to load portal data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Client Portal</h1>
            <p className="page-subtitle">Loading your projects...</p>
          </div>
        </div>
        <div className="stats-grid">
          {[1, 2].map((i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-lg)' }}>
              <div className="skeleton" style={{ width: '60%', height: 24, marginBottom: 12 }} />
              <div className="skeleton" style={{ width: '80%', height: 14, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: '40%', height: 14 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Client Portal</h1>
          <p className="page-subtitle">
            {user ? `Welcome, ${user.name}! ` : ''}Track your projects and submit new briefs.
          </p>
        </div>
        <Link href="/portal/submit-brief" className="btn btn-primary">
          + Submit New Brief
        </Link>
      </div>

      <div className="project-grid">
        {projects.map((project) => {
          const statusConfig = PROJECT_STATUS_CONFIG[project.status as ProjectStatus];
          const progress = project.tasks.length > 0 
            ? Math.round(project.tasks.reduce((acc: number, t: any) => acc + t.progress, 0) / project.tasks.length)
            : 0;

          return (
            <Link key={project.id} href={`/portal/projects/${project.id}`}>
              <div className="card project-card card-interactive">
                <div className="card-body">
                  <div className="project-card-header">
                    <span className="badge" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-secondary">{timeAgo(project.updatedAt)}</span>
                  </div>
                  <h3 className="project-card-title">{project.title}</h3>
                  <p className="project-card-desc">{project.description}</p>
                  
                  <div className="mt-md">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="text-xs font-semibold">Progress</span>
                      <span className="text-xs font-bold">{progress}%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="project-card-meta">
                    <div className="project-card-meta-item">
                      💰 {formatCurrency(project.budget, 'id')}
                    </div>
                    <div className="project-card-meta-item">
                      🤖 {project.tasks.length} Agent Tasks
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {projects.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🚀</div>
          <h3 className="empty-state-title">No projects yet</h3>
          <p className="empty-state-desc">Ready to start your AI-powered journey? Submit a brief to get started.</p>
          <Link href="/portal/submit-brief" className="btn btn-primary mt-sm">
            Submit New Brief
          </Link>
        </div>
      )}
    </div>
  );
}

