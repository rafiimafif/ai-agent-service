'use client';

import { useEffect, useState } from 'react';
import { AGENT_INFO } from '@/types';
import type { AgentType } from '@/types';

const agentTypes: AgentType[] = ['RISET', 'CODING', 'AUTOMASI', 'KONTEN', 'SUPPORT'];

interface TaskData {
  agentType: AgentType;
  title: string;
  status: string;
  progress: number;
  projectTitle?: string;
}

export default function AgentsPage() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all projects to get tasks
    fetch('/api/projects')
      .then((res) => res.json())
      .then((projects: Array<{ title: string; tasks: Array<{ agentType: AgentType; title: string; status: string; progress: number }> }>) => {
        const allTasks: TaskData[] = [];
        projects.forEach((p) => {
          p.tasks?.forEach((t) => {
            allTasks.push({ ...t, projectTitle: p.title });
          });
        });
        setTasks(allTasks);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Agent Team</h1>
          <p className="page-subtitle">Monitor your AI agents and their current workloads.</p>
        </div>
      </div>

      {loading ? (
        <div className="agents-grid">
          {agentTypes.map((type) => (
            <div key={type} className="card">
              <div className="skeleton" style={{ height: 4, width: '100%' }} />
              <div className="agent-card-body">
                <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', marginBottom: 12 }} />
                <div className="skeleton" style={{ width: '60%', height: 20, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: 16 }} />
                <div className="skeleton" style={{ width: '100%', height: 50, borderRadius: 'var(--radius-md)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="agents-grid">
          {agentTypes.map((type) => {
            const agent = AGENT_INFO[type];
            const agentTasks = tasks.filter((t) => t.agentType === type);
            const completedCount = agentTasks.filter((t) => t.status === 'COMPLETED').length;
            const activeCount = agentTasks.filter((t) => t.status === 'IN_PROGRESS').length;
            const pendingCount = agentTasks.filter((t) => t.status === 'PENDING').length;
            const avgProgress = agentTasks.length > 0
              ? Math.round(agentTasks.reduce((sum, t) => sum + t.progress, 0) / agentTasks.length)
              : 0;

            const statusLabel = activeCount > 0 ? 'Working' : pendingCount > 0 ? 'Queued' : completedCount > 0 ? 'Idle' : 'Available';
            const statusColor = activeCount > 0 ? '#F59E0B' : pendingCount > 0 ? '#3B82F6' : '#10B981';

            return (
              <div key={type} className="card agent-card card-interactive">
                <div className="agent-card-gradient" style={{ background: agent.gradient }} />
                <div className="agent-card-body">
                  <div className="agent-card-header">
                    <div
                      className="agent-card-icon"
                      style={{ background: `${agent.color}15` }}
                    >
                      {agent.icon}
                    </div>
                    <div>
                      <div className="agent-card-name">{agent.name}</div>
                      <div className="agent-card-type">{agent.nameId}</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>
                    {agent.description}
                  </p>

                  {/* Status Badge */}
                  <div className="flex items-center gap-sm mb-md">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor }} className={activeCount > 0 ? 'pulse' : ''} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: statusColor }}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="agent-card-stats">
                    <div className="agent-stat">
                      <div className="agent-stat-value" style={{ color: '#F59E0B' }}>{activeCount}</div>
                      <div className="agent-stat-label">Active</div>
                    </div>
                    <div className="agent-stat">
                      <div className="agent-stat-value" style={{ color: '#10B981' }}>{completedCount}</div>
                      <div className="agent-stat-label">Done</div>
                    </div>
                    <div className="agent-stat">
                      <div className="agent-stat-value" style={{ color: '#6B7280' }}>{pendingCount}</div>
                      <div className="agent-stat-label">Pending</div>
                    </div>
                    <div className="agent-stat">
                      <div className="agent-stat-value" style={{ color: agent.color }}>{avgProgress}%</div>
                      <div className="agent-stat-label">Avg</div>
                    </div>
                  </div>

                  {/* Current Tasks */}
                  {agentTasks.filter((t) => t.status !== 'COMPLETED').length > 0 && (
                    <div style={{ marginTop: 'var(--space-md)' }}>
                      <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 'var(--space-xs)' }}>
                        Current Tasks
                      </div>
                      {agentTasks
                        .filter((t) => t.status !== 'COMPLETED')
                        .slice(0, 2)
                        .map((task, i) => (
                          <div
                            key={i}
                            style={{
                              padding: '8px 10px',
                              background: 'var(--surface)',
                              borderRadius: 'var(--radius-md)',
                              marginBottom: 4,
                              fontSize: '0.8125rem',
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <span className="truncate-text" style={{ flex: 1 }}>{task.title}</span>
                              <span style={{ fontWeight: 600, fontSize: '0.75rem', color: agent.color, flexShrink: 0, marginLeft: 8 }}>
                                {task.progress}%
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
