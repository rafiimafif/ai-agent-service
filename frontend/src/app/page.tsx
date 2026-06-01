import Link from "next/link";
import { AGENT_INFO } from "@/types";
import type { AgentType } from "@/types";

const agentTypes: AgentType[] = [
  "RISET",
  "CODING",
  "AUTOMASI",
  "KONTEN",
  "SUPPORT",
];

export default function LandingPage() {
  return (
    <>
      {/* ── Navigation ── */}
      <nav className="landing-nav" id="landing-nav">
        <Link href="/" className="landing-nav-logo">
          AgentFlow
        </Link>
        <ul className="landing-nav-links">
          <li>
            <a href="#process">How It Works</a>
          </li>
          <li>
            <a href="#agents">AI Agents</a>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <Link href="/login" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </li>
        </ul>
      </nav>

      {/* ── Hero Section ── */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div>
            <div className="hero-badge">
              <span>⚡</span> AI-Powered Service Agency
            </div>
            <h1 className="hero-title">
              Supercharge Your Business with{" "}
              <span>AI Agent Teams</span>
            </h1>
            <p className="hero-desc">
              From research to coding, automation to content — our specialized
              AI agents handle the heavy lifting so you can focus on growing your
              business. Accept briefs, track progress, and deliver results.
            </p>
            <div className="hero-actions">
              <Link href="/login" className="btn btn-primary btn-lg">
                🚀 Start a Project
              </Link>
              <a href="#process" className="btn btn-secondary btn-lg" style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.05)" }}>
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual">
            <div className="hero-card-stack">
              {/* Floating dashboard preview cards */}
              <div className="hero-float-card float" style={{ marginBottom: "16px" }}>
                <div className="flex items-center gap-md" style={{ marginBottom: "12px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "var(--radius-lg)", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📊</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Revenue Dashboard</div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Real-time analytics</div>
                  </div>
                </div>
                <div className="flex gap-md">
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-md)", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>Rp 45M</div>
                    <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)" }}>This Month</div>
                  </div>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-md)", padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#10B981" }}>+27%</div>
                    <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.4)" }}>Growth</div>
                  </div>
                </div>
              </div>

              <div className="hero-float-card" style={{ animationDelay: "0.5s", animation: "float 3s ease-in-out 0.5s infinite" }}>
                <div className="flex items-center gap-md" style={{ marginBottom: "8px" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🔍</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>Research Agent</div>
                    <div style={{ fontSize: "0.75rem", color: "#10B981" }}>Completed • Market Analysis</div>
                  </div>
                </div>
                <div className="progress" style={{ height: 6 }}>
                  <div className="progress-bar" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process Section ── */}
      <section className="section section-center" id="process">
        <div className="section-header">
          <div className="section-badge">✨ Simple Process</div>
          <h2 className="section-title">How AgentFlow Works</h2>
          <p className="section-desc">
            Three simple steps to delegate your work to our AI agent teams and
            get professional results delivered.
          </p>
        </div>

        <div className="process-grid">
          <div className="process-step card card-interactive">
            <div className="process-step-number">1</div>
            <h3>Submit Your Brief</h3>
            <p>
              Tell us what you need — research, coding, automation, content, or
              support. Our system captures your requirements in detail.
            </p>
          </div>

          <div className="process-step card card-interactive">
            <div className="process-step-number">2</div>
            <h3>AI Agents Get to Work</h3>
            <p>
              Our specialized AI agents are assigned to your project. Track their
              progress in real-time through your dashboard.
            </p>
          </div>

          <div className="process-step card card-interactive">
            <div className="process-step-number">3</div>
            <h3>Review & Receive</h3>
            <p>
              Review the deliverables, request revisions if needed, and receive
              your final output. Pay securely through invoicing.
            </p>
          </div>
        </div>
      </section>

      {/* ── AI Agents Section ── */}
      <section className="section section-center" id="agents" style={{ background: "var(--surface)" }}>
        <div className="section-header">
          <div className="section-badge">🤖 Meet the Team</div>
          <h2 className="section-title">Our AI Agent Specialists</h2>
          <p className="section-desc">
            Five specialized AI agents, each an expert in their domain, working
            together to deliver exceptional results.
          </p>
        </div>

        <div className="agent-showcase-grid">
          {agentTypes.map((type) => {
            const agent = AGENT_INFO[type];
            return (
              <div key={type} className="agent-showcase-card">
                <div
                  className="agent-showcase-icon"
                  style={{ background: `${agent.color}15` }}
                >
                  {agent.icon}
                </div>
                <div className="agent-showcase-name">{agent.name}</div>
                <div className="agent-showcase-desc">{agent.description}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Pricing / CTA Section ── */}
      <section className="cta-section" id="pricing">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Scale with AI?</h2>
          <p className="cta-desc">
            Join businesses already using AgentFlow to delegate work to AI agent
            teams. Start your first project today — no commitment required.
          </p>
          <div className="flex justify-center gap-md">
            <Link href="/register" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="btn btn-lg"
              style={{
                border: "1.5px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.9)",
                background: "transparent",
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} AgentFlow. Built with AI-powered agents.</p>
      </footer>
    </>
  );
}
