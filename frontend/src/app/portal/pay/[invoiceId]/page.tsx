'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';

type PaymentMethod = 'CREDIT_CARD' | 'BANK_TRANSFER' | 'E_WALLET';
type PaymentPhase = 'form' | 'confirm' | 'processing' | 'success';

const CONFETTI_COLORS = ['#E8652D', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6EE7B7', '#FCD34D'];

function ConfettiEffect() {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 8 + 6,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            animationDelay: p.delay,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function PaymentCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.invoiceId as string;

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [phase, setPhase] = useState<PaymentPhase>('form');
  const [copied, setCopied] = useState(false);

  // Credit card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // E-wallet
  const [selectedWallet, setSelectedWallet] = useState('gopay');

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

  const formatCardNumber = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 16);
    return nums.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const nums = value.replace(/\D/g, '').slice(0, 4);
    if (nums.length > 2) return nums.slice(0, 2) + '/' + nums.slice(2);
    return nums;
  };

  const isFormValid = () => {
    if (paymentMethod === 'CREDIT_CARD') {
      return cardNumber.replace(/\s/g, '').length === 16 
        && cardExpiry.length === 5 
        && cardCvv.length >= 3 
        && cardName.length > 0;
    }
    return true; // Bank transfer and e-wallet don't need extra validation
  };

  const handleConfirmPayment = async () => {
    setPhase('processing');

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2500));

      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID', paymentMethod })
      });

      if (!res.ok) throw new Error('Payment failed');

      const data = await res.json();
      setInvoice(data.invoice);
      setPhase('success');
    } catch (err) {
      alert('Payment failed. Please try again.');
      setPhase('form');
    }
  };

  const copyVA = () => {
    navigator.clipboard.writeText('8800 1234 5678 9012');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ padding: 'var(--space-lg)', maxWidth: 1000, margin: '0 auto' }}>
        <div className="skeleton" style={{ width: '30%', height: 32, marginBottom: 16 }} />
        <div className="skeleton" style={{ width: '100%', height: 400, borderRadius: 'var(--radius-xl)' }} />
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

  if (invoice.status === 'PAID') {
    return (
      <div className="fade-in" style={{ padding: 'var(--space-lg)', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>✅</div>
        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Invoice Already Paid</h2>
        <p className="text-secondary mb-lg">This invoice has already been settled.</p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
          <Link href={`/portal/receipt/${invoiceId}`} className="btn btn-primary">View Receipt</Link>
          <Link href="/portal" className="btn btn-secondary">Back to Portal</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Confirmation Modal */}
      {phase === 'confirm' && (
        <div className="confirm-modal-overlay" onClick={() => setPhase('form')}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-icon">💳</div>
            <h3 className="confirm-modal-title">Confirm Payment</h3>
            <p className="confirm-modal-text">
              You are about to pay <strong>{formatCurrency(invoice.total, 'id')}</strong> for invoice <strong>{invoice.invoiceNumber}</strong> via {
                paymentMethod === 'CREDIT_CARD' ? 'Credit Card' 
                : paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' 
                : 'E-Wallet'
              }.
            </p>
            <div className="confirm-modal-actions">
              <button className="btn btn-secondary" onClick={() => setPhase('form')}>Cancel</button>
              <button className="btn btn-success btn-lg" onClick={handleConfirmPayment}>
                Confirm & Pay {formatCurrency(invoice.total, 'id')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {phase === 'processing' && (
        <div className="payment-processing-overlay">
          <div className="payment-processing-card">
            <div className="payment-spinner" />
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Processing Payment</h3>
            <p className="text-secondary">Please wait while we verify your payment...</p>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {phase === 'success' && (
        <>
          <ConfettiEffect />
          <div className="payment-success-overlay">
            <div className="payment-success-card">
              <div className="success-checkmark" />
              <h2 className="success-title">Payment Successful!</h2>
              <p className="success-subtitle">
                Your payment for invoice {invoice.invoiceNumber} has been received and confirmed.
              </p>
              <div className="success-amount">{formatCurrency(invoice.total, 'id')}</div>
              <div className="success-actions">
                <Link href={`/portal/receipt/${invoiceId}`} className="btn btn-primary btn-lg">
                  📄 View Receipt
                </Link>
                <Link href={`/portal/projects/${invoice.project?.id || invoice.projectId}`} className="btn btn-secondary btn-lg">
                  ← Back to Project
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Page Content */}
      <div className="topbar-breadcrumb" style={{ marginBottom: 'var(--space-lg)' }}>
        <Link href="/portal">← Back to Portal</Link>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Payment Checkout</h1>
          <p className="page-subtitle">Complete your payment for {invoice.invoiceNumber}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>🔒 Secure Payment</span>
        </div>
      </div>

      <div className="payment-layout">
        {/* Left Column: Invoice Summary */}
        <div>
          <div className="invoice-summary-card">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.6, marginBottom: 4 }}>Total Amount Due</div>
              <div className="invoice-summary-total">{formatCurrency(invoice.total, 'id')}</div>
              
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <div className="invoice-summary-row">
                  <span style={{ opacity: 0.6 }}>Invoice</span>
                  <span style={{ fontWeight: 600 }}>{invoice.invoiceNumber}</span>
                </div>
                <div className="invoice-summary-row">
                  <span style={{ opacity: 0.6 }}>Project</span>
                  <span style={{ fontWeight: 600 }}>{invoice.project?.title || 'N/A'}</span>
                </div>
                <div className="invoice-summary-row">
                  <span style={{ opacity: 0.6 }}>Subtotal</span>
                  <span>{formatCurrency(invoice.amount, 'id')}</span>
                </div>
                <div className="invoice-summary-row">
                  <span style={{ opacity: 0.6 }}>Tax (11%)</span>
                  <span>{formatCurrency(invoice.tax, 'id')}</span>
                </div>
                <div className="invoice-summary-row">
                  <span style={{ opacity: 0.6 }}>Due Date</span>
                  <span>{formatDate(invoice.dueDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-lg)', marginTop: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <span style={{ fontSize: '1.25rem' }}>🛡️</span>
              <span className="font-bold text-sm">Secure & Protected</span>
            </div>
            <p className="text-sm text-secondary" style={{ lineHeight: 1.6 }}>
              Your payment information is encrypted and secured. We use industry-standard security protocols to protect your data.
            </p>
          </div>
        </div>

        {/* Right Column: Payment Form */}
        <div className="card" style={{ padding: 'var(--space-xl)' }}>
          <h3 className="font-bold mb-lg">Select Payment Method</h3>

          {/* Payment Tabs */}
          <div className="payment-tabs">
            <button 
              className={`payment-tab ${paymentMethod === 'CREDIT_CARD' ? 'payment-tab-active' : ''}`}
              onClick={() => setPaymentMethod('CREDIT_CARD')}
            >
              <span className="payment-tab-icon">💳</span>
              Credit Card
            </button>
            <button 
              className={`payment-tab ${paymentMethod === 'BANK_TRANSFER' ? 'payment-tab-active' : ''}`}
              onClick={() => setPaymentMethod('BANK_TRANSFER')}
            >
              <span className="payment-tab-icon">🏦</span>
              Bank Transfer
            </button>
            <button 
              className={`payment-tab ${paymentMethod === 'E_WALLET' ? 'payment-tab-active' : ''}`}
              onClick={() => setPaymentMethod('E_WALLET')}
            >
              <span className="payment-tab-icon">📱</span>
              E-Wallet
            </button>
          </div>

          {/* Credit Card Form */}
          {paymentMethod === 'CREDIT_CARD' && (
            <div className="fade-in">
              <div className="payment-form-group">
                <label className="payment-form-label">Cardholder Name</label>
                <input
                  className="payment-card-input"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  style={{ fontFamily: 'var(--font-body)', letterSpacing: 'normal' }}
                />
              </div>
              <div className="payment-form-group">
                <label className="payment-form-label">Card Number</label>
                <input
                  className="payment-card-input"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>
              <div className="payment-form-row">
                <div className="payment-form-group">
                  <label className="payment-form-label">Expiry Date</label>
                  <input
                    className="payment-card-input"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="payment-form-group">
                  <label className="payment-form-label">CVV</label>
                  <input
                    className="payment-card-input"
                    placeholder="•••"
                    type="password"
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer View */}
          {paymentMethod === 'BANK_TRANSFER' && (
            <div className="fade-in">
              <div className="bank-transfer-info">
                <div className="text-sm font-bold" style={{ marginBottom: 'var(--space-sm)' }}>Bank BCA — Virtual Account</div>
                <div className="bank-va-number">8800 1234 5678 9012</div>
                <button className="copy-btn" onClick={copyVA}>
                  {copied ? '✓ Copied!' : '📋 Copy Number'}
                </button>
                <p className="text-xs text-secondary" style={{ marginTop: 'var(--space-md)', lineHeight: 1.6 }}>
                  Transfer exactly <strong>{formatCurrency(invoice.total, 'id')}</strong> to the virtual account above. 
                  Payment will be automatically confirmed within 5 minutes.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: 'var(--info-light)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--info)' }}>
                <span>ℹ️</span>
                <span>Virtual account is valid for 24 hours from the time of this payment request.</span>
              </div>
            </div>
          )}

          {/* E-Wallet View */}
          {paymentMethod === 'E_WALLET' && (
            <div className="fade-in">
              <div className="ewallet-grid">
                {[
                  { id: 'gopay', name: 'GoPay', icon: '🟢' },
                  { id: 'ovo', name: 'OVO', icon: '🟣' },
                  { id: 'dana', name: 'DANA', icon: '🔵' },
                ].map(wallet => (
                  <button
                    key={wallet.id}
                    className={`ewallet-option ${selectedWallet === wallet.id ? 'ewallet-option-active' : ''}`}
                    onClick={() => setSelectedWallet(wallet.id)}
                  >
                    <span className="ewallet-icon">{wallet.icon}</span>
                    {wallet.name}
                  </button>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <p className="text-sm text-secondary mb-md">Scan the QR code with your {selectedWallet.charAt(0).toUpperCase() + selectedWallet.slice(1)} app</p>
                <div className="qr-placeholder" />
                <p className="text-xs text-secondary" style={{ marginTop: 'var(--space-md)' }}>
                  Or click "Pay Now" to open the app directly
                </p>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 'var(--space-lg)', padding: '1rem', fontSize: '1rem' }}
            disabled={paymentMethod === 'CREDIT_CARD' && !isFormValid()}
            onClick={() => setPhase('confirm')}
          >
            {paymentMethod === 'CREDIT_CARD' ? '🔒' : paymentMethod === 'BANK_TRANSFER' ? '🏦' : '📱'}{' '}
            Pay {formatCurrency(invoice.total, 'id')}
          </button>
        </div>
      </div>
    </div>
  );
}
