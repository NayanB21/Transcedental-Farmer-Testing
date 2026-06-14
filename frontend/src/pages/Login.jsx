import React, { useState } from "react";
import API from "../utils/api";

export default function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!phone || !password) {
      alert("Please enter phone and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="auth-section animate-in">
      <div className="auth-section__header">
        <div className="auth-section__eyebrow">👨‍🌾 Returning Farmer</div>
        <div className="auth-section__title">Sign in to your account</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <label>
          Phone Number
          <input
            placeholder="Your registered phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            onKeyDown={handleKeyDown}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </label>

        <button
          className="primary"
          onClick={login}
          disabled={loading}
          style={{ marginTop: "8px", justifyContent: "center", opacity: loading ? 0.75 : 1 }}
        >
          {loading ? (
            <><span className="spinner" style={{ borderTopColor: "#052e12" }}></span> Signing in…</>
          ) : (
            "Sign In →"
          )}
        </button>
      </div>
    </div>
  );
}