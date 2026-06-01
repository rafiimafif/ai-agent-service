'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Invoice } from '@/types';

// Register a simpler font for the PDF if needed, but we'll use standard Helvetica for simplicity.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottom: '1 solid #E5E1DB',
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E8652D',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#6B7280',
    width: 100,
  },
  value: {
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid #E5E1DB',
    paddingBottom: 8,
    marginBottom: 8,
  },
  col1: { width: '60%' },
  col2: { width: '40%', textAlign: 'right' },
  tableHeaderCell: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottom: '1 solid #F0EDE8',
  },
  summary: {
    marginTop: 20,
    borderTop: '1 solid #E5E1DB',
    paddingTop: 10,
    width: '40%',
    alignSelf: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1 solid #1A1A1A',
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 10,
    borderTop: '1 solid #E5E1DB',
    paddingTop: 20,
  },
});

interface InvoicePDFProps {
  invoice: any; // Using any to accommodate the relation fields
}

export default function InvoicePDF({ invoice }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>AgentFlow</Text>
            <Text style={styles.subtitle}>AI-Powered Service Agency</Text>
            <Text style={styles.subtitle}>Jakarta, Indonesia</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subtitle}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Billed To:</Text>
            <Text style={styles.value}>{invoice.project?.client?.name}</Text>
            <Text style={{ color: '#6B7280', marginTop: 4 }}>{invoice.project?.client?.email}</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Issue Date:</Text>
              <Text style={styles.value}>{formatDate(invoice.createdAt)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Due Date:</Text>
              <Text style={styles.value}>{formatDate(invoice.dueDate)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{invoice.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Detail:</Text>
          <Text style={styles.value}>{invoice.project?.title}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.col1}><Text style={styles.tableHeaderCell}>Description</Text></View>
            <View style={styles.col2}><Text style={styles.tableHeaderCell}>Amount</Text></View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.col1}>
              <Text>Project Services - {invoice.notes || 'AI Agent Workflow'}</Text>
            </View>
            <View style={styles.col2}>
              <Text>{formatCurrency(invoice.amount, 'id')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Subtotal:</Text>
            <Text>{formatCurrency(invoice.amount, 'id')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Tax (11%):</Text>
            <Text>{formatCurrency(invoice.tax, 'id')}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalText}>{formatCurrency(invoice.total, 'id')}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your business. Please remit payment by the due date.</Text>
          <Text>AgentFlow - Professional AI Services Platform</Text>
        </View>
      </Page>
    </Document>
  );
}
