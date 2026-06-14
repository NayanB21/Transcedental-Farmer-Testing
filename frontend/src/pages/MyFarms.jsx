import React, { useEffect, useState } from "react";
import API from "../utils/api";

export default function MyFarms({ user, onBack, onFarmSelect }) {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("USER:", user);
    setLoading(true);
    fetch(`${API}/api/farms/user/${user._id}`)
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
          return;
        }
        return res.json();
      })
      .then((data) => {
        console.log("MY FARMS RESPONSE:", data);
        setFarms(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const cropEmoji = (crop) => {
    const map = { wheat: "🌾", maize: "🌽", jute: "🌿", paddy: "🌾", rice: "🌾", potato: "🥔" };
    return map[crop?.toLowerCase()] || "🌱";
  };

  return (
    <div className="page-wrapper">
      <nav className="topbar">
        <div className="topbar__brand"><span>🌾</span> Transcedental Farmers</div>
        <button className="btn-back" onClick={onBack}>← Dashboard</button>
      </nav>

      <div className="container animate-in">
        <div className="page-header">
          <div className="page-header__eyebrow">🌿 Your Portfolio</div>
          <h1 className="page-header__title">My Farms</h1>
          <p className="page-header__sub">Click on a farm to view satellite analytics, health reports, and AI advice.</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <span className="spinner"></span>
            Loading your farms…
          </div>
        ) : farms.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "var(--space-3xl)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "var(--space-md)" }}>🌱</div>
            <h3>No farms registered yet</h3>
            <p style={{ maxWidth: "280px", margin: "0 auto var(--space-lg)" }}>
              Go back to the dashboard and register your first farm to get started.
            </p>
            <button className="btn-secondary" onClick={onBack}>← Back to Dashboard</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-md)" }}>
            {farms.map((farm, i) => (
              <div
                key={farm._id}
                className={`card card--interactive animate-in animate-in-delay-${Math.min(i + 1, 4)}`}
                onClick={() => onFarmSelect(farm)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
                  <div style={{ fontSize: "2rem", lineHeight: 1 }}>
                    {cropEmoji(farm.farmer?.crop)}
                  </div>
                  <div className="badge badge--green">View Details →</div>
                </div>

                <h3 style={{ fontSize: "1.125rem", marginBottom: "var(--space-xs)" }}>
                  {farm.farmer?.crop
                    ? farm.farmer.crop.charAt(0).toUpperCase() + farm.farmer.crop.slice(1)
                    : "Farm"}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "var(--space-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--clr-text-muted)" }}>Village</span>
                    <span style={{ color: "var(--clr-text-secondary)", fontWeight: 500 }}>
                      {farm.landRecord?.village || "—"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--clr-text-muted)" }}>District</span>
                    <span style={{ color: "var(--clr-text-secondary)", fontWeight: 500 }}>
                      {farm.landRecord?.district || "—"}
                    </span>
                  </div>
                  {farm.farmer?.cropStage && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "var(--clr-text-muted)" }}>Stage</span>
                      <div className="badge badge--gold" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                        {farm.farmer.cropStage}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
