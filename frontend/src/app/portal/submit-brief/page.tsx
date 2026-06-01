'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const descriptionTemplates = [
  {
    category: "Customer Service Assistant",
    text: "An automated AI assistant designed to handle standard support inquiries, query an internal knowledge base, and integrate with CRM ticketing tools."
  },
  {
    category: "E-Commerce Shopping Assistant",
    text: "A smart shopping assistant that qualifies customer inquiries, recommends personalized products, handles cart questions, and increases conversion rates."
  },
  {
    category: "Operations & HR Portal",
    text: "An internal automation hub that coordinates staff scheduling, retrieves employee handbook guidelines, and simplifies onboarding processes."
  },
  {
    category: "Lead Capture & Marketing",
    text: "An interactive lead capture assistant designed to qualify website visitors, book demo meetings, and collect contacts for newsletter outreach."
  },
  {
    category: "Workflow & Project Tracker",
    text: "A collaborative project tracker that updates team tasks, sends alert pings, summarizes work streams, and organizes developer file scaffolds."
  },
  {
    category: "Fintech & Billing Hub",
    text: "An automated billing companion that processes transaction histories, generates invoices, reminds clients of due dates, and keeps audit records."
  }
];

const suggestionsPool: Record<string, { requirements: string[]; deliverables: string[] }> = {
  "Customer Service Assistant": {
    requirements: [
      "Set up SQLite database with Prisma schema for user sessions and tickets",
      "Build Express.js backend server with secure auth cookies",
      "Integrate OpenAI or Gemini API for message parser and responses",
      "Create responsive Next.js chatbot bubble interface",
      "Configure chat history storage and session retrieval",
      "Implement markdown support in chatbot responses",
      "Set up email notification triggers for unresolved tickets",
      "Establish Admin panel route to view live chat transcripts",
      "Ensure fast page load times using Next.js caching",
      "Configure CORS security middleware for restricted origins"
    ],
    deliverables: [
      "Folder scaffolding tree and codebase index files",
      "Prisma schema definitions and migrations",
      "Working API endpoint routes for chatbot exchanges",
      "Interactive Next.js chatbot component",
      "Automated test coverage log (Jest)",
      "Technical setup guide in README.md",
      "Docker compose configuration file",
      "Admin transcripts dashboard mock template",
      "GitHub actions deployment workflow file",
      "Performance metrics Lighthouse audit scorecard"
    ]
  },
  "E-Commerce Shopping Assistant": {
    requirements: [
      "Integrate product catalog query endpoints",
      "Create recommendation engine based on user preferences",
      "Establish secure checkout webhook routes (Stripe)",
      "Build shopping cart state management inside React",
      "Configure automated email cart abandonment reminders",
      "Enable multilingual support for product search queries",
      "Configure inventory check triggers in database",
      "Develop order confirmation receipt templates",
      "Optimize mobile styling viewports for smooth scrolling",
      "Secure payment processing credentials using dotenv"
    ],
    deliverables: [
      "Product recommendation logic script",
      "Stripe payment gateway integration configurations",
      "Interactive product catalog layout template",
      "Shopping cart components codebase",
      "Abandoned cart email automated templates",
      "Bilingual dictionary translations map",
      "Inventory sync webhook endpoint",
      "PDF Invoice generation module",
      "Fluid viewport mobile CSS files",
      "Security audit pre-launch report"
    ]
  },
  "Operations & HR Portal": {
    requirements: [
      "Design employee database schema with role permissions",
      "Configure onboarding checklist state tracking",
      "Develop staff calendar scheduling sync script",
      "Implement handbook search tool via database query",
      "Establish password reset authentication flow",
      "Integrate employee profile avatar image uploads",
      "Build HR announcement board endpoint routes",
      "Optimize team performance analytics charts",
      "Set up Slack webhook alerts for new staff signups",
      "Ensure secure cookie session handling for client logins"
    ],
    deliverables: [
      "Role-based permission middleware scripts",
      "Onboarding checklist dashboard UI design",
      "Calendar scheduling synchronization module",
      "Employee handbook database query files",
      "JWT/Session authentication handlers",
      "Profile photo file storage integration configurations",
      "Express announcement router files",
      "D3/Recharts analytics panel templates",
      "Slack notifications sync workflow file",
      "Security logs audit scorecard"
    ]
  },
  "Lead Capture & Marketing": {
    requirements: [
      "Configure lead qualification database schema",
      "Build email outreach automated template scheduler",
      "Integrate Google Calendar API for booking calls",
      "Create lead capture landing page components",
      "Establish conversion analytics group triggers",
      "Implement social media API webhook parsers",
      "Set up Discord alerts for high-value leads",
      "Optimize marketing copy headline visual tokens",
      "Ensure fast form submissions under 1 second",
      "Disable spam bot submissions using Captcha middleware"
    ],
    deliverables: [
      "Lead scoring logic script",
      "SendGrid email sequence schedules",
      "Google Calendar sync script",
      "Responsive landing page template files",
      "D3 conversion charts UI card",
      "Social media integration endpoint routers",
      "Discord notifications webhook YAML",
      "Brand aesthetic typography files",
      "Lighthouse performance audit scorecard",
      "Form validation check scripts"
    ]
  },
  "Workflow & Project Tracker": {
    requirements: [
      "Design project and task relational database tables",
      "Configure sequential task validation middleware",
      "Build real-time progress update WebSocket hooks",
      "Create drag-and-drop Kanban board layout",
      "Establish activity logs timeline recorder",
      "Implement task search filter criteria endpoints",
      "Set up desktop notification triggers for deadlocks",
      "Optimize CSS animations for task status shifts",
      "Ensure database transactions roll back on failure",
      "Secure project workspaces by clientId parameter"
    ],
    deliverables: [
      "Kanban board components codebase",
      "Prisma schema with cascading delete options",
      "Express project status endpoints",
      "Live activity log database recorder file",
      "Sequential task validation scripts",
      "Task query filter modules",
      "Push notification dispatch configurations",
      "Micro-animations visual layout files",
      "SQL transaction rollback tests",
      "Workspace validation handler files"
    ]
  },
  "Fintech & Billing Hub": {
    requirements: [
      "Design secure invoice and transaction schemas",
      "Build automated late payment reminder trigger",
      "Integrate tax rate calculation modules",
      "Create PDF invoice builder using react-pdf",
      "Establish secure checkout session endpoints",
      "Implement currency conversion helper functions",
      "Build financial revenue dashboard analytics routes",
      "Configure daily backup scripts for transaction logs",
      "Ensure strict encryption for payment data profiles",
      "Set up email attachments delivery integration"
    ],
    deliverables: [
      "Invoice model Prisma schema definition",
      "Automated email reminder script",
      "Tax calculation endpoint configurations",
      "Downloadable PDF generator modules",
      "Checkout session gateway files",
      "Currency conversion utility files",
      "Financial dashboard visual templates",
      "Automated DB backup shell scripts",
      "Data encryption security modules",
      "Email invoice dispatcher modules"
    ]
  }
};

