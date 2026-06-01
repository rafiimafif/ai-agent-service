import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { INVOICE_STATUS_CONFIG } from '@/types';
import type { InvoiceStatus } from '@/types';
import DownloadButton from './DownloadButton';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
  let invoice: any = null;
  try {
    const res = await fetch(`${backendUrl}/api/invoices/${id}`, { cache: 'no-store' });
    if (res.ok) {
      invoice = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch invoice details from backend:', error);
  }

  if (!invoice) {
    notFound();
  }

  const statusConfig = INVOICE_STATUS_CONFIG[invoice.status as InvoiceStatus];

  return (
    <div className="fade-in">
      <div className="topbar-breadcrumb" style={{ marginBottom: 'var(--space-lg)' }}>
        <Link href="/dashboard/invoices">← Back to Invoices</Link>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Invoice {invoice.invoiceNumber}</h1>
          <p className="page-subtitle">Project: {invoice.project.title}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          {/* We pass the invoice data to the client component to render the PDF download link */}
          <DownloadButton invoice={invoice} />
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card dashboard-grid-full" style={{ padding: 'var(--space-2xl)' }}>
          
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
                AgentFlow
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                AI-Powered Service Agency<br />
                Jakarta, Indonesia
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>INVOICE</div>
              <span className="badge" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Invoice Details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>Billed To:</div>
              <div style={{ fontWeight: 600 }}>{invoice.project.client.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{invoice.project.client.email}</div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-xl)' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Issue Date:</div>
                <div style={{ fontWeight: 600 }}>{formatDate(invoice.createdAt)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Due Date:</div>
                <div style={{ fontWeight: 600 }}>{formatDate(invoice.dueDate)}</div>
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <table className="table" style={{ marginBottom: 'var(--space-xl)' }}>
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Project Services - {invoice.notes || 'AI Agent Workflow'}</td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(invoice.amount, 'id')}</td>
              </tr>
            </tbody>
          </table>

          {/* Invoice Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Subtotal:</div>
                <div>{formatCurrency(invoice.amount, 'id')}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Tax (11%):</div>
                <div>{formatCurrency(invoice.tax, 'id')}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-md)', fontSize: '1.25rem', fontWeight: 800 }}>
                <div>Total:</div>
                <div>{formatCurrency(invoice.total, 'id')}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
