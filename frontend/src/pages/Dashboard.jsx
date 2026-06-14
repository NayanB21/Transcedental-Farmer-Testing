import React from "react";

export default function Dashboard({ user, onLogout, onRegisterFarm, onMyFarms }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="page-wrapper">
      {/* Top Navigation Bar */}
      <nav className="topbar">
        <div className="topbar__brand">
          <span>🌾</span>
          Transcedental Farmers
        </div>
        <div className="topbar__actions">
          <div className="badge badge--green">● Live</div>
          <button className="btn-danger" onClick={onLogout} style={{ padding: "7px 14px", fontSize: "0.8125rem" }}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="container animate-in">
        {/* Hero Welcome Section */}
        <div style={{ padding: "var(--space-xl) 0 var(--space-lg)" }}>
          <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--clr-primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>
            👨‍🌾 {greeting}
          </div>
          <h1 style={{ marginBottom: "6px" }}>
            Welcome back, {user.name}
          </h1>
          <p style={{ color: "var(--clr-text-muted)", fontSize: "0.9rem" }}>
            📞 {user.phone} &nbsp;·&nbsp; Manage your farms and view AI-powered insights below.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-md)", marginBottom: "var(--space-xl)" }}>
          {/* Register Farm */}
          <div
            className="card card--interactive animate-in animate-in-delay-1"
            onClick={onRegisterFarm}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onRegisterFarm()}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-md)", lineHeight: 1 }}>🗺️</div>
            <h2 style={{ marginBottom: "var(--space-xs)" }}>Register New Farm</h2>
            <p style={{ marginBottom: "var(--space-md)", fontSize: "0.875rem" }}>
              Map your farm boundary on satellite imagery and save it to the cloud.
            </p>
            <div className="badge badge--green">+ Add Farm</div>
          </div>

          {/* My Farms */}
          <div
            className="card card--interactive animate-in animate-in-delay-2"
            onClick={onMyFarms}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onMyFarms()}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-md)", lineHeight: 1 }}>🌿</div>
            <h2 style={{ marginBottom: "var(--space-xs)" }}>My Farms</h2>
            <p style={{ marginBottom: "var(--space-md)", fontSize: "0.875rem" }}>
              View satellite analytics, crop health scores, and AI recommendations.
            </p>
            <div className="badge badge--sky">View Farms →</div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="section-label">Platform Features</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-md)" }}>
          {[
            { icon: "🛰️", label: "Satellite NDVI", desc: "Real-time vegetation index" },
            { icon: "🤖", label: "AI Assistant", desc: "Hindi & English support" },
            { icon: "📈", label: "Yield Prediction", desc: "ML-based forecasting" },
            { icon: "📄", label: "PDF Reports", desc: "Downloadable farm reports" },
          ].map((f, i) => (
            <div
              key={i}
              className={`stat-card animate-in animate-in-delay-${i + 1}`}
            >
              <div className="stat-card__icon">{f.icon}</div>
              <div className="stat-card__label">{f.label}</div>
              <div className="stat-card__sub">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}