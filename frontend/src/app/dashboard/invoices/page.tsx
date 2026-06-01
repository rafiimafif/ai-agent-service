'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { INVOICE_STATUS_CONFIG } from '@/types';
import type { InvoiceStatus } from '@/types';

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt: string | null;
  notes: string | null;
  project: { id: string; title: string };
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all projects to get invoices
    fetch('/api/projects')
      .then((res) => res.json())
      .then((projects: Array<{ id: string; title: string; invoices: Array<Omit<InvoiceData, 'project'>> }>) => {
        const allInvoices: InvoiceData[] = [];
        projects.forEach((p) => {
          p.invoices?.forEach((inv) => {
            allInvoices.push({ ...inv, project: { id: p.id, title: p.title } });
          });
        });
        allInvoices.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        setInvoices(allInvoices);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPaid = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((sum, i) => sum + i.total, 0);
  const totalPending = invoices
    .filter((i) => i.status === 'SENT')
    .reduce((sum, i) => sum + i.total, 0);
  const totalDraft = invoices
    .filter((i) => i.status === 'DRAFT')
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-subtitle">Track all invoice payments and billing status.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="invoice-summary">
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 }}>
            Total Paid
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
            {formatCurrency(totalPaid, 'id')}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 }}>
            Pending Payment
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--info)' }}>
            {formatCurrency(totalPending, 'id')}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 }}>
            Draft
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
            {formatCurrency(totalDraft, 'id')}
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      {loading ? (
        <div className="card card-body">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ width: '100%', height: 48, marginBottom: 8, borderRadius: 'var(--radius-md)' }} />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">💰</div>
          <div className="empty-state-title">No invoices yet</div>
          <div className="empty-state-desc">Invoices will appear when projects are created.</div>
        </div>
      ) : (
        <div className="table-container card">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Tax (11%)</th>
                <th>Total</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const config = INVOICE_STATUS_CONFIG[inv.status];
                return (
                  <tr key={inv.id}>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                        {inv.invoiceNumber}
                      </span>
                    </td>
                    <td>
                      <span className="truncate-text" style={{ maxWidth: 200, display: 'inline-block' }}>
                        {inv.project.title}
                      </span>
                    </td>
                    <td>{formatCurrency(inv.amount, 'id')}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatCurrency(inv.tax, 'id')}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(inv.total, 'id')}</td>
                    <td>
                      <span
                        className="badge badge-dot"
                        style={{ background: config.bg, color: config.color }}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td>{formatDate(inv.dueDate, 'en')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
