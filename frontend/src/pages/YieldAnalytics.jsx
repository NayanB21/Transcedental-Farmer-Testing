import React, { useEffect, useState } from "react";
import API from "../utils/api";
import ReactMarkdown from "react-markdown";
import polygonToGeoJson from "../utils/polygonToGeoJson";
import HealthChart from "../components/HealthChart";

export default function YieldAnalytics({ farm, report, onBack }) {
  const [timeline, setTimeline] = useState([]);
  const [yieldData, setYieldData] = useState(report?.yieldData || null);
  const [aiAnalysis, setAiAnalysis] = useState(report?.aiAnalysis || "");
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const downloadReport = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`${API}/api/report/farm-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: farm.farmer.crop,
          village: farm.landRecord.village,
          healthScore: timeline.length > 0 ? timeline[timeline.length - 1].healthScore : 0,
          predictedYield: yieldData?.predictedYield || 0,
          analysis: aiAnalysis,
        }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "FarmReport.pdf";
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const geoJson = polygonToGeoJson(farm.polygon);
    setTimelineLoading(true);

    fetch(`${API}/api/timeline/healthScore`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farmId: farm._id, geoJson }),
    })
      .then((res) => res.json())
      .then((data) => {
        const arrayToMap = data.points || data.timeline || data || [];
        const enriched = arrayToMap.map((point) => ({
          ...point,
          healthScore: Number(point.healthScore.toFixed(2)),
          date: new Date(point.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        }));
        setTimeline(enriched);
        setYieldData(report?.yieldData);
        setAiAnalysis(report?.aiAnalysis);
        setTimelineLoading(false);
      })
      .catch((err) => { console.error(err); setTimelineLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farm]);

  const score = report?.recommendations?.score;
  const scoreBadgeClass = score >= 75 ? "badge--green" : score >= 50 ? "badge--gold" : "badge--red";

  return (
    <div className="page-wrapper">
      <nav className="topbar">
        <div className="topbar__brand"><span>🌾</span> Transcedental Farmers</div>
        <button className="btn-back" onClick={onBack}>← Farm Details</button>
      </nav>

      <div className="container animate-in">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header__eyebrow">📈 Analytics</div>
          <h1 className="page-header__title">Yield Analytics</h1>
          <p className="page-header__sub">AI-powered yield predictions and historical health trends for your farm.</p>
        </div>

        {/* Farm Snapshot */}
        <div className="card animate-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)" }}>
          <div>
            <h2 style={{ marginBottom: "4px" }}>
              {farm.farmer.crop?.charAt(0).toUpperCase() + farm.farmer.crop?.slice(1)} — {farm.landRecord.village}
            </h2>
            <p style={{ margin: 0, fontSize: "0.875rem" }}>Farmer: <strong style={{ color: "var(--clr-text)" }}>{farm.farmer.name}</strong></p>
          </div>
          {score != null && (
            <div className={`badge ${scoreBadgeClass}`} style={{ fontSize: "0.9rem", padding: "6px 14px", fontWeight: 700 }}>
              Health: {score} / 100
            </div>
          )}
        </div>

        {/* Yield Prediction */}
        {yieldData ? (
          <div className="card animate-in animate-in-delay-1">
            <div className="section-label">Expected Yield Prediction</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--clr-text-muted)", marginBottom: "6px" }}>
                  Predicted Yield
                </div>
                <div className="yield-big">{yieldData.predictedYield}</div>
                <div style={{ color: "var(--clr-text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>Quintal / Acre</div>
              </div>
              <div style={{ padding: "var(--space-md)", background: "var(--clr-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--clr-border)" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--clr-text-muted)", marginBottom: "6px" }}>
                  District Average
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.5rem", color: "var(--clr-text-secondary)" }}>
                  {yieldData.avgYield}
                </div>
                <div style={{ color: "var(--clr-text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>Quintal / Acre</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card animate-in animate-in-delay-1">
            <div className="loading-state">
              <span className="spinner"></span>
              Loading yield prediction…
            </div>
          </div>
        )}

        {/* Health Timeline Chart */}
        <div className="card animate-in animate-in-delay-2">
          <h2>📅 Health Score Timeline</h2>
          {timelineLoading ? (
            <div className="loading-state">
              <span className="spinner"></span>
              Loading historical data…
            </div>
          ) : timeline.length > 0 ? (
            <HealthChart data={timeline} />
          ) : (
            <p style={{ color: "var(--clr-text-muted)" }}>No timeline data available for this farm.</p>
          )}
        </div>

        {/* AI Yield Analysis */}
        <div className="card animate-in animate-in-delay-3">
          <h2>🤖 AI Yield Analysis</h2>
          {aiAnalysis ? (
            <div style={{ lineHeight: "1.8", color: "var(--clr-text-secondary)" }}>
              <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
            </div>
          ) : (
            <div className="loading-state">
              <span className="spinner"></span>
              Generating AI analysis…
            </div>
          )}
        </div>

        {/* Download Report */}
        <div className="card animate-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)" }}>
          <div>
            <h2 style={{ marginBottom: "4px" }}>📄 Farm Report</h2>
            <p style={{ margin: 0, fontSize: "0.875rem" }}>
              Download a complete PDF report with health scores, yield predictions, and AI analysis.
            </p>
          </div>
          <button
            className="primary"
            onClick={downloadReport}
            disabled={downloading}
            style={{ opacity: downloading ? 0.75 : 1, justifyContent: "center" }}
          >
            {downloading ? (
              <><span className="spinner" style={{ borderTopColor: "#052e12" }}></span> Generating PDF…</>
            ) : (
              "⬇ Download PDF Report"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
