// src/App.js
import React, { useState } from "react";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FarmRegistration from "./pages/FarmRegistration";
import MyFarms from "./pages/MyFarms";
import FarmDetails from "./pages/FarmDetails";
import YieldAnalytics from "./pages/YieldAnalytics";

import "./App.css";

/**
 * Helper: returns an array (or single object) of WMS configs for a given state key.
 * For Madhya Pradesh we provide a candidate MP WebGIS WMS base URL (you'll fetch exact layer name next).
 * Fallback: Bhuvan (village/admin) WMS for pan-India coverage.
 * ------------this commenting was of previous logic of integrating all open street,mp bhulekh and bhuvan
 */

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [authTab, setAuthTab] = useState("login"); // "login" | "signup"

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  if (user) {
    if (page === "register") {
      return (
        <FarmRegistration
          user={user}
          onBack={() => setPage("dashboard")}
        />
      );
    }

    if (page === "farmdetails") {
      return (
        <FarmDetails
          farm={selectedFarm}
          onBack={() => setPage("myfarms")}
          onYieldAnalytics={(farm, report) => {
            setSelectedFarm(farm);
            setSelectedReport(report);
            setPage("yieldanalytics");
          }}
        />
      );
    }

    if (page === "yieldanalytics") {
      return (
        <YieldAnalytics
          farm={selectedFarm}
          report={selectedReport}
          onBack={() => setPage("farmdetails")}
        />
      );
    }

    if (page === "myfarms") {
      return (
        <MyFarms
          user={user}
          onBack={() => setPage("dashboard")}
          onFarmSelect={(farm) => {
            setSelectedFarm(farm);
            setPage("farmdetails");
          }}
        />
      );
    }

    return (
      <Dashboard
        user={user}
        onRegisterFarm={() => setPage("register")}
        onMyFarms={() => setPage("myfarms")}
        onLogout={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }}
      />
    );
  }

  /* ─── AUTH PAGE ─── */
  return (
    <div className="auth-layout">
      {/* Left Hero Panel */}
      <div className="auth-hero">
        <div className="auth-hero__badge">🌾</div>
        <h2 className="auth-hero__title">
          Smart Farming with <span>AI Intelligence</span>
        </h2>
        <p className="auth-hero__desc">
          Register your farm, monitor crop health via satellite, and get
          AI-powered yield predictions in real time.
        </p>
        <div className="auth-hero__features">
          {[
            { icon: "🛰️", text: "Satellite NDVI & Crop Health Monitoring" },
            { icon: "🤖", text: "AI Farm Assistant (Hindi / English)" },
            { icon: "📈", text: "Yield Prediction & Analytics" },
            { icon: "🗺️", text: "Farm Boundary Mapping Tool" },
          ].map((f, i) => (
            <div key={i} className="auth-hero__feature">
              <div className="auth-hero__feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="auth-panel">
        {/* Tab Switcher */}
        <div
          style={{
            maxWidth: 380,
            margin: "0 auto 28px",
            width: "100%",
            display: "flex",
            background: "var(--clr-surface)",
            border: "1px solid var(--clr-border)",
            borderRadius: "var(--radius-md)",
            padding: "4px",
            gap: "4px",
          }}
        >
          {["login", "signup"].map((tab) => (
            <button
              key={tab}
              onClick={() => setAuthTab(tab)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9rem",
                fontWeight: 600,
                background: authTab === tab
                  ? "linear-gradient(135deg, var(--clr-primary), var(--clr-primary-dark))"
                  : "transparent",
                color: authTab === tab ? "#052e12" : "var(--clr-text-secondary)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                justifyContent: "center",
              }}
            >
              {tab === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {authTab === "login" ? (
          <Login onLogin={setUser} />
        ) : (
          <>
            <Signup />
            <p style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "0.875rem",
              color: "var(--clr-text-muted)",
            }}>
              Already have an account?{" "}
              <span
                onClick={() => setAuthTab("login")}
                style={{ color: "var(--clr-primary)", cursor: "pointer", fontWeight: 600 }}
              >
                Sign in
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
