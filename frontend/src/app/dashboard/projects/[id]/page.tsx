'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';
import { PROJECT_STATUS_CONFIG, AGENT_INFO } from '@/types';
import type { ProjectStatus, AgentType, TaskStatus } from '@/types';

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
  client: { id: string; name: string; email: string };
  brief: {
    requirements: string[];
    deliverables: string[];
    dataSources: string[];
    notes: string;
    status: string;
  } | null;
  tasks: Array<{
    id: string;
    agentType: AgentType;
    title: string;
    description: string;
    status: TaskStatus;
    progress: number;
    startedAt: string | null;
    completedAt: string | null;
    feedback?: string | null;
    output?: string | null;
  }>;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    amount: number;
    total: number;
    status: string;
    dueDate: string;
  }>;
  activityLogs: Array<{
    id: string;
    action: string;
    detail: string;
    createdAt: string;
    user: { name: string };
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'brief' | 'invoices' | 'activity'>('tasks');
  const [accepting, setAccepting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchProject = () => {
    if (params.id) {
      fetch(`/api/projects/${params.id}`)
        .then((res) => res.json())
        .then(setProject)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  const reloadProjectData = async () => {
    if (params.id) {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  useEffect(() => {
    if (!project) return;
    
    // Check if there is any active task currently in progress
    const hasActiveTask = project.tasks.some(task => task.status === 'IN_PROGRESS');
    
    if (hasActiveTask) {
      const interval = setInterval(() => {
        reloadProjectData();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [project?.tasks]);

  const handleDeleteProject = async () => {
    if (!project) return;
    if (!window.confirm('Are you sure you want to completely delete this project? This action cannot be undone.')) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      router.push('/dashboard/projects');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete project');
      setDeleting(false);
    }
  };
  const handleAcceptBrief = async () => {
    if (!project) return;
    setAccepting(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'ACCEPT_BRIEF' }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to accept brief');
      }

      await reloadProjectData();
      setActiveTab('tasks');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Something went wrong. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const [taskInputs, setTaskInputs] = useState<Record<string, { output: string; feedback: string }>>({});

  const handleTaskAction = async (taskId: string, status: string) => {
    if (!project) return;
    try {
      const input = taskInputs[taskId] || { output: '', feedback: '' };
      const res = await fetch(`/api/projects/${project.id}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, output: input.output, feedback: input.feedback })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update task');
      }
      await reloadProjectData();
      
      // Clear inputs for this task
      setTaskInputs(prev => ({ ...prev, [taskId]: { output: '', feedback: '' } }));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update task');
    }
  };

  const handleInputChange = (taskId: string, field: 'output' | 'feedback', value: string) => {
    setTaskInputs(prev => ({
      ...prev,
      [taskId]: { ...(prev[taskId] || { output: '', feedback: '' }), [field]: value }
    }));
  };

  if (loading) {
    return (
      <div className="fade-in">
        <div className="skeleton" style={{ width: '40%', height: 32, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 24 }} />
        <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: 'var(--radius-xl)' }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-title">Project not found</div>
        <Link href="/dashboard/projects" className="btn btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  const statusConfig = PROJECT_STATUS_CONFIG[project.status];
  const overallProgress = project.tasks.length > 0
    ? Math.round(project.tasks.reduce((sum, t) => sum + t.progress, 0) / project.tasks.length)
    : 0;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-md mb-sm">
            <Link href="/dashboard/projects" className="btn btn-ghost btn-sm">← Back</Link>
            <span className="badge badge-dot" style={{ background: statusConfig.bg, color: statusConfig.color }}>
              {statusConfig.label}
            </span>
          </div>
          <h1 className="page-title">{project.title}</h1>
          <p className="page-subtitle">{project.description}</p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <button 
            className="btn btn-secondary" 
            style={{ color: '#EF4444', borderColor: '#FECACA', background: '#FEF2F2', padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 600 }}
            onClick={handleDeleteProject}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : '🗑️ Delete Project'}
          </button>
        </div>
      </div>

      {project.status === 'BRIEFED' && (
        <div 
          className="card card-body fade-in" 
          style={{ 
            background: 'linear-gradient(135deg, var(--primary-light) 0%, #FFFDFB 100%)',
            border: '1.5px solid var(--primary)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: 'var(--space-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-md)',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 4 }}>
              <span style={{ fontSize: '1.25rem' }}>⚡</span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>New Brief Submitted</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Review the client's requirements under the **Brief** tab, then deploy the autonomous AI agent team to start work.
            </p>
          </div>
          <button 
            className="btn btn-primary"
            style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 600 }}
            onClick={handleAcceptBrief}
            disabled={accepting}
          >
            {accepting ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Deploying AI Agents...
                <style>{`
                  @keyframes spin {
                    to { transform: rotate(360deg); }
                  }
                `}</style>
              </span>
            ) : (
              '🚀 Accept Brief & Deploy Agents'
            )}
          </button>
        </div>
      )}

      {/* Meta Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#EFF6FF', fontSize: '1.5rem' }}>👤</div>
          <div className="stat-content">
            <div style={{ fontWeight: 700 }}>{project.client.name}</div>
            <div className="stat-label">{project.client.email}</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#ECFDF5', fontSize: '1.5rem' }}>💰</div>
          <div className="stat-content">
            <div style={{ fontWeight: 700 }}>{formatCurrency(project.budget, 'id')}</div>
            <div className="stat-label">Budget</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#FFF3ED', fontSize: '1.5rem' }}>📅</div>
          <div className="stat-content">
            <div style={{ fontWeight: 700 }}>{project.deadline ? formatDate(project.deadline, 'en') : 'No deadline'}</div>
            <div className="stat-label">Deadline</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: '#F5F3FF', fontSize: '1.5rem' }}>📊</div>
          <div className="stat-content">
            <div style={{ fontWeight: 700 }}>{overallProgress}%</div>
            <div className="stat-label">Overall Progress</div>
            <div className="progress mt-sm">
              <div className="progress-bar" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-sm mb-lg">
        {(['tasks', 'brief', 'invoices', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'tasks' && `🤖 Agent Tasks (${project.tasks.length})`}
            {tab === 'brief' && '📋 Brief'}
            {tab === 'invoices' && `💰 Invoices (${project.invoices.length})`}
            {tab === 'activity' && `📝 Activity (${project.activityLogs.length})`}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' && (
        <div className="flex flex-col gap-md">
          {project.tasks.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-state-icon">🤖</div>
              <div className="empty-state-title">No agent tasks yet</div>
              <div className="empty-state-desc">Tasks will appear once the brief is accepted.</div>
            </div>
          ) : (
            project.tasks.map((task, index) => {
              const agent = AGENT_INFO[task.agentType];
              const prevTask = index > 0 ? project.tasks[index - 1] : null;
              const canStart = !prevTask || prevTask.status === 'COMPLETED';
              
              return (
                <div key={task.id} className="card card-body">
                  <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-lg)',
                        background: `${agent.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                      }}
                    >
                      {agent.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{task.title}</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {agent.name} · {task.description}
                      </div>
                    </div>
                    <span
                      className="badge badge-dot"
                      style={{
                        background: task.status === 'COMPLETED' ? '#ECFDF5' : task.status === 'REVIEW' ? '#F5F3FF' : task.status === 'IN_PROGRESS' ? '#FFFBEB' : '#F3F4F6',
                        color: task.status === 'COMPLETED' ? '#10B981' : task.status === 'REVIEW' ? '#8B5CF6' : task.status === 'IN_PROGRESS' ? '#F59E0B' : '#6B7280',
                      }}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Manual Flow UI */}
                  <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-light)' }}>
                    
                    {task.status === 'PENDING' && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        disabled={!canStart}
                        onClick={() => handleTaskAction(task.id, 'IN_PROGRESS')}
                      >
                        {canStart ? '▶ Start Task' : '🔒 Waiting for previous task'}
                      </button>
                    )}

                    {task.status === 'IN_PROGRESS' && (
                      <div className="flex flex-col gap-sm">
                        {task.feedback && (
                          <div style={{ padding: 'var(--space-sm)', background: '#FEF2F2', color: '#EF4444', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                            <strong>QA Rejected:</strong> {task.feedback}
                          </div>
                        )}
                        <textarea 
                          className="input" 
                          rows={3} 
                          placeholder="Enter output (e.g., GitHub link, research text, etc.)"
                          value={taskInputs[task.id]?.output ?? task.output ?? ''}
                          onChange={(e) => handleInputChange(task.id, 'output', e.target.value)}
                        />
                        <button 
                          className="btn btn-primary btn-sm"
                          style={{ alignSelf: 'flex-start' }}
                          onClick={() => handleTaskAction(task.id, 'REVIEW')}
                        >
                          Submit for Review
                        </button>
                      </div>
                    )}

                    {task.status === 'REVIEW' && (
                      <div className="flex flex-col gap-sm">
                        <div style={{ padding: 'var(--space-md)', background: '#F9FAFB', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', border: '1px solid var(--border-light)' }}>
                          <strong>Output Submitted:</strong>
                          <p style={{ marginTop: 'var(--space-xs)', whiteSpace: 'pre-wrap' }}>{task.output}</p>
                        </div>
                        <div className="flex gap-sm">
                          <button className="btn btn-primary btn-sm" onClick={() => handleTaskAction(task.id, 'COMPLETED')}>
                            ✅ Approve
                          </button>
                          <div className="flex gap-xs flex-1">
                            <input 
                              type="text" 
                              className="input" 
                              style={{ flex: 1, padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} 
                              placeholder="Reason for rejection..."
                              value={taskInputs[task.id]?.feedback ?? ''}
                              onChange={(e) => handleInputChange(task.id, 'feedback', e.target.value)}
                            />
                            <button className="btn btn-secondary btn-sm" onClick={() => handleTaskAction(task.id, 'IN_PROGRESS')}>
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {task.status === 'COMPLETED' && (
                      <div style={{ padding: 'var(--space-md)', background: '#ECFDF5', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', border: '1px solid #D1FAE5' }}>
                        <strong style={{ color: '#065F46' }}>Approved Output:</strong>
                        <p style={{ marginTop: 'var(--space-xs)', whiteSpace: 'pre-wrap', color: '#047857' }}>{task.output}</p>
                      </div>
                    )}

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'brief' && project.brief && (
        <div className="card card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <h3 style={{ margin: 0 }}>Project Brief</h3>
            {project.status === 'BRIEFED' && (
              <button 
                className="btn btn-primary"
                onClick={handleAcceptBrief}
                disabled={accepting}
                style={{ fontSize: '0.8125rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {accepting ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Deploying...
                  </span>
                ) : (
                  '🚀 Accept & Deploy'
                )}
              </button>
            )}
          </div>
          <div className="grid grid-2 gap-lg">
            <div>
              <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requirements</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {project.brief.requirements.map((req: string, i: number) => (
                  <li key={i} style={{ fontSize: '0.9375rem' }}>✅ {req}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deliverables</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {project.brief.deliverables.map((del: string, i: number) => (
                  <li key={i} style={{ fontSize: '0.9375rem' }}>📦 {del}</li>
                ))}
              </ul>
            </div>
          </div>
          {project.brief.notes && (
            <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--surface)', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ marginBottom: 'var(--space-xs)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Notes</h4>
              <p style={{ fontSize: '0.9375rem' }}>{project.brief.notes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Amount</th>
                <th>Total</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {project.invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600 }}>{inv.invoiceNumber}</td>
                  <td>{formatCurrency(inv.amount, 'id')}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(inv.total, 'id')}</td>
                  <td>
                    <span className="badge badge-dot" style={{
                      background: inv.status === 'PAID' ? '#ECFDF5' : inv.status === 'SENT' ? '#EFF6FF' : '#F3F4F6',
                      color: inv.status === 'PAID' ? '#10B981' : inv.status === 'SENT' ? '#3B82F6' : '#6B7280',
                    }}>
                      {inv.status}
                    </span>
                  </td>
                  <td>{formatDate(inv.dueDate, 'en')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <div className="timeline">
            {project.activityLogs.map((log) => (
              <div key={log.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-time">{timeAgo(log.createdAt, 'en')}</div>
                  <div className="timeline-title">{log.detail}</div>
                  <div className="timeline-desc">by {log.user.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
