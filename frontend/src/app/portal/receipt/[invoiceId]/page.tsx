'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ReceiptPage() {
  const params = useParams();
  const invoiceId = params.invoiceId as string;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) return;
    fetch(`/api/invoices/${invoiceId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setInvoice(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="fade-in" style={{ padding: 'var(--space-lg)', maxWidth: 640, margin: '0 auto' }}>
        <div className="skeleton" style={{ width: '100%', height: 500, borderRadius: 'var(--radius-xl)' }} />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <div className="empty-state-title">Invoice not found</div>
        <Link href="/portal" className="btn btn-primary">Back to Portal</Link>
      </div>
    );
  }

  if (invoice.status !== 'PAID') {
    return (
      <div className="fade-in" style={{ padding: 'var(--space-lg)', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>⏳</div>
        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Invoice Not Yet Paid</h2>
        <p className="text-secondary mb-lg">A receipt will be available after payment is completed.</p>
        <Link href={`/portal/pay/${invoiceId}`} className="btn btn-primary">Pay Now</Link>
      </div>
    );
  }

  const methodLabel = invoice.paymentMethod === 'CREDIT_CARD' ? '💳 Credit Card'
    : invoice.paymentMethod === 'BANK_TRANSFER' ? '🏦 Bank Transfer'
    : invoice.paymentMethod === 'E_WALLET' ? '📱 E-Wallet'
    : '💰 Direct Payment';

  return (
    <div className="fade-in">
      <div className="topbar-breadcrumb" style={{ marginBottom: 'var(--space-lg)' }}>
        <Link href="/portal">← Back to Portal</Link>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="page-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <h1 className="page-title">Payment Receipt</h1>
          <p className="page-subtitle">Transaction confirmation for {invoice.invoiceNumber}</p>
        </div>

        <div className="receipt-card">
          {/* Receipt Header */}
          <div className="receipt-header">
            <div className="receipt-stamp">✓ Payment Confirmed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              AgentFlow
            </div>
            <div style={{ opacity: 0.6, fontSize: '0.875rem', marginTop: 4 }}>
              AI-Powered Service Agency
            </div>
          </div>

          {/* Receipt Body */}
          <div className="receipt-body">
            <div className="receipt-row">
              <span className="receipt-row-label">Invoice Number</span>
              <span className="receipt-row-value">{invoice.invoiceNumber}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-row-label">Project</span>
              <span className="receipt-row-value">{invoice.project?.title || 'N/A'}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-row-label">Client</span>
              <span className="receipt-row-value">{invoice.project?.client?.name || 'N/A'}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-row-label">Payment Method</span>
              <span className="receipt-row-value">{methodLabel}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-row-label">Payment Date</span>
              <span className="receipt-row-value">
                {invoice.paidAt ? formatDate(invoice.paidAt) : formatDate(invoice.createdAt)}
              </span>
            </div>

            <hr className="receipt-divider" />

            <div className="receipt-row">
              <span className="receipt-row-label">Description</span>
              <span className="receipt-row-value">{invoice.notes || 'AI Agent Workflow Services'}</span>
            </div>

            <hr className="receipt-divider" />

            <div className="receipt-row">
              <span className="receipt-row-label">Subtotal</span>
              <span className="receipt-row-value">{formatCurrency(invoice.amount, 'id')}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-row-label">Tax (11% PPN)</span>
              <span className="receipt-row-value">{formatCurrency(invoice.tax, 'id')}</span>
            </div>

            <hr className="receipt-divider" />

            <div className="receipt-total-row">
              <span>Total Paid</span>
              <span style={{ color: 'var(--success)' }}>{formatCurrency(invoice.total, 'id')}</span>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="receipt-footer">
            <p style={{ marginBottom: 'var(--space-md)' }}>
              Thank you for your payment! This receipt confirms your transaction has been processed.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => window.print()}>
                🖨️ Print Receipt
              </button>
              <Link 
                href={`/portal/projects/${invoice.project?.id || invoice.projectId}`} 
                className="btn btn-primary"
              >
                ← Back to Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
