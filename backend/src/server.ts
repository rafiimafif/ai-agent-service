import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import prisma from './lib/prisma';

// Active in-memory simulations tracker to prevent duplicate runners
const activeSimulations = new Map<string, NodeJS.Timeout>();

function generateAgentOutput(
  agentType: string,
  projectTitle: string,
  projectDescription: string,
  requirements: string[] = []
): string {
  const reqStr = requirements.length > 0 
    ? requirements.map(r => `- ${r}`).join('\n')
    : `- Standard specifications for ${projectTitle}`;

  switch (agentType) {
    case 'RISET':
      return `# 🔍 Market & Competitor Analysis Report
**Project:** ${projectTitle}
**Description:** ${projectDescription}

## 1. Executive Summary
This report analyzes the competitive landscape and user expectations for **${projectTitle}**. We evaluated top competitors and established a strategic positioning matrix to maximize target market entry success.

## 2. Competitor Matrix
| Competitor | Core Strengths | Critical Vulnerabilities | Strategic Gap Identified |
| :--- | :--- | :--- | :--- |
| **Market Leader A** | High brand authority, deep feature set | Slow feature iterations, high pricing | High-performance, budget-friendly entry |
| **Competitor B** | Exceptional mobile UX | Poor third-party API integration | Seamless automation and integration features |
| **Traditional Systems** | High security & enterprise focus | Archaic UI/UX, steep learning curve | Sleek, modern consumer-grade experience |

## 3. SWOT Analysis
### Strengths
- Modern tech stack (Next.js 16 + Express API)
- Tailored automated agent-driven workflows
- Dynamic user-centric styling and aesthetics

### Weaknesses
- New entry in an established market segment
- Initial data cold-start period for algorithms

### Opportunities
- Capitalizing on underserved niche: **${projectTitle}**
- Partnering with local automated platforms

### Threats
- Swift feature copying by capital-rich competitors
- Fluctuations in user retention benchmarks

## 4. Key Recommendations & Requirements Checklist
${reqStr}

---
*Report compiled autonomously by Research Agent (RISET) on ${new Date().toLocaleDateString()}*`;

    case 'CODING':
      return `# 💻 Core System Scaffolding & Architecture
**Project:** ${projectTitle}

The core application scaffolding has been structured, initialized, and integrated with the main database. 

## 1. Directory Scaffolding Tree
\`\`\`text
${projectTitle.toLowerCase().replace(/\s+/g, '-')}/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Core schema definitions
│   │   └── seed.ts            # Mock seeds
│   ├── src/
│   │   ├── server.ts          # Express API server entrypoint
│   │   ├── controllers/       # Route controllers
│   │   └── models/            # Domain database operations
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router (Layout & Pages)
│   │   ├── components/        # Reusable UI & atomic design cards
│   │   ├── lib/               # Utility string/number formatters
│   │   └── types/             # TypeScript domain models
│   └── package.json
└── docker-compose.yml         # Unified service orchestration
\`\`\`

## 2. Core Database Schema (Prisma Schema Snippet)
\`\`\`prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model CoreRecord {
  id          String   @id @default(cuid())
  title       String
  description String
  status      String   @default("ACTIVE")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
\`\`\`

## 3. Sample Express API Endpoint Route
\`\`\`typescript
import { Router } from 'express';
const router = Router();

// GET /api/core-records - Fetch system records
router.get('/core-records', async (req, res) => {
  try {
    const records = await prisma.coreRecord.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: records });
  } catch (error) {
    return res.status(500).json({ error: 'Database read failure' });
  }
});

export default router;
\`\`\`

---
*Scaffolding and initialization completed by Coding Agent (CODING).*`;

    case 'AUTOMASI':
      return `# ⚡ Automated Workflows & Systems Integration Map
**Project:** ${projectTitle}

We have configured the integration layer, automated pipelines, and third-party webhooks to link services smoothly.

## 1. Active Integration Flow Map
\`\`\`text
[ Client Action ] ──► ( Webhook Trigger ) ──► [ Automation Agent Parser ]
                                                   │
     ┌─────────────────────────────────────────────┴────────────────────────────────┐
     ▼                                                                              ▼
[ DB Record Generated ]                                                    [ Notification Dispatch ]
     │                                                                              │
     ▼                                                                              ▼
( Stripe Sync Invoice )                                                    ( Discord / Slack Ping )
\`\`\`

## 2. GitHub Actions Integration Workflow (\`main_deploy.yml\`)
\`\`\`yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter & Automated Tests
        run: npm test

      - name: Deploy to Cloud Provider
        run: npm run deploy:prod
        env:
          DEPLOYS_API_TOKEN: \${{ secrets.PROD_API_TOKEN }}
\`\`\`

## 3. Configured API Endpoints & Third-Party Pings
- **Stripe Billing Webhook:** \`http://localhost:5000/api/invoices/stripe-webhook\`
- **Notification Webhook:** Active SendGrid integration for client project updates.

---
*Workflows and integrations verified by Automation Agent (AUTOMASI).*`;

    case 'KONTEN':
      return `# ✍️ UI Assets, Styling Guidelines & Branding Copy
**Project:** ${projectTitle}

A collection of polished copy templates, aesthetic assets, and branding frameworks tailored to target audiences.

## 1. Core Brand Positioning Copy
- **Primary Hero Headline:** *"Revolutionize your daily operations with ${projectTitle}."*
- **Sub-headline:** *"A futuristic, AI-driven platform built to orchestrate and streamline your entire service lifecycle effortlessly."*
- **Call to Action (CTA) Copy:** *"Empower Your Workflow Today — Deploy Free"*

## 2. Selected Aesthetic Color Palette Tokens
| Token | Variable | HEX Value | Visual Representation / Role |
| :--- | :--- | :--- | :--- |
| **Primary Orange** | \`--primary\` | \`#F59E0B\` | Main branding color, interactive elements, highlights |
| **Deep Charcoal** | \`--bg-dark\` | \`#111827\` | Premium background element cards, text focus |
| **Warm Cream** | \`--surface-warm\` | \`#FFFBEB\` | Subtle hover states, secondary indicators |
| **Glass border** | \`--border-glass\` | \`rgba(245, 158, 11, 0.1)\` | Glassmorphism card framing |

## 3. Automated Welcome Email Campaign Copy
\`\`\`text
Subject: Welcome to ${projectTitle} - Let's supercharge your flow!

Hello {{User_Name}},

Welcome! We are thrilled to introduce you to ${projectTitle}. 
Our primary focus is giving you absolute control and speed over your operations:
1. Orchestrate your pipelines using autonomous AI agents.
2. View analytics and invoices live.
3. Access premium, responsive interfaces designed for visual excellence.

Click here to initialize your workspace: {{Activation_Link}}

Best regards,
The ${projectTitle} Team
\`\`\`

---
*Branding copy and design system generated by Content Agent (KONTEN).*`;

    case 'SUPPORT':
      return `# 🛟 Quality Assurance, Testing, and Pre-Launch Validation
**Project:** ${projectTitle}

Comprehensive E2E validation checks, code quality analysis, and compatibility matrices have been fully executed.

## 1. Code Quality Metrics
- **Test Coverage:** \`96.8%\`
- **Lint Errors:** \`0\`
- **Vulnerabilities detected:** \`0 (npm audit passed)\`
- **Lighthouse Performance Score:**
  - **Performance:** \`98\`
  - **Accessibility:** \`100\`
  - **Best Practices:** \`96\`
  - **SEO:** \`100\`

## 2. Test Execution Log (Jest Suite Output)
\`\`\`text
PASS  src/tests/auth.test.ts (6.12s)
PASS  src/tests/project_workflow.test.ts (8.47s)
PASS  src/tests/invoice_generation.test.ts (4.23s)

Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        19.12s
Ran all test suites with 100% success.
\`\`\`

## 3. E2E Cross-Browser Compatibility Matrix
- **Google Chrome / Chromium Engines:** ✅ Stable (120Hz micro-animations verified)
- **Mozilla Firefox:** ✅ Stable (CSS grid alignments intact)
- **Safari / WebKit Engine:** ✅ Stable (Flexbox and cookie credentials verified)
- **Mobile Responsive Viewports:** ✅ Stable (Fluid column collapse verified)

## 4. Operational Sign-off Checklist
- [x] Database migrations synced and deployed.
- [x] Environment variables securely loaded.
- [x] SSL/TLS certificates configured for Secure Cookie credentials.

---
*Launch validation and QA completed by Support Agent (SUPPORT).*`;

    default:
      return `# Deliverable for ${agentType}
Autonomous agent work completed successfully for ${projectTitle}.`;
  }
}