function generateDescriptionIdeas(title: string, seed: number = 0): Array<{ category: string, text: string }> {
  const cleanTitle = title.trim() || "Project";
  const lowerTitle = cleanTitle.toLowerCase();
  
  const customize = (category: string, baseText: string) => {
    const customizedText = baseText
      .replace("An automated AI assistant", `A customized ${cleanTitle} system`)
      .replace("A smart shopping assistant", `An intelligent ${cleanTitle} assistant`)
      .replace("An internal automation hub", `A premium ${cleanTitle} hub`)
      .replace("An interactive lead capture assistant", `A dynamic ${cleanTitle} funnel`)
      .replace("A collaborative project tracker", `A professional ${cleanTitle} workflow`)
      .replace("An automated billing companion", `A secure ${cleanTitle} application`);
    return { category, text: customizedText };
  };

  const pool = descriptionTemplates.map(t => customize(t.category, t.text));
  const startIndex = (seed * 3) % pool.length;
  const selected = [];
  for (let i = 0; i < 3; i++) {
    selected.push(pool[(startIndex + i) % pool.length]);
  }
  return selected;
}

export default function SubmitBriefPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [ideaSeed, setIdeaSeed] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Customer Service Assistant");
  const [suggestionsSeed, setSuggestionsSeed] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: 5000,
    requirements: [''],
    deliverables: [''],
    dataSources: [''],
    notes: '',
    githubRepo: '',
    githubToken: '',
  });

  const getSuggestions = (type: 'requirements' | 'deliverables') => {
    const categoryPool = suggestionsPool[selectedCategory] || suggestionsPool["Customer Service Assistant"];
    const pool = categoryPool[type];
    const startIndex = (suggestionsSeed * 5) % pool.length;
    const selected = [];
    for (let i = 0; i < 5; i++) {
      selected.push(pool[(startIndex + i) % pool.length]);
    }
    return selected;
  };

  const handleArrayChange = (field: 'requirements' | 'deliverables' | 'dataSources', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'requirements' | 'deliverables' | 'dataSources') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'requirements' | 'deliverables' | 'dataSources', index: number) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/briefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit brief');
      }

      router.push('/portal?success=true');
      router.refresh(); // Refresh the portal to show the new project
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      alert('Failed to submit brief. Please try again.');
    }
  };


  return (
    <div className="fade-in">
      <div className="topbar-breadcrumb" style={{ marginBottom: 'var(--space-lg)' }}>
        <Link href="/portal">← Back to Portal</Link>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Submit New Brief</h1>
          <p className="page-subtitle">Tell us about your project requirements.</p>
        </div>
      </div>

      <div className="brief-form">
        <div className="brief-steps">
          <div className={`brief-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="brief-step-number">1</div>
            <div className="brief-step-label">Overview</div>
          </div>
          <div className="brief-step-line" />
          <div className={`brief-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="brief-step-number">2</div>
            <div className="brief-step-label">Details</div>
          </div>
          <div className="brief-step-line" />
          <div className={`brief-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            <div className="brief-step-number">3</div>
            <div className="brief-step-label">Review</div>
          </div>
        </div>

        {step === 1 && (
          <div className="brief-section slide-in-left">
            <h2 className="brief-section-title">Project Overview</h2>
            
            <div className="input-group mb-md">
              <label className="input-label">Project Title</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. AI Customer Support Chatbot"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            {formData.title.trim().length > 2 && (
              <div className="mb-md fade-in" style={{ padding: 'var(--space-md)', background: 'var(--surface-warm)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--primary-light)', boxSizing: 'border-box' }}>
                <div className="flex justify-between items-center mb-sm">
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>✨ AI Description Ideas Generator</span>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm" 
                    style={{ padding: '2px 8px', fontSize: '0.75rem', height: 'auto', border: '1px solid var(--primary-light)', background: '#fff' }}
                    onClick={() => setIdeaSeed(prev => prev + 1)}
                  >
                    🔄 Regenerate Ideas
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {generateDescriptionIdeas(formData.title, ideaSeed).map((idea, index) => {
                    const isSelected = formData.description === idea.text;
                    return (
                      <div 
                        key={index} 
                        style={{
                          padding: '10px 12px',
                          background: isSelected ? '#FFFBEB' : '#FFFFFF',
                          border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          fontSize: '0.8125rem',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                        }}
                        onClick={() => {
                          setFormData({ ...formData, description: idea.text });
                          setSelectedCategory(idea.category);
                        }}
                        className="card-interactive"
                      >
                        <div style={{ fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-primary)', marginBottom: 2, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          💡 Option {index + 1}: {idea.category}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>{idea.text}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            
            <div className="input-group mb-md">
              <label className="input-label">Description</label>
              <textarea 
                className="input" 
                placeholder="Describe the main goal of this project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            
            <div className="input-group mb-md">
              <label className="input-label">Estimated Budget (USD)</label>
              <input 
                type="number" 
                className="input" 
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              />
            </div>

            <div className="input-group mb-md">
              <label className="input-label">GitHub Repository URL (Optional)</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. https://github.com/rafiimafif/chat-bot"
                value={formData.githubRepo}
                onChange={(e) => setFormData({ ...formData, githubRepo: e.target.value })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4, display: 'block' }}>
                If provided, we will automatically push scaffolded project files directly to this repository.
              </span>
            </div>
            
            <div className="input-group mb-xl">
              <label className="input-label">GitHub Personal Access Token (Optional)</label>
              <input 
                type="password" 
                className="input" 
                placeholder="ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                value={formData.githubToken}
                onChange={(e) => setFormData({ ...formData, githubToken: e.target.value })}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4, display: 'block' }}>
                Required to securely authenticate and push commits to your repository.
              </span>
            </div>

            <div className="flex justify-end">
              <button 
                className="btn btn-primary" 
                onClick={() => setStep(2)}
                disabled={!formData.title}
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="brief-section slide-in-left">
            <h2 className="brief-section-title">Requirements & Deliverables</h2>
            
            <div className="mb-lg">
              <label className="input-label mb-sm" style={{ display: 'block' }}>Key Requirements</label>
              
              {/* AI suggested requirements */}
              <div className="mb-md p-md" style={{ background: 'var(--surface-warm)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--primary-light)', boxSizing: 'border-box' }}>
                <div className="flex justify-between items-center mb-xs">
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>✨ AI Suggested Requirements (Top 5)</span>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm" 
                    style={{ padding: '2px 8px', fontSize: '0.7rem', height: 'auto', border: '1px solid var(--primary-light)', background: '#fff' }}
                    onClick={() => setSuggestionsSeed(prev => prev + 1)}
                  >
                    🔄 Shuffler
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {getSuggestions('requirements').map((suggestion, index) => {
                    const isAdded = formData.requirements.includes(suggestion);
                    return (
                      <button 
                        key={index}
                        type="button"
                        style={{
                          padding: '4px 10px',
                          background: isAdded ? 'var(--primary-light)' : '#fff',
                          color: isAdded ? 'var(--primary)' : 'var(--text-primary)',
                          border: '1px solid var(--primary-light)',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                          textAlign: 'left',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => {
                          if (isAdded) {
                            setFormData({
                              ...formData,
                              requirements: formData.requirements.filter(r => r !== suggestion)
                            });
                          } else {
                            const cleanReqs = formData.requirements.filter(Boolean);
                            setFormData({
                              ...formData,
                              requirements: [...cleanReqs, suggestion]
                            });
                          }
                        }}
                      >
                        {isAdded ? '✅' : '➕'} {suggestion}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.requirements.map((req, i) => (
                <div key={i} className="flex gap-sm mb-sm items-center">
                  <input 
                    type="text" 
                    className="input" 
                    value={req}
                    onChange={(e) => handleArrayChange('requirements', i, e.target.value)}
                  />
                  <button className="btn btn-ghost btn-icon" onClick={() => removeArrayItem('requirements', i)}>✕</button>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => addArrayItem('requirements')}>+ Add Requirement</button>
            </div>

            <div className="mb-lg">
              <label className="input-label mb-sm" style={{ display: 'block' }}>Expected Deliverables</label>
              
              {/* AI suggested deliverables */}
              <div className="mb-md p-md" style={{ background: 'var(--surface-warm)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--primary-light)', boxSizing: 'border-box' }}>
                <div className="flex justify-between items-center mb-xs">
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>✨ AI Suggested Deliverables (Top 5)</span>
                  <button 
                    type="button" 
                    className="btn btn-ghost btn-sm" 
                    style={{ padding: '2px 8px', fontSize: '0.7rem', height: 'auto', border: '1px solid var(--primary-light)', background: '#fff' }}
                    onClick={() => setSuggestionsSeed(prev => prev + 1)}
                  >
                    🔄 Shuffler
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {getSuggestions('deliverables').map((suggestion, index) => {
                    const isAdded = formData.deliverables.includes(suggestion);
                    return (
                      <button 
                        key={index}
                        type="button"
                        style={{
                          padding: '4px 10px',
                          background: isAdded ? 'var(--primary-light)' : '#fff',
                          color: isAdded ? 'var(--primary)' : 'var(--text-primary)',
                          border: '1px solid var(--primary-light)',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                          textAlign: 'left',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => {
                          if (isAdded) {
                            setFormData({
                              ...formData,
                              deliverables: formData.deliverables.filter(d => d !== suggestion)
                            });
                          } else {
                            const cleanDels = formData.deliverables.filter(Boolean);
                            setFormData({
                              ...formData,
                              deliverables: [...cleanDels, suggestion]
                            });
                          }
                        }}
                      >
                        {isAdded ? '✅' : '➕'} {suggestion}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.deliverables.map((del, i) => (
                <div key={i} className="flex gap-sm mb-sm items-center">
                  <input 
                    type="text" 
                    className="input" 
                    value={del}
                    onChange={(e) => handleArrayChange('deliverables', i, e.target.value)}
                  />
                  <button className="btn btn-ghost btn-icon" onClick={() => removeArrayItem('deliverables', i)}>✕</button>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => addArrayItem('deliverables')}>+ Add Deliverable</button>
            </div>

            <div className="flex justify-between">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Review Brief →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="brief-section slide-in-left">
            <h2 className="brief-section-title">Review & Submit</h2>
            
            <div className="card mb-lg" style={{ padding: 'var(--space-md)' }}>
              <div className="mb-md">
                <div className="text-sm text-secondary">Title</div>
                <div className="font-bold">{formData.title}</div>
              </div>
              <div className="mb-md">
                <div className="text-sm text-secondary">Description</div>
                <div>{formData.description}</div>
              </div>
              {formData.githubRepo && (
                <div className="mb-md">
                  <div className="text-sm text-secondary">GitHub Repository</div>
                  <div style={{ fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600 }}>{formData.githubRepo}</div>
                </div>
              )}
              <div className="mb-md">
                <div className="text-sm text-secondary">Requirements</div>
                <ul style={{ paddingLeft: 20 }}>
                  {formData.requirements.filter(Boolean).map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>

            <div className="flex justify-between">
              <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Brief 🚀'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
