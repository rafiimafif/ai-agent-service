'use client';

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '@/components/invoices/InvoicePDF';

export default function DownloadButton({ invoice }: { invoice: any }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button className="btn btn-primary" disabled>
        Loading PDF...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName={`${invoice.invoiceNumber}.pdf`}
      className="btn btn-primary"
    >
      {/* @ts-ignore */}
      {({ blob, url, loading, error }) =>
        loading ? 'Preparing document...' : 'Download PDF'
      }
    </PDFDownloadLink>
  );
}