function triggerAgentSimulation(projectId: string, taskId: string) {
  // Clear any existing active simulation for this specific task
  if (activeSimulations.has(taskId)) {
    clearInterval(activeSimulations.get(taskId)!);
    activeSimulations.delete(taskId);
  }

  const intervalId = setInterval(async () => {
    try {
      // Fetch current task status
      const task = await prisma.agentTask.findUnique({
        where: { id: taskId },
        include: { project: { include: { brief: true } } },
      });

      if (!task || task.status !== 'IN_PROGRESS') {
        // If task was deleted, completed or paused, clear simulation
        clearInterval(intervalId);
        activeSimulations.delete(taskId);
        return;
      }

      const nextProgress = Math.min(task.progress + 20, 100);

      if (nextProgress < 100) {
        // Increment progress
        await prisma.agentTask.update({
          where: { id: taskId },
          data: { progress: nextProgress },
        });
      } else {
        // We reached 100%! Set status to REVIEW and generate output
        clearInterval(intervalId);
        activeSimulations.delete(taskId);

        const projectTitle = task.project.title;
        const projectDesc = task.project.description;
        let requirements: string[] = [];
        if (task.project.brief) {
          try {
            requirements = JSON.parse(task.project.brief.requirements);
          } catch {}
        }

        const generatedOutput = generateAgentOutput(
          task.agentType,
          projectTitle,
          projectDesc,
          requirements
        );

        await prisma.$transaction(async (tx) => {
          await tx.agentTask.update({
            where: { id: taskId },
            data: {
              progress: 100,
              status: 'REVIEW',
              output: generatedOutput,
            },
          });

          // Log agent activity
          const agentName = task.agentType === 'RISET' ? 'Research Agent' :
                            task.agentType === 'CODING' ? 'Coding Agent' :
                            task.agentType === 'AUTOMASI' ? 'Automation Agent' :
                            task.agentType === 'KONTEN' ? 'Content Agent' :
                            'Support Agent';

          await tx.activityLog.create({
            data: {
              projectId: task.projectId,
              userId: task.project.clientId,
              action: 'TASK_IN_REVIEW',
              detail: `🤖 ${agentName} has completed work and submitted outputs for review.`,
            },
          });
        });
      }
    } catch (err) {
      console.error(`Simulation error for task ${taskId}:`, err);
      clearInterval(intervalId);
      activeSimulations.delete(taskId);
    }
  }, 2000); // Progress increments every 2 seconds

  activeSimulations.set(taskId, intervalId);
}

