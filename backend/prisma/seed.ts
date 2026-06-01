import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Check if data already exists — if so, skip seeding to preserve user data
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log(`Database already has ${existingUsers} user(s). Skipping seed to preserve existing data.`);
    return;
  }

  // Clean existing data (only runs on a truly fresh database)
  await prisma.activityLog.deleteMany();
  await prisma.agentTask.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.brief.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@agentflow.com',
      password: passwordHash,
      role: 'ADMIN',
      locale: 'id',
    },
  });

  const client1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'client@example.com',
      password: passwordHash,
      role: 'CLIENT',
      locale: 'en',
    },
  });

  // Create Project
  const project1 = await prisma.project.create({
    data: {
      title: 'E-commerce Redesign & AI Integration',
      description: 'Redesign existing e-commerce and add AI product recommendations.',
      status: 'IN_PROGRESS',
      budget: 15000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      clientId: client1.id,
    },
  });

  // Create Brief
  await prisma.brief.create({
    data: {
      projectId: project1.id,
      requirements: JSON.stringify([
        'Modern minimalist design',
        'AI-based product recommendation engine',
        'Mobile-first approach',
      ]),
      deliverables: JSON.stringify([
        'Figma UI/UX designs',
        'Next.js Frontend code',
        'Recommendation API integration',
      ]),
      dataSources: JSON.stringify([
        'Existing user behavior logs',
        'Product catalog database',
      ]),
      notes: 'Please focus on conversion rate optimization.',
      status: 'ACCEPTED',
    },
  });

  // Create Agent Tasks
  await prisma.agentTask.createMany({
    data: [
      {
        projectId: project1.id,
        agentType: 'RISET',
        title: 'Competitor UI Analysis',
        description: 'Analyze top 5 competitor e-commerce sites for UI/UX trends.',
        status: 'COMPLETED',
        progress: 100,
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project1.id,
        agentType: 'CODING',
        title: 'Frontend Scaffolding',
        description: 'Set up Next.js 15 project with Tailwind and components.',
        status: 'IN_PROGRESS',
        progress: 60,
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project1.id,
        agentType: 'AUTOMASI',
        title: 'Recommendation Engine Setup',
        description: 'Connect to external AI API for recommendations.',
        status: 'PENDING',
        progress: 0,
      },
    ],
  });

  // Create Invoice
  await prisma.invoice.create({
    data: {
      projectId: project1.id,
      invoiceNumber: 'INV-202405-0001',
      amount: 5000,
      tax: 550,
      total: 5550,
      status: 'SENT',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      notes: 'Initial 30% deposit',
    },
  });

  // Create Activity Logs
  await prisma.activityLog.create({
    data: {
      projectId: project1.id,
      userId: admin.id,
      action: 'PROJECT_CREATED',
      detail: 'Project "E-commerce Redesign" created',
    },
  });

  await prisma.activityLog.create({
    data: {
      projectId: project1.id,
      userId: client1.id,
      action: 'BRIEF_SUBMITTED',
      detail: 'Client submitted the project brief',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
