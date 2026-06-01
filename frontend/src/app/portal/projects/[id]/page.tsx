'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PROJECT_STATUS_CONFIG, AGENT_INFO } from '@/types';
import type { ProjectStatus, AgentType } from '@/types';

export default function PortalProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState('');
  const [forceShowRetry, setForceShowRetry] = useState(false);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Failed to fetch project detail:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const reloadProjectData = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      }
    } catch (err) {
      console.error('Failed to refresh project detail:', err);
    }
  };

  const handlePayInvoice = (invoiceId: string) => {
    router.push(`/portal/pay/${invoiceId}`);
  };

  const handleRetryPush = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRetrying(true);
    setRetryError('');
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/projects/${id}/retry-github-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubRepo: formData.get('githubRepo'),
          githubToken: formData.get('githubToken')
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Retry failed');
      
      // Reload project to get updated logs showing success
      await fetchProject();
    } catch (err: any) {
      setRetryError(err.message);
    } finally {
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  useEffect(() => {
    if (!project) return;
    
    // Check if there is any active task currently in progress
    const hasActiveTask = project.tasks.some((task: any) => task.status === 'IN_PROGRESS');
    
    if (hasActiveTask) {
      const interval = setInterval(() => {
        reloadProjectData();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [project?.tasks]);

  if (loading) {
    return (
      <div className="fade-in" style={{ padding: 'var(--space-lg)' }}>
        <div className="skeleton" style={{ width: '40%', height: 32, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 24 }} />
        <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: 'var(--radius-xl)' }} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-title">Project not found</div>
        <Link href="/portal" className="btn btn-primary">
          Back to Portal
        </Link>
      </div>
    );
  }

  const statusConfig = PROJECT_STATUS_CONFIG[project.status as ProjectStatus];
  
  // Calculate overall progress
  const progress = project.tasks.length > 0 
    ? Math.round(project.tasks.reduce((acc: number, t: any) => acc + t.progress, 0) / project.tasks.length)
    : 0;

  return (
    <div className="fade-in">
      <div className="topbar-breadcrumb" style={{ marginBottom: 'var(--space-lg)' }}>
        <Link href="/portal">← Back to Portal</Link>
      </div>

      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xs)' }}>
            <h1 className="page-title">{project.title}</h1>
            <span className="badge" style={{ background: statusConfig.bg, color: statusConfig.color }}>
              {statusConfig.label}
            </span>
          </div>
          <p className="page-subtitle">{project.description}</p>
        </div>
      </div>

      {project.status === 'COMPLETED' && (() => {
        const allPaid = project.invoices.length > 0 && project.invoices.every((inv: any) => inv.status === 'PAID');
        const hasUnpaid = project.invoices.some((inv: any) => inv.status !== 'PAID');
        
        const pushLogs = project.activityLogs?.filter((log: any) => log.action.startsWith('GITHUB_PUSH_')) || [];
        const latestPushLog = pushLogs.length > 0 ? pushLogs[0] : null;
        const pushFailed = latestPushLog?.action === 'GITHUB_PUSH_FAILED';
        const showRetryForm = pushFailed || forceShowRetry;

        return allPaid ? (
          <>
            <div className="all-paid-banner fade-in">
              <div>
                <h3 style={{ color: '#065F46', margin: '0 0 8px 0', fontSize: '1.125rem', fontWeight: 700 }}>🎉 All Payments Complete — Full Access Granted!</h3>
                <p style={{ color: '#047857', margin: 0, fontSize: '0.9375rem', lineHeight: 1.5 }}>
                  All invoices have been paid. You now have full access to your source code, deliverables, and deployment resources. Thank you for your business!
                </p>
              </div>
              <div style={{ fontSize: '2.5rem' }}>🏆</div>
            </div>

            {/* Deliverables Section */}
            <div className="card fade-in" style={{ padding: 'var(--space-2xl)', marginBottom: 'var(--space-xl)', border: '2px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--space-xs)' }}>Project Deliverables</h2>
                  <p className="text-secondary">Your project is fully paid. Here are your final deliverables and access links.</p>
                </div>
                <div style={{ fontSize: '2.5rem' }}>📦</div>
              </div>

                      <div className="dashboard-grid">
                        {/* Source Code */}
                        <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--surface)' }}>
                          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>💾</div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>Source Code</h3>
                          <p className="text-sm text-secondary mb-md">Download the complete source code archive for your project.</p>
                          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => alert('Simulating download of source_code.zip...')}>
                            ⬇️ Download .zip
                          </button>
                        </div>

                        {/* GitHub Repo */}
                        <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--surface)', gridColumn: showRetryForm ? '1 / -1' : 'auto' }}>
                          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🐙</div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>GitHub Repository</h3>
                          
                          {showRetryForm ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                              <div style={{ background: '#FEF2F2', border: '1px solid #F87171', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{ fontSize: '1.25rem' }}>⚠️</div>
                                <div>
                                  <div style={{ color: '#B91C1C', fontWeight: 600, marginBottom: '4px' }}>Automated Push Failed</div>
                                  <p style={{ color: '#991B1B', fontSize: '0.875rem', margin: 0, lineHeight: 1.4 }}>
                                    {latestPushLog?.detail || 'We could not push the code to your repository. Please check your token and URL.'}
                                  </p>
                                </div>
                              </div>
                              
                              <form onSubmit={handleRetryPush} style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Update Credentials & Retry</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                  <div>
                                    <label className="text-sm font-semibold mb-xs" style={{ display: 'block', color: 'var(--text)' }}>Repository URL</label>
                                    <input name="githubRepo" defaultValue={project.brief?.githubRepo} className="form-input" style={{ width: '100%', background: 'var(--surface)' }} placeholder="e.g., https://github.com/username/repo" required />
                                  </div>
                                  <div>
                                    <label className="text-sm font-semibold mb-xs" style={{ display: 'block', color: 'var(--text)' }}>Personal Access Token (PAT)</label>
                                    <input name="githubToken" type="password" placeholder="ghp_..." className="form-input" style={{ width: '100%', background: 'var(--surface)' }} required />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '6px' }}>Needs "repo" scope to push code.</p>
                                  </div>
                                  {retryError && (
                                    <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', border: '1px solid #F87171' }}>
                                      {retryError}
                                    </div>
                                  )}
                                  <div style={{ marginTop: 'var(--space-xs)' }}>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={retrying}>
                                      {retrying ? '🔄 Retrying...' : '🚀 Update & Retry Push'}
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                              <p className="text-sm text-secondary mb-md">Your codebase has been successfully provisioned and pushed to your GitHub repository.</p>
                              
                              <a 
                                href={project.brief?.githubRepo} 
                                target="_blank" 
                                rel="noreferrer"
                                className="btn btn-primary" 
                                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                              >
                                Open Repository ↗
                              </a>
                              
                              <button 
                                onClick={() => setForceShowRetry(true)}
                                className="btn btn-secondary" 
                                style={{ width: '100%', textAlign: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid var(--border)' }}
                              >
                                ⚙️ Redeploy Codebase
                              </button>
                            </div>
                          )}
                        </div>

                {/* Live Deployment */}
                <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--surface)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🌐</div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>Live Deployment</h3>
                  <p className="text-sm text-secondary mb-md">View the live staging/production deployment of your app.</p>
                  <a href={`https://${project.title.toLowerCase().split(' ').join('-')}.example.com`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    View Live Site ↗
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="fade-in" style={{ 
            background: '#ECFDF5', 
            border: '1px solid #10B981', 
            padding: 'var(--space-lg)', 
            borderRadius: 'var(--radius-lg)', 
            marginBottom: 'var(--space-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <h3 style={{ color: '#065F46', margin: '0 0 8px 0', fontSize: '1.125rem', fontWeight: 700 }}>🎉 Project Successfully Completed!</h3>
              <p style={{ color: '#047857', margin: 0, fontSize: '0.9375rem', lineHeight: 1.5 }}>
                All AI agents have finished their tasks. Your final deliverables have been prepared. 
                {hasUnpaid ? ' Please pay the outstanding invoices to unlock full access to your source code and deployment.' : ''}
              </p>
            </div>
            <div style={{ fontSize: '2.5rem' }}>🚀</div>
          </div>
        );
      })()}

      <div className="dashboard-grid">
        {/* Left Column: Progress & Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          
          <div className="card" style={{ padding: 'var(--space-xl)' }}>
            <h3 className="font-bold mb-md">Overall Progress</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="text-secondary text-sm">Project Completion</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="progress mb-md">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            {project.deadline && (
              <div className="text-sm text-secondary">
                Target Deadline: {formatDate(project.deadline)}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 'var(--space-xl)' }}>
            <h3 className="font-bold mb-lg">AI Agent Workstream</h3>
            
            <div className="timeline">
              {project.tasks.map((task: any) => {
                const agentInfo = AGENT_INFO[task.agentType as AgentType];
                const isCompleted = task.status === 'COMPLETED';
                const isActive = task.status === 'IN_PROGRESS';
                const isReview = task.status === 'REVIEW';

                let badgeText = '';
                let badgeStyle = {};
                if (isActive) {
                  badgeText = `Working (${task.progress}%)`;
                  badgeStyle = { background: 'var(--warning-light)', color: 'var(--warning)' };
                } else if (isReview) {
                  badgeText = 'Reviewing Deliverables';
                  badgeStyle = { background: 'var(--primary-light)', color: 'var(--primary)' };
                } else if (isCompleted) {
                  badgeText = 'Done';
                  badgeStyle = { background: 'var(--success-light)', color: 'var(--success)' };
                }

                return (
                  <div key={task.id} className="timeline-item">
                    <div 
                      className={`timeline-dot ${isCompleted ? 'timeline-dot-completed' : ''}`} 
                      style={
                        isActive 
                          ? { borderColor: 'var(--warning)', background: 'var(--warning-light)' } 
                          : isReview 
                          ? { borderColor: 'var(--primary)', background: 'var(--primary-light)' }
                          : {}
                      } 
                    />
                    <div className="timeline-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div className="font-bold text-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {agentInfo.icon} {agentInfo.name}
                        </div>
                        {badgeText && <span className={`badge ${isActive ? 'pulse' : ''}`} style={badgeStyle}>{badgeText}</span>}
                      </div>
                      <div className="font-semibold">{task.title}</div>
                      <div className="text-sm text-secondary mt-xs">{task.description}</div>
                      
                      {/* Show output if completed or review */}
                      {(isCompleted || isReview) && task.output && (
                        <div style={{
                          marginTop: 'var(--space-md)',
                          padding: 'var(--space-md)',
                          background: isCompleted ? '#ECFDF5' : '#F9FAFB',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8125rem',
                          border: isCompleted ? '1px solid #D1FAE5' : '1px solid var(--border-light)',
                          color: isCompleted ? '#065F46' : 'var(--text-primary)',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'monospace'
                        }}>
                          {task.output}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {project.tasks.length === 0 && (
                <div className="text-center text-secondary text-sm py-md">
                  No AI agents assigned yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Meta & Invoices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          
          <div className="card" style={{ padding: 'var(--space-lg)' }}>
            <h3 className="font-bold mb-md">Project Details</h3>
            
            <div className="mb-md">
              <div className="text-xs text-secondary mb-xs">Budget</div>
              <div className="font-bold">{formatCurrency(project.budget, 'id')}</div>
            </div>
            
            <div className="mb-md">
              <div className="text-xs text-secondary mb-xs">Created On</div>
              <div className="font-semibold">{formatDate(project.createdAt)}</div>
            </div>

            {project.brief && (
              <div>
                <div className="text-xs text-secondary mb-xs">Brief Status</div>
                <div className="badge" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                  {project.brief.status}
                </div>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 'var(--space-lg)' }}>
            <h3 className="font-bold mb-md">Invoices</h3>
            
            {project.invoices.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {project.invoices.map((inv: any) => {
                  const isSent = inv.status === 'SENT';
                  const isPaid = inv.status === 'PAID';

                  return (
                    <div 
                      key={inv.id} 
                      style={{ 
                        padding: 'var(--space-md)', 
                        border: '1px solid var(--border-light)', 
                        borderRadius: 'var(--radius-md)', 
                        background: isPaid ? '#ECFDF5' : '#fff',
                        borderColor: isPaid ? '#D1FAE5' : 'var(--border-light)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isPaid ? 8 : 0 }}>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: isPaid ? '#065F46' : 'var(--text-primary)' }}>{inv.invoiceNumber}</div>
                          <div className="text-xs text-secondary">{formatCurrency(inv.total, 'id')}</div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                          {isSent && (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ 
                                padding: '6px 14px', 
                                fontSize: '0.75rem', 
                                fontWeight: 600, 
                                background: '#10B981', 
                                borderColor: '#10B981',
                                cursor: 'pointer'
                              }}
                              onClick={() => handlePayInvoice(inv.id)}
                            >
                              💳 Pay Now
                            </button>
                          )}
                          
                          <span 
                            className="badge text-xs" 
                            style={{ 
                              background: isPaid ? 'var(--success-light)' : 'var(--surface)', 
                              color: isPaid ? 'var(--success)' : 'var(--text-secondary)' 
                            }}
                          >
                            {inv.status}
                          </span>
                        </div>
                      </div>

                      {isPaid && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #D1FAE5' }}>
                          <span className="text-xs text-secondary">
                            Paid {inv.paidAt ? formatDate(inv.paidAt) : ''}
                            {inv.paymentMethod && ` via ${inv.paymentMethod === 'CREDIT_CARD' ? 'Credit Card' : inv.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : inv.paymentMethod === 'E_WALLET' ? 'E-Wallet' : inv.paymentMethod}`}
                          </span>
                          <Link 
                            href={`/portal/receipt/${inv.id}`}
                            className="text-xs font-semibold"
                            style={{ color: 'var(--primary)' }}
                          >
                            View Receipt →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-secondary">No invoices issued yet.</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