async function pushScaffoldingToGitHub(
  projectId: string,
  repoUrl: string,
  token: string,
  projectTitle: string,
  projectDescription: string
) {
  const tempDirName = `temp-git-${projectId}-${Date.now()}`;
  const tempDirPath = path.join(__dirname, tempDirName);

  try {
    console.log(`🚀 Initializing temporary directory for GitHub push: ${tempDirPath}`);
    
    // Create temp directory
    if (!fs.existsSync(tempDirPath)) {
      fs.mkdirSync(tempDirPath, { recursive: true });
    }

    // Write package.json
    const packageJson = {
      name: projectTitle.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: projectDescription,
      main: 'index.js',
      scripts: {
        start: 'node index.js',
        dev: 'nodemon index.js'
      },
      dependencies: {
        express: '^4.18.2',
        cors: '^2.8.5',
        dotenv: '^16.3.1'
      },
      devDependencies: {
        nodemon: '^3.0.1'
      }
    };
    fs.writeFileSync(path.join(tempDirPath, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Write index.js (a functional Simple AI Chatbot Server!)
    const indexJs = `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Mock AI response engine
const respondToMessage = (message) => {
  const msg = message.toLowerCase().trim();
  
  if (msg.includes('hello') || msg.includes('hi')) {
    return "Hello! I am your AI Chatbot scaffolded by AgentFlow. How can I help you today? 😊";
  }
  if (msg.includes('help')) {
    return "Sure! I can help you with system status, scaffolding queries, or automated routing. Try asking me 'what can you do'!";
  }
  if (msg.includes('what can you do')) {
    return "I am a functioning chatbot template! I have Express routing, CORS enabled, and a responsive simulated AI brain.";
  }
  if (msg.includes('agent')) {
    return "AI agents are amazing! They can research, write code, build integrations, and do QA testing automatically.";
  }
  return "That's an interesting point! I've logged your query and my automated brain is processing it. Let me know if you need help with anything else!";
};

// POST /api/chat - Exchange chat messages
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message payload is required' });
  }
  
  const reply = respondToMessage(message);
  return res.json({
    success: true,
    reply,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('🚀 AI Chatbot Scaffolding Server is Running! Send POST to /api/chat.');
});

app.listen(PORT, () => {
  console.log(\`🤖 AI Chatbot running at http://localhost:\${PORT}\`);
});
`;
    fs.writeFileSync(path.join(tempDirPath, 'index.js'), indexJs);

    // Write README.md
    const readmeMd = `# 🤖 ${projectTitle}

Welcome to your new autonomous project repository! This system was automatically generated and scaffolded by **AgentFlow's Coding Agent (CODING)**.

## 🚀 About the Scaffolding
* **Project Name:** ${projectTitle}
* **Goal:** ${projectDescription}
* **Tech Stack:** Node.js, Express, CORS, dotenv, and nodemon.

## 🛠️ Getting Started

### 1. Install Dependencies
Navigate into the directory and install all node packages:
\`\`\`bash
npm install
\`\`\`

### 2. Run the Development Server
Start the local Express server with nodemon hot-reloads:
\`\`\`bash
npm run dev
\`\`\`
The chatbot server will be running on **http://localhost:8000**!

### 3. Test the Chatbot Endpoint
Send a \`POST\` request to **http://localhost:8000/api/chat** with a JSON body:
\`\`\`json
{
  "message": "Hello!"
}
\`\`\`

---
*Scaffolding and Git push executed dynamically by AgentFlow's AI Coding Agent.*
`;
    fs.writeFileSync(path.join(tempDirPath, 'README.md'), readmeMd);

    // Write .gitignore
    const gitignore = `node_modules/
.env
.DS_Store
`;
    fs.writeFileSync(path.join(tempDirPath, '.gitignore'), gitignore);

    // Parse Git Owner and Repo
    const cleanRepoUrl = repoUrl.trim().replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/\.git$/, '');
    const urlParts = cleanRepoUrl.split('/');
    if (urlParts.length < 3) {
      throw new Error(`Invalid GitHub repository URL format: ${repoUrl}`);
    }
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];

    // Build secure remote pushing URL with PAT
    const pushRemoteUrl = `https://${token}@github.com/${owner}/${repo}.git`;

    console.log(`📌 Preparing to push to: github.com/${owner}/${repo}`);

    execSync('git init', { cwd: tempDirPath, stdio: 'ignore' });
    execSync('git config user.name "AgentFlow Coding Agent"', { cwd: tempDirPath, stdio: 'ignore' });
    execSync('git config user.email "agent@agentflow.com"', { cwd: tempDirPath, stdio: 'ignore' });
    execSync('git add .', { cwd: tempDirPath, stdio: 'ignore' });
    execSync('git commit -m "Scaffolded chatbot repository by AgentFlow Coding Agent 🤖"', { cwd: tempDirPath, stdio: 'ignore' });
    execSync('git branch -M main', { cwd: tempDirPath, stdio: 'ignore' });
    execSync(`git remote add origin ${pushRemoteUrl}`, { cwd: tempDirPath, stdio: 'ignore' });
    
    console.log(`🔥 Pushing files directly to live GitHub branch...`);
    execSync('git push -u origin main --force', { cwd: tempDirPath, stdio: 'ignore' });
    
    console.log(`✅ Code successfully pushed to GitHub repository: ${owner}/${repo}`);
  } catch (err: any) {
    console.error(`❌ Failed to push scaffolding to GitHub:`, err.message || err);
    throw err;
  } finally {
    try {
      if (fs.existsSync(tempDirPath)) {
        fs.rmSync(tempDirPath, { recursive: true, force: true });
        console.log(`🧹 Cleaned up temporary directory: ${tempDirPath}`);
      }
    } catch (cleanupErr) {
      console.error(`Failed to clean up temp dir ${tempDirPath}:`, cleanupErr);
    }
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with Credentials for Cross-Origin Cookie Sharing
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());
app.use(cookieParser());

// ==========================================
// ── Auth Endpoints ──
// ==========================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'CLIENT' },
    });

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Set a simple session cookie
    const sessionData = {
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    res.cookie('session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/session
app.get('/api/auth/session', (req, res) => {
  const session = req.cookies.session;
  if (!session) {
    return res.status(401).json({ user: null });
  }
  try {
    const user = typeof session === 'string' ? JSON.parse(session) : session;
    return res.json({ user });
  } catch {
    return res.status(401).json({ user: null });
  }
});

// DELETE /api/auth/session (Logout)
app.delete('/api/auth/session', (req, res) => {
  res.clearCookie('session', { path: '/' });
  return res.json({ success: true });
});

// ==========================================
// ── Projects Endpoints ──
// ==========================================

// GET /api/projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        client: { select: { id: true, name: true, email: true, role: true } },
        brief: true,
        tasks: { orderBy: { id: 'asc' } },
        invoices: true,
        _count: { select: { tasks: true, invoices: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const parsed = projects.map((p) => ({
      ...p,
      brief: p.brief
        ? {
            ...p.brief,
            requirements: JSON.parse(p.brief.requirements),
            deliverables: JSON.parse(p.brief.deliverables),
            dataSources: JSON.parse(p.brief.dataSources),
          }
        : null,
    }));

    return res.json(parsed);
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id
app.get('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true, role: true } },
        brief: true,
        tasks: { orderBy: { id: 'asc' } },
        invoices: { orderBy: { createdAt: 'desc' } },
        activityLogs: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const parsed = {
      ...project,
      brief: project.brief
        ? {
            ...project.brief,
            requirements: JSON.parse(project.brief.requirements),
            deliverables: JSON.parse(project.brief.deliverables),
            dataSources: JSON.parse(project.brief.dataSources),
          }
        : null,
    };

    return res.json(parsed);
  } catch (error) {
    console.error('GET /api/projects/:id error:', error);
    return res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// PATCH /api/projects/:id (Accept brief logic)
app.patch('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  try {
    if (action !== 'ACCEPT_BRIEF') {
      return res.status(400).json({ error: 'Unsupported action' });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: { brief: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.status !== 'BRIEFED') {
      return res.status(400).json({ error: 'Project is not in BRIEFED state' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // A. Update status to IN_PROGRESS
      const updatedProject = await tx.project.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      });

      // B. Update brief to ACCEPTED
      if (project.brief) {
        await tx.brief.update({
          where: { id: project.brief.id },
          data: { status: 'ACCEPTED' },
        });
      }

      // C. Generate 5 tasks
      await tx.agentTask.createMany({
        data: [
          {
            projectId: id,
            agentType: 'RISET',
            title: 'Market & Competitor Analysis',
            description: 'Analyze competitors and compile research data.',
            status: 'COMPLETED',
            progress: 100,
            startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
          {
            projectId: id,
            agentType: 'CODING',
            title: 'Core System Scaffolding',
            description: 'Set up database schema, routes, and initial codebase.',
            status: 'IN_PROGRESS',
            progress: 20,
            startedAt: new Date(),
          },
          {
            projectId: id,
            agentType: 'AUTOMASI',
            title: 'Workflows & Integration',
            description: 'Configure automated processes and connect external APIs.',
            status: 'PENDING',
            progress: 0,
          },
          {
            projectId: id,
            agentType: 'KONTEN',
            title: 'UI Assets & Copywriting',
            description: 'Generate marketing materials, copywriting, and visual assets.',
            status: 'PENDING',
            progress: 0,
          },
          {
            projectId: id,
            agentType: 'SUPPORT',
            title: 'Quality Assurance & Testing',
            description: 'Execute end-to-end tests and handle client validation.',
            status: 'PENDING',
            progress: 0,
          },
        ],
      });

      // D. Generate 30% invoice
      const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const amount = project.budget * 0.3;
      const tax = amount * 0.11;
      const total = amount + tax;

      await tx.invoice.create({
        data: {
          projectId: id,
          invoiceNumber,
          amount,
          tax,
          total,
          status: 'SENT',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          notes: 'Initial 30% project deposit',
        },
      });

      // E. Log activity
      const admin = await tx.user.findFirst({ where: { role: 'ADMIN' } });
      const userId = admin?.id || project.clientId;

      await tx.activityLog.create({
        data: {
          projectId: id,
          userId,
          action: 'BRIEF_ACCEPTED',
          detail: 'Project brief accepted. AI agent team initialized.',
        },
      });

      return { updatedProject };
    });

    // Query the database to find the newly created CODING task and run the simulation immediately
    const codingTask = await prisma.agentTask.findFirst({
      where: { projectId: id, agentType: 'CODING' },
    });
    if (codingTask) {
      triggerAgentSimulation(id, codingTask.id);
    }

    return res.json({ success: true, project: result.updatedProject });
  } catch (error) {
    console.error('PATCH /api/projects/:id error:', error);
    return res.status(500).json({ error: 'Failed to accept project brief' });
  }
});

// DELETE /api/projects/:id
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Relying on Prisma's onDelete: Cascade to remove brief, tasks, invoices, and logs
    await prisma.project.delete({
      where: { id }
    });

    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/projects/:id error:', error);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
});

// PATCH /api/projects/:id/tasks/:taskId
app.patch('/api/projects/:id/tasks/:taskId', async (req, res) => {
  const { id, taskId } = req.params;
  const { status, output, feedback } = req.body;
  
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: { orderBy: { id: 'asc' } } },
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });

    const taskIndex = project.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

    const task = project.tasks[taskIndex];

    // Enforce sequential tasks
    if (taskIndex > 0 && status === 'IN_PROGRESS' && task.status === 'PENDING') {
      const prevTask = project.tasks[taskIndex - 1];
      if (prevTask.status !== 'COMPLETED') {
        return res.status(400).json({ error: 'Previous task must be completed first' });
      }
    }

    const updateData: any = { status };
    if (output !== undefined) updateData.output = output;
    if (feedback !== undefined) updateData.feedback = feedback;

    if (status === 'IN_PROGRESS') {
      updateData.startedAt = new Date();
      updateData.progress = task.progress > 0 ? task.progress : 10;
    } else if (status === 'REVIEW') {
      updateData.progress = 90;
    } else if (status === 'COMPLETED') {
      updateData.progress = 100;
      updateData.completedAt = new Date();
      updateData.feedback = null; // Clear any old rejection feedback
    }

    const updatedTask = await prisma.agentTask.update({
      where: { id: taskId },
      data: updateData,
    });

    // If task goes into IN_PROGRESS, trigger the background agent simulator
    if (status === 'IN_PROGRESS') {
      triggerAgentSimulation(id, taskId);
    }

    // If task completed, log activity and cascade to next task
    if (status === 'COMPLETED') {
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      const userId = admin?.id || project.clientId;
      await prisma.activityLog.create({
        data: {
          projectId: id,
          userId: userId,
          action: 'TASK_COMPLETED',
          detail: `Task approved and completed: ${task.title}`,
        },
      });

      // If Coding task is approved, and brief has GitHub settings, push to repo!
      if (task.agentType === 'CODING') {
        const fullProject = await prisma.project.findUnique({
          where: { id },
          include: { brief: true },
        });
        
        if (fullProject?.brief?.githubRepo && fullProject?.brief?.githubToken) {
          pushScaffoldingToGitHub(
            id,
            fullProject.brief.githubRepo,
            fullProject.brief.githubToken,
            fullProject.title,
            fullProject.description
          ).then(async () => {
            // Log successful GitHub push
            await prisma.activityLog.create({
              data: {
                projectId: id,
                userId: userId,
                action: 'GITHUB_PUSHED',
                detail: `🤖 Coding Agent successfully pushed files to GitHub repository: ${fullProject.brief?.githubRepo?.replace(/^https?:\/\/github.com\//, '')}`,
              },
            });
          }).catch(async (pushErr) => {
            // Log failed GitHub push
            await prisma.activityLog.create({
              data: {
                projectId: id,
                userId: userId,
                action: 'GITHUB_PUSH_FAILED',
                detail: `❌ Coding Agent failed to push to GitHub: ${pushErr.message || pushErr}`,
              },
            });
          });
        }
      }

      // Find the next task to cascade
      const nextTaskIndex = taskIndex + 1;
      if (nextTaskIndex < project.tasks.length) {
        const nextTask = project.tasks[nextTaskIndex];
        
        // Auto start the next task
        await prisma.agentTask.update({
          where: { id: nextTask.id },
          data: {
            status: 'IN_PROGRESS',
            progress: 10,
            startedAt: new Date(),
          },
        });

        // Trigger simulator for the next task
        triggerAgentSimulation(id, nextTask.id);

        const agentName = nextTask.agentType === 'RISET' ? 'Research Agent' :
                          nextTask.agentType === 'CODING' ? 'Coding Agent' :
                          nextTask.agentType === 'AUTOMASI' ? 'Automation Agent' :
                          nextTask.agentType === 'KONTEN' ? 'Content Agent' :
                          'Support Agent';

        await prisma.activityLog.create({
          data: {
            projectId: id,
            userId: userId,
            action: 'TASK_STARTED',
            detail: `🤖 ${agentName} has started work on: ${nextTask.title}`,
          },
        });
      }

      // Check if all tasks are now completed
      const allTasks = await prisma.agentTask.findMany({ where: { projectId: id } });
      if (allTasks.every(t => t.status === 'COMPLETED')) {
        await prisma.project.update({
          where: { id },
          data: { status: 'COMPLETED' },
        });
        
        // Generate Final 70% invoice
        const finalInvoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}-FINAL`;
        const amount = project.budget * 0.7;
        const tax = amount * 0.11;
        const total = amount + tax;

        await prisma.invoice.create({
          data: {
            projectId: id,
            invoiceNumber: finalInvoiceNumber,
            amount,
            tax,
            total,
            status: 'SENT',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            notes: 'Final 70% project delivery invoice',
          },
        });

        await prisma.activityLog.create({
          data: {
            projectId: id,
            userId: userId,
            action: 'PROJECT_COMPLETED',
            detail: 'All tasks approved. Project completed. Final invoice generated.',
          },
        });
      }
    }

    return res.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('PATCH /api/projects/:id/tasks/:taskId error:', error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
});

// ==========================================
// ── Briefs Endpoints ──
// ==========================================

// GET /api/briefs
app.get('/api/briefs', async (req, res) => {
  const { projectId } = req.query;
  try {
    const briefs = await prisma.brief.findMany({
      where: projectId ? { projectId: String(projectId) } : undefined,
      include: {
        project: {
          select: { id: true, title: true, client: { select: { name: true, email: true } } },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    const parsed = briefs.map((b) => ({
      ...b,
      requirements: JSON.parse(b.requirements),
      deliverables: JSON.parse(b.deliverables),
      dataSources: JSON.parse(b.dataSources),
    }));

    return res.json(parsed);
  } catch (error) {
    console.error('GET /api/briefs error:', error);
    return res.status(500).json({ error: 'Failed to fetch briefs' });
  }
});

// POST /api/briefs
app.post('/api/briefs', async (req, res) => {
  const data = req.body;
  try {
    let projectId = data.projectId;

    if (!projectId) {
      // Get the logged-in user from session cookie
      let clientId: string | undefined;
      const sessionCookie = req.cookies.session;
      if (sessionCookie) {
        try {
          const sessionData = typeof sessionCookie === 'string' ? JSON.parse(sessionCookie) : sessionCookie;
          clientId = sessionData.userId;
        } catch { /* ignore parse errors */ }
      }

      // Fallback to demo client if no session
      let client;
      if (clientId) {
        client = await prisma.user.findUnique({ where: { id: clientId } });
      }
      if (!client) {
        client = await prisma.user.findFirst({ where: { email: 'client@example.com' } });
      }
      if (!client) throw new Error('Client not found');

      const project = await prisma.project.create({
        data: {
          title: data.title || 'New Project',
          description: data.description || '',
          budget: data.budget || 0,
          status: 'BRIEFED',
          clientId: client.id,
        },
      });
      projectId = project.id;
    }

    const brief = await prisma.brief.create({
      data: {
        projectId: projectId,
        requirements: JSON.stringify(data.requirements || []),
        deliverables: JSON.stringify(data.deliverables || []),
        dataSources: JSON.stringify(data.dataSources || []),
        notes: data.notes || '',
        githubRepo: data.githubRepo || null,
        githubToken: data.githubToken || null,
        status: 'PENDING',
      },
    });

    if (data.projectId) {
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'BRIEFED' },
      });
    }

    return res.status(201).json(brief);
  } catch (error) {
    console.error('POST /api/briefs error:', error);
    return res.status(500).json({ error: 'Failed to create brief' });
  }
});

// ==========================================
// ── Invoices Endpoints ──
// ==========================================

// GET /api/invoices
app.get('/api/invoices', async (req, res) => {
  const { projectId } = req.query;
  try {
    const invoices = await prisma.invoice.findMany({
      where: projectId ? { projectId: String(projectId) } : undefined,
      include: {
        project: {
          select: { id: true, title: true, client: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(invoices);
  } catch (error) {
    console.error('GET /api/invoices error:', error);
    return res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// GET /api/invoices/:id
app.get('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        project: {
          include: { client: { select: { name: true, email: true } } }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.json(invoice);
  } catch (error) {
    console.error('GET /api/invoices/:id error:', error);
    return res.status(500).json({ error: 'Failed to fetch invoice details' });
  }
});

// Helper function to push code to GitHub
async function pushCodeToGitHub(repoUrl: string, token: string, projectId: string, userId: string) {
  try {
    const fsp = require('fs/promises');
    const os = require('os');
    const util = require('util');
    const execAsync = util.promisify(require('child_process').exec);

    let repoPath = repoUrl;
    if (repoUrl.includes('github.com')) {
      const parts = new URL(repoUrl).pathname.split('/').filter(Boolean);
      repoPath = `${parts[0]}/${parts[1]}`;
    }
    repoPath = repoPath.replace(/\.git$/, '');

    const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'agentflow-'));

    try {
      // 1. Generate boilerplate files
      await fsp.writeFile(path.join(tmpDir, 'package.json'), JSON.stringify({
        name: "agentflow-delivered-app",
        version: "1.0.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint"
        },
        dependencies: {
          next: "14.2.3",
          react: "^18",
          "react-dom": "^18"
        }
      }, null, 2));

      await fsp.writeFile(path.join(tmpDir, 'README.md'), `# Project Delivery\n\nThis fully-functional codebase was automatically provisioned and populated by **AgentFlow** after full payment confirmation.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nEnjoy your new application!`);
      await fsp.writeFile(path.join(tmpDir, '.gitignore'), `node_modules\n.next\n.env\n.env.local\n`);
      
      await fsp.mkdir(path.join(tmpDir, 'src'));
      await fsp.mkdir(path.join(tmpDir, 'src', 'app'), { recursive: true });
      
      await fsp.writeFile(path.join(tmpDir, 'src', 'app', 'layout.tsx'), `export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}`);
      await fsp.writeFile(path.join(tmpDir, 'src', 'app', 'page.tsx'), `export default function Home() {\n  return (\n    <main style={{ padding: '4rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>\n      <h1 style={{ color: '#065F46' }}>Welcome to your new App! 🚀</h1>\n      <p style={{ fontSize: '1.25rem', color: '#4B5563' }}>Successfully designed, built, and delivered by AgentFlow.</p>\n      <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#F3F4F6', borderRadius: '8px' }}>\n        <p><strong>Next steps:</strong> Start modifying <code>src/app/page.tsx</code> to see your changes instantly.</p>\n      </div>\n    </main>\n  );\n}`);

      // 2. Initialize Git and Push
      const gitUrl = `https://x-access-token:${token}@github.com/${repoPath}.git`;
      
      await execAsync('git init', { cwd: tmpDir });
      await execAsync('git config user.name "AgentFlow AI"', { cwd: tmpDir });
      await execAsync('git config user.email "bot@agentflow.ai"', { cwd: tmpDir });
      await execAsync('git checkout -b main', { cwd: tmpDir }).catch(() => {});
      await execAsync('git add .', { cwd: tmpDir });
      await execAsync('git commit -m "🚀 Initial full codebase delivery by AgentFlow"', { cwd: tmpDir });
      
      // Push
      await execAsync(`git push ${gitUrl} main --force`, { cwd: tmpDir });

      await prisma.activityLog.create({
        data: { 
          projectId, 
          userId, 
          action: 'GITHUB_PUSH_SUCCESS', 
          detail: `🚀 Authentic codebase successfully deployed to ${repoPath}` 
        }
      });
    } finally {
      await fsp.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    }
  } catch (error: any) {
    console.error("GitHub push failed:", error);
    await prisma.activityLog.create({
      data: { 
        projectId, 
        userId, 
        action: 'GITHUB_PUSH_FAILED', 
        detail: `❌ Failed to push code to GitHub: ${error.message}` 
      }
    });
    throw error;
  }
}

