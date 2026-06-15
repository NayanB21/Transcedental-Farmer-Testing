import React, { useState } from "react";
import API from "../utils/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const signup = async () => {
    if (!form.name || !form.phone || !form.password) {
      alert("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", phone: "", password: "" });
        setTimeout(() => setSuccess(false), 4000);
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-section animate-in">
      <div className="auth-section__header">
        <div className="auth-section__eyebrow">🌱 New Account</div>
        <div className="auth-section__title">Create your account</div>
      </div>

      {success && (
        <div className="ok" style={{ marginBottom: "16px" }}>
          ✅ Account created! You can now sign in.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <label>
          Full Name
          <input
            placeholder="e.g. Ramesh Kumar"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label>
          Phone Number
          <input
            placeholder="10-digit mobile number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            type="tel"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>

        <button
          className="primary"
          onClick={signup}
          disabled={loading}
          style={{ marginTop: "8px", justifyContent: "center", opacity: loading ? 0.75 : 1 }}
        >
          {loading ? (
            <><span className="spinner" style={{ borderTopColor: "#052e12" }}></span> Creating account…</>
          ) : (
            "Create Account →"
          )}
        </button>
      </div>
    </div>
  );
}