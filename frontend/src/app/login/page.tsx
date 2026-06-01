'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        router.push('/dashboard');
      } else {
        router.push('/portal');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <div style={{
            width: 56,
            height: 56,
            background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto',
          }}>
            ⚡
          </div>
        </div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your AgentFlow account</p>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: 'var(--space-md)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            id="login-button"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
          <strong>Demo Accounts:</strong>
        </div>
        <div className="flex gap-sm" style={{ flexDirection: 'column' }}>
          <button
            className="btn btn-secondary btn-sm w-full"
            onClick={() => { setEmail('admin@agentflow.com'); setPassword('password123'); }}
            type="button"
            id="demo-admin-button"
          >
            🔑 Admin: admin@agentflow.com
          </button>
          <button
            className="btn btn-secondary btn-sm w-full"
            onClick={() => { setEmail('client@example.com'); setPassword('password123'); }}
            type="button"
            id="demo-client-button"
          >
            🔑 Client: client@example.com
          </button>
        </div>

        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link href="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