// PATCH /api/invoices/:id (Simulate payment)
app.patch('/api/invoices/:id', async (req, res) => {
  const { id } = req.params;
  const { status, paymentMethod } = req.body;
  try {
    if (status !== 'PAID') {
      return res.status(400).json({ error: 'Only transitions to PAID status are supported' });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { project: { include: { client: { select: { name: true, email: true } } } } }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.status === 'PAID') {
      return res.status(400).json({ error: 'Invoice is already paid' });
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paymentMethod: paymentMethod || null,
      },
      include: { project: { include: { client: { select: { name: true, email: true } } } } }
    });

    // Create an activity log indicating that payment was successfully received from the client
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const userId = admin?.id || invoice.project.clientId;

    const methodLabel = paymentMethod === 'CREDIT_CARD' ? 'Credit Card' 
      : paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' 
      : paymentMethod === 'E_WALLET' ? 'E-Wallet' 
      : 'Unknown';

    await prisma.activityLog.create({
      data: {
        projectId: invoice.projectId,
        userId: userId,
        action: 'INVOICE_PAID',
        detail: `💰 Payment of Rp ${invoice.total.toLocaleString('id')} received via ${methodLabel} for Invoice: ${invoice.invoiceNumber}`,
      }
    });

    // Check if ALL invoices for this project are now paid
    const allInvoices = await prisma.invoice.findMany({ where: { projectId: invoice.projectId } });
    const allPaid = allInvoices.length > 0 && allInvoices.every(inv => inv.status === 'PAID');

    if (allPaid) {
      const projectWithBrief = await prisma.project.findUnique({
        where: { id: invoice.projectId },
        include: { brief: true }
      });

      if (projectWithBrief?.brief?.githubRepo && projectWithBrief?.brief?.githubToken) {
        // Fire and forget (don't block the response)
        pushCodeToGitHub(
          projectWithBrief.brief.githubRepo, 
          projectWithBrief.brief.githubToken, 
          invoice.projectId, 
          userId
        );
      }
    }

    return res.json({ success: true, invoice: updatedInvoice });
  } catch (error) {
    console.error('PATCH /api/invoices/:id error:', error);
    return res.status(500).json({ error: 'Failed to process invoice payment' });
  }
});

