# AgentFlow

**AgentFlow** is an MVP web application designed for a futuristic "AI-Powered Service Agency." It simulates an environment where human project managers collaborate with autonomous AI agents (for Research, Coding, Automation, and Content) to deliver projects for clients. 

The platform offers a dual-sided experience:
1. **Admin Dashboard:** For agency owners to manage projects, monitor AI agent tasks, review analytics, and generate invoices.
2. **Client Portal:** For clients to submit project briefs, track real-time progress of their AI-powered workstreams, and view their invoices.

---

## 🚀 Core Features

- **Project & Agent Tracking:** Visualize project pipelines and monitor the specific progress of different AI Agents (e.g., "Competitor Analysis" by the Research Agent).
- **Client Portal:** A dedicated interface (`/portal`) where clients can submit detailed project briefs via a multi-step form and monitor their project's milestones.
- **Invoice & PDF Generation:** Built-in billing system that allows admins to track invoices and generate downloadable PDF documents using `@react-pdf/renderer`.
- **Custom Authentication:** A lightweight, cookie-based session system separating `ADMIN` and `CLIENT` roles.
- **Bilingual Support:** A foundational UI setup to support toggling between English (EN) and Indonesian (ID).
- **Premium UI:** A custom, token-based design system featuring glassmorphism, micro-animations, and a warm color palette (Orange/Cream) built with pure CSS (no Tailwind required).

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router) with TypeScript |
| **Backend** | [Express.js](https://expressjs.com/) with TypeScript |
| **Database** | SQLite managed via [Prisma ORM](https://www.prisma.io/) |
| **PDF Generation** | `@react-pdf/renderer` |
| **Containerization** | Docker Compose (separate frontend & backend containers) |

---

## 🏗️ Architecture

The project is split into two separate services:

```text
ai-agent-service/
├── backend/               # Express.js API server (port 5000)
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema and models
│   │   ├── seed.ts        # Mock data seeding script
│   │   └── dev.db         # SQLite database file
│   ├── src/
│   │   ├── server.ts      # Express server with all API routes
│   │   ├── lib/prisma.ts  # Prisma client singleton
│   │   └── middleware/     # Auth middleware
│   └── Dockerfile.backend
│
├── frontend/              # Next.js UI (port 3000)
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   │   ├── dashboard/ # Admin Dashboard pages
│   │   │   ├── portal/    # Client Portal pages
│   │   │   ├── login/     # Login page
│   │   │   └── register/  # Registration page
│   │   ├── components/    # Reusable UI & layout components
│   │   ├── lib/           # Utility functions (formatting)
│   │   ├── types/         # TypeScript domain models
│   │   └── proxy.ts       # Next.js proxy for route protection
│   ├── next.config.ts     # Rewrites /api/* → backend:5000
│   └── Dockerfile
│
└── docker-compose.yml     # Orchestrates both services
```

### Communication Flow:
- Frontend serves UI on `http://localhost:3000`
- Frontend proxies all `/api/*` requests to the backend via Next.js rewrites
- Backend handles all business logic, database operations, and authentication

---

## 🏗️ Database Models

- **User**: Represents either an `ADMIN` (agency owner) or a `CLIENT`.
- **Project**: The overarching deliverable tied to a specific client.
- **Brief**: The initial requirements document submitted by the client.
- **AgentTask**: Individual work items assigned to specific AI Agent types (e.g., `RISET`, `CODING`, `AUTOMASI`).
- **Invoice**: Billing records linked to a project.
- **ActivityLog**: An audit trail of actions taken on the platform.

---

## 💻 Running Locally (Development Mode)

### Prerequisites
- Node.js (v18+)
- npm

### Setup

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Initialize Backend Database:**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the Backend Server (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

5. **Start the Frontend Server (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

6. **Access the App:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.
   - **Admin Login:** `admin@agentflow.com` / `password123`
   - **Client Login:** `client@example.com` / `password123`

---

## 🐳 Running with Docker Compose (Production Mode)

1. **Build and Start:**
   ```bash
   docker-compose up --build -d
   ```

2. **Access the App:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

3. **Stop:**
   ```bash
   docker-compose down
   ```

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@agentflow.com` | `password123` |
| Client | `client@example.com` | `password123` |

You can also register new client accounts via the registration page.
