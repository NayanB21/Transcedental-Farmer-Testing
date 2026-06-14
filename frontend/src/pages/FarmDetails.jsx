import React, { useEffect, useState } from "react";
import API from "../utils/api";
import * as turf from "@turf/turf";
import ReactMarkdown from "react-markdown";
import polygonToGeoJson from "../utils/polygonToGeoJson";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function FarmDetails({ farm, onBack, onYieldAnalytics }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [report, setReport] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState("hi-IN");
  const [reportLoading, setReportLoading] = useState(true);

  const polygonPositions = farm.polygon.map((point) => [point.lat, point.lng]);

  let areaSqm = 0, areaAcres = 0, areaHectares = 0;
  if (farm.polygon && farm.polygon.length >= 3) {
    const coordinates = farm.polygon.map((p) => [p.lng, p.lat]);
    coordinates.push(coordinates[0]);
    const polygon = turf.polygon([coordinates]);
    const geoJson = polygonToGeoJson(farm.polygon);
    console.log(geoJson);
    areaSqm = turf.area(polygon);
    areaAcres = areaSqm / 4046.86;
    areaHectares = areaSqm / 10000;
  }

  useEffect(() => {
    const geoJson = polygonToGeoJson(farm.polygon);
    setReportLoading(true);

    fetch(`${API}/api/analytics/farm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farmId: farm._id, geoJson, crop: farm.farmer.crop }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("ANALYTICS RESPONSE:", data);
        setReport(data);
        setReportLoading(false);
      })
      .catch((err) => { console.error(err); setReportLoading(false); });

    fetch(`${API}/api/chats/${farm._id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [farm]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech Recognition not supported in this browser."); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = speechLanguage;
    setListening(true);
    recognition.start();
    recognition.onresult = (event) => setQuestion(event.results[0][0].transcript);
    recognition.onerror = (event) => { console.error(event); setListening(false); };
    recognition.onend = () => setListening(false);
  };

  const askAssistant = async () => {
    if (!question.trim()) return;
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmId: farm._id,
          crop: farm.farmer.crop,
          analytics: report.analytics,
          stresses: report.stresses,
          question,
        }),
      });
      const data = await response.json();
      setAnswer(data.answer);
      setQuestion("");
      const chats = await fetch(`${API}/api/chats/${farm._id}`);
      const history = await chats.json();
      setMessages(history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  console.log("REPORT =", report);
  console.log("MESSAGES =", messages);
  console.log("FARM =", farm);

  // Derive score color
  const score = report?.recommendations?.score;
  const scoreBadgeClass = score >= 75 ? "badge--green" : score >= 50 ? "badge--gold" : "badge--red";

  // NDVI bar width helper (NDVI is typically -1 to 1, map to 0-100%)
  const ndviPct = (v) => Math.max(0, Math.min(100, ((v + 1) / 2) * 100));

  return (
    <div className="page-wrapper">
      <nav className="topbar">
        <div className="topbar__brand"><span>🌾</span> Transcedental Farmers</div>
        <button className="btn-back" onClick={onBack}>← My Farms</button>
      </nav>

      <div className="container animate-in">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header__eyebrow">📋 Farm Overview</div>
          <h1 className="page-header__title">Farm Details</h1>
        </div>

        {/* Farm Info Card */}
        <div className="card animate-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "var(--space-md)" }}>
            <div>
              <h2 style={{ marginBottom: "4px" }}>
                {farm.farmer.crop?.charAt(0).toUpperCase() + farm.farmer.crop?.slice(1)} Farm
              </h2>
              <p style={{ margin: 0, fontSize: "0.875rem" }}>Farmer: <strong style={{ color: "var(--clr-text)" }}>{farm.farmer.name}</strong></p>
            </div>
            {farm.farmer.cropStage && (
              <div className={`badge badge--gold`}>🌱 {farm.farmer.cropStage}</div>
            )}
          </div>

          <div className="divider" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-sm)" }}>
            {[
              { label: "Village", value: farm.landRecord.village },
              { label: "District", value: farm.landRecord.district },
              { label: "Area (sq m)", value: areaSqm.toFixed(1) },
              { label: "Area (acres)", value: areaAcres.toFixed(3) },
              { label: "Area (ha)", value: areaHectares.toFixed(3) },
            ].map((m) => (
              <div key={m.label}>
                <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--clr-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "1rem", fontWeight: 700, color: "var(--clr-text)" }}>
                  {m.value || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Farm Map */}
        <div className="card animate-in animate-in-delay-1">
          <h2>🗺️ Farm Boundary</h2>
          <div className="map-wrapper">
            <MapContainer
              center={polygonPositions[0]}
              zoom={17}
              style={{ height: "350px", width: "100%" }}
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Esri"
              />
              <TileLayer
                url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                attribution="Esri Labels"
              />
              <Polygon
                positions={polygonPositions}
                pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.2, weight: 2 }}
              />
            </MapContainer>
          </div>
        </div>

        {/* Satellite Analytics */}
        {reportLoading ? (
          <div className="card animate-in animate-in-delay-2">
            <div className="loading-state">
              <span className="spinner"></span>
              Fetching satellite analytics…
            </div>
          </div>
        ) : report && (
          <div className="card animate-in animate-in-delay-2">
            <h2>🛰️ Satellite Analytics</h2>
            {[
              { label: "NDVI (Vegetation)", key: "ndvi", tip: "Normalized Difference Vegetation Index", pct: ndviPct },
              { label: "NDRE (Chlorophyll)", key: "ndre", tip: "Normalized Difference Red Edge", pct: ndviPct },
              { label: "NDWI (Water)", key: "ndwi", tip: "Normalized Difference Water Index", pct: ndviPct },
              { label: "MSI (Moisture Stress)", key: "msi", tip: "Moisture Stress Index", pct: (v) => Math.max(0, Math.min(100, v * 50)) },
            ].map(({ label, key, tip, pct }) => (
              <div key={key} style={{ marginBottom: "var(--space-md)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--clr-text)" }}>{label}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", marginLeft: "6px" }}>{tip}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--clr-accent)", fontSize: "0.9375rem" }}>
                    {report?.analytics?.[key]?.toFixed(3) ?? "—"}
                  </span>
                </div>
                <div className="index-bar">
                  <div className="index-bar__fill" style={{ width: `${pct(report?.analytics?.[key] ?? 0)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Health Score & Recommendations */}
        {report && (
          <div className="card animate-in animate-in-delay-3">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
              <h2 style={{ marginBottom: 0 }}>🌿 Crop Health Report</h2>
              <div className={`badge ${scoreBadgeClass}`} style={{ fontSize: "0.9rem", padding: "6px 14px", fontWeight: 700 }}>
                {score ?? "--"} / 100
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
              <div style={{ padding: "var(--space-md)", background: "var(--clr-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--clr-border)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Health Status
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1rem", color: "var(--clr-text)" }}>
                  {report?.recommendations?.health || "—"}
                </div>
              </div>
              <div style={{ padding: "var(--space-md)", background: "var(--clr-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--clr-border)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--clr-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  Risk Level
                </div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1rem", color: score < 50 ? "var(--clr-coral)" : "var(--clr-text)" }}>
                  {report?.recommendations?.risk || "—"}
                </div>
              </div>
            </div>

            <div className="section-label">Recommendations</div>
            <ul>
              {report?.recommendations?.recommendations?.map((item, index) => (
                <li key={index} style={{ paddingBlock: "4px" }}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Stress Detection */}
        {report && (
          <div className="card animate-in animate-in-delay-4">
            <h2>⚠️ Stress Detection</h2>
            {report.stresses?.length > 0 ? (
              <ul>
                {report.stresses.map((stress, index) => (
                  <li key={index} style={{ paddingBlock: "4px", color: "var(--clr-gold)" }}>{stress}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "var(--clr-primary)" }}>✅ No significant stresses detected.</p>
            )}
          </div>
        )}

        {/* Crop Specific Advice */}
        {report && (
          <div className="card animate-in">
            <h2>🌾 Crop-Specific Advice</h2>
            <ul>
              {report.cropAdvice?.map((item, index) => (
                <li key={index} style={{ paddingBlock: "4px" }}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Farm Assistant */}
        {report && (
          <div className="card animate-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
              <h2 style={{ marginBottom: 0 }}>🤖 Farm AI Assistant</h2>
              <button
                className="btn-secondary"
                onClick={() => setShowHistory(!showHistory)}
                style={{ fontSize: "0.8125rem", padding: "6px 14px" }}
              >
                {showHistory ? "Hide" : "Show"} Chat History
              </button>
            </div>

            {showHistory && messages?.length > 0 && (
              <div className="chat-container">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`chat-bubble chat-bubble--${msg.role === "user" ? "user" : "ai"}`}
                  >
                    <div className="chat-bubble__label">
                      {msg.role === "user" ? "You" : "🤖 AI"}
                    </div>
                    <div className="chat-bubble__content">
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showHistory && messages?.length === 0 && (
              <p style={{ fontSize: "0.875rem", color: "var(--clr-text-muted)", marginBottom: "var(--space-md)" }}>
                No chat history yet. Ask your first question below!
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <label>
                Language for Voice Input
                <select
                  value={speechLanguage}
                  onChange={(e) => setSpeechLanguage(e.target.value)}
                >
                  <option value="hi-IN">🇮🇳 Hindi</option>
                  <option value="en-US">🇺🇸 English</option>
                  <option value="bn-IN">🇮🇳 Bengali</option>
                </select>
              </label>

              <label>
                Your Question
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  placeholder="Ask about your crop, soil, irrigation, fertilizers…"
                />
              </label>

              <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                <button
                  className="btn-secondary"
                  onClick={startListening}
                  style={{ flex: "0 0 auto" }}
                >
                  {listening ? "🎙️ Listening…" : "🎤 Speak"}
                </button>
                <button
                  className="primary"
                  onClick={askAssistant}
                  disabled={loading || !question.trim()}
                  style={{ flex: 1, justifyContent: "center", opacity: (loading || !question.trim()) ? 0.75 : 1 }}
                >
                  {loading ? (
                    <><span className="spinner" style={{ borderTopColor: "#052e12" }}></span> Analyzing…</>
                  ) : (
                    "Ask AI Assistant →"
                  )}
                </button>
              </div>
            </div>

            {answer && (
              <div style={{ marginTop: "var(--space-md)" }}>
                <div className="section-label">AI Response</div>
                <div className="chat-bubble chat-bubble--ai" style={{ maxWidth: "100%" }}>
                  <div className="chat-bubble__label">🤖 AI</div>
                  <div className="chat-bubble__content" style={{ maxWidth: "100%" }}>
                    <ReactMarkdown>{answer}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Yield Analytics CTA */}
        <div className="card animate-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-md)" }}>
          <div>
            <h2 style={{ marginBottom: "4px" }}>📈 Yield Prediction</h2>
            <p style={{ margin: 0, fontSize: "0.875rem" }}>
              View detailed yield forecasts, health timeline, and download your PDF report.
            </p>
          </div>
          <button
            className="primary"
            onClick={() => onYieldAnalytics(farm, report)}
          >
            View Yield Analytics →
          </button>
        </div>
      </div>
    </div>
  );
}
