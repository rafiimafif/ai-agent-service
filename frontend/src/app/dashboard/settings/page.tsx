export default function SettingsPage() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your AgentFlow preferences.</p>
        </div>
      </div>

      <div style={{ maxWidth: 640 }}>
        {/* Profile Section */}
        <div className="card card-body" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Profile</h3>
          <div className="flex items-center gap-lg mb-lg">
            <div className="avatar avatar-xl" style={{ background: 'var(--gradient-primary)', fontSize: '1.5rem' }}>
              AR
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Ahmad Rizki</div>
              <div style={{ color: 'var(--text-secondary)' }}>admin@agentflow.id</div>
              <span className="badge mt-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>Admin</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card card-body" style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Preferences</h3>

          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="input-label">Language</label>
            <select className="input select" defaultValue="id">
              <option value="id">🇮🇩 Bahasa Indonesia</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="input-label">Currency</label>
            <select className="input select" defaultValue="IDR">
              <option value="IDR">IDR — Indonesian Rupiah</option>
              <option value="USD">USD — US Dollar</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Tax Rate</label>
            <input className="input" type="number" defaultValue={11} min={0} max={100} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Default: 11% PPN Indonesia
            </span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card card-body" style={{ border: '1px solid var(--danger)', borderColor: 'rgba(220,38,38,0.2)' }}>
          <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--danger)' }}>Danger Zone</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
            These actions are destructive and cannot be undone.
          </p>
          <button className="btn btn-danger btn-sm">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