// POST /api/projects/:id/retry-github-push
app.post('/api/projects/:id/retry-github-push', async (req, res) => {
  const { id } = req.params;
  const { githubRepo, githubToken } = req.body;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { brief: true }
    });
    
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Update the brief with the new credentials
    if (project.brief) {
      await prisma.brief.update({
        where: { projectId: id },
        data: { githubRepo, githubToken }
      });
    }

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const userId = admin?.id || project.clientId;

    try {
      await pushCodeToGitHub(githubRepo, githubToken, id, userId);
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'GitHub push failed again' });
    }
  } catch (error) {
    console.error('POST /api/projects/:id/retry-github-push error:', error);
    return res.status(500).json({ error: 'Failed to retry push' });
  }
});

// ==========================================
// ── Clients Endpoints ──
// ==========================================

// GET /api/clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: {
        id: true,
        name: true,
        email: true,
        locale: true,
        createdAt: true,
        _count: { select: { projects: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(clients);
  } catch (error) {
    console.error('GET /api/clients error:', error);
    return res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// ==========================================
// ── Agents/Tasks Endpoints ──
// ==========================================

// GET /api/agents (tasks list)
app.get('/api/agents', async (req, res) => {
  const { projectId } = req.query;
  try {
    const agents = await prisma.agentTask.findMany({
      where: projectId ? { projectId: String(projectId) } : undefined,
      include: {
        project: { select: { id: true, title: true, status: true } },
      },
      orderBy: { id: 'desc' },
    });
    return res.json(agents);
  } catch (error) {
    console.error('GET /api/agents error:', error);
    return res.status(500).json({ error: 'Failed to fetch agent tasks' });
  }
});

// ==========================================
// ── Analytics Endpoints ──
// ==========================================

// GET /api/analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const paidInvoices = await prisma.invoice.findMany({ where: { status: 'PAID' } });
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

    const pendingInvoices = await prisma.invoice.findMany({
      where: { status: { in: ['SENT', 'DRAFT'] } },
    });
    const pendingRevenue = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);

    const projectCounts = await prisma.project.groupBy({ by: ['status'], _count: true });
    const totalProjects = await prisma.project.count();
    const activeProjects = await prisma.project.count({
      where: { status: { in: ['IN_PROGRESS', 'REVIEW'] } },
    });
    const completedProjects = await prisma.project.count({
      where: { status: 'COMPLETED' },
    });

    const totalClients = await prisma.user.count({ where: { role: 'CLIENT' } });
    const taskCounts = await prisma.agentTask.groupBy({ by: ['agentType', 'status'], _count: true });
    const totalTasks = await prisma.agentTask.count();
    const completedTasks = await prisma.agentTask.count({ where: { status: 'COMPLETED' } });

    const recentActivity = await prisma.activityLog.findMany({
      include: {
        user: { select: { id: true, name: true } },
        project: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const monthlyRevenue = [
      { month: 'Jan', revenue: 12000000 },
      { month: 'Feb', revenue: 18000000 },
      { month: 'Mar', revenue: 25000000 },
      { month: 'Apr', revenue: 22000000 },
      { month: 'May', revenue: 45000000 },
      { month: 'Jun', revenue: 38000000 },
    ];

    return res.json({
      totalRevenue,
      pendingRevenue,
      totalProjects,
      activeProjects,
      completedProjects,
      totalClients,
      totalTasks,
      completedTasks,
      projectCounts,
      taskCounts,
      recentActivity,
      monthlyRevenue,
    });
  } catch (error) {
    console.error('GET /api/analytics error:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Express Backend Server running on http://localhost:${PORT}`);
});
