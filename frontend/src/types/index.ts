// ============================================================
// AgentFlow — Core TypeScript Types
// ============================================================

export type Role = 'ADMIN' | 'CLIENT';

export type ProjectStatus =
  | 'DRAFT'
  | 'BRIEFED'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'COMPLETED'
  | 'CANCELLED';

export type BriefStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type AgentType = 'RISET' | 'CODING' | 'AUTOMASI' | 'KONTEN' | 'SUPPORT';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

// ---- Data Models ----

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  locale: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
  clientId: string;
  client?: User;
  brief?: Brief;
  tasks?: AgentTask[];
  invoices?: Invoice[];
  activityLogs?: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}

export interface Brief {
  id: string;
  projectId: string;
  requirements: string[];
  deliverables: string[];
  dataSources: string[];
  notes: string;
  status: BriefStatus;
  submittedAt: string;
}

export interface AgentTask {
  id: string;
  projectId: string;
  agentType: AgentType;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number;
  output?: string;
  feedback?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface Invoice {
  id: string;
  projectId: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  projectId: string;
  userId: string;
  user?: User;
  action: string;
  detail: string;
  createdAt: string;
}

// ---- UI-specific Types ----

export interface StatsCard {
  label: string;
  value: string | number;
  change?: number;
  icon: string;
  color: string;
}

export interface AgentInfo {
  type: AgentType;
  name: string;
  nameId: string;
  description: string;
  descriptionId: string;
  icon: string;
  color: string;
  gradient: string;
}

export const AGENT_INFO: Record<AgentType, AgentInfo> = {
  RISET: {
    type: 'RISET',
    name: 'Research Agent',
    nameId: 'Agen Riset',
    description: 'Market research, data analysis, competitor analysis',
    descriptionId: 'Riset pasar, analisis data, analisis kompetitor',
    icon: '🔍',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  },
  CODING: {
    type: 'CODING',
    name: 'Coding Agent',
    nameId: 'Agen Coding',
    description: 'Software development, API integration, automation scripts',
    descriptionId: 'Pengembangan software, integrasi API, skrip automasi',
    icon: '💻',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #34D399)',
  },
  AUTOMASI: {
    type: 'AUTOMASI',
    name: 'Automation Agent',
    nameId: 'Agen Automasi',
    description: 'Workflow automation, process optimization, system integration',
    descriptionId: 'Automasi workflow, optimasi proses, integrasi sistem',
    icon: '⚡',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
  },
  KONTEN: {
    type: 'KONTEN',
    name: 'Content Agent',
    nameId: 'Agen Konten',
    description: 'Copywriting, content strategy, social media management',
    descriptionId: 'Copywriting, strategi konten, manajemen media sosial',
    icon: '✍️',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
  },
  SUPPORT: {
    type: 'SUPPORT',
    name: 'Support Agent',
    nameId: 'Agen Support',
    description: 'Customer support, documentation, training',
    descriptionId: 'Dukungan pelanggan, dokumentasi, pelatihan',
    icon: '🛟',
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4, #22D3EE)',
  },
};

export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; labelId: string; color: string; bg: string }
> = {
  DRAFT: { label: 'Draft', labelId: 'Draf', color: '#6B7280', bg: '#F3F4F6' },
  BRIEFED: { label: 'Briefed', labelId: 'Di-brief', color: '#3B82F6', bg: '#EFF6FF' },
  IN_PROGRESS: { label: 'In Progress', labelId: 'Dalam Proses', color: '#F59E0B', bg: '#FFFBEB' },
  REVIEW: { label: 'In Review', labelId: 'Review', color: '#8B5CF6', bg: '#F5F3FF' },
  COMPLETED: { label: 'Completed', labelId: 'Selesai', color: '#10B981', bg: '#ECFDF5' },
  CANCELLED: { label: 'Cancelled', labelId: 'Dibatalkan', color: '#EF4444', bg: '#FEF2F2' },
};

export const INVOICE_STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; labelId: string; color: string; bg: string }
> = {
  DRAFT: { label: 'Draft', labelId: 'Draf', color: '#6B7280', bg: '#F3F4F6' },
  SENT: { label: 'Sent', labelId: 'Terkirim', color: '#3B82F6', bg: '#EFF6FF' },
  PAID: { label: 'Paid', labelId: 'Lunas', color: '#10B981', bg: '#ECFDF5' },
  OVERDUE: { label: 'Overdue', labelId: 'Terlambat', color: '#EF4444', bg: '#FEF2F2' },
  CANCELLED: { label: 'Cancelled', labelId: 'Dibatalkan', color: '#6B7280', bg: '#F3F4F6' },
};
