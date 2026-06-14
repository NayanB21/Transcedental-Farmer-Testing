// src/components/FarmerForm.jsx
import React from "react";

export default function FarmerForm({ value, onChange, onEdit }) {
  const handle = (e) => {
    onEdit?.(); // prevents that crash completely.
    onChange({ ...value, [e.target.name]: e.target.value });
  };

  return (
    <div className="card animate-in">
      <div className="section-label">Step 1 — Farmer Information</div>
      <h2>👨‍🌾 Farmer Details</h2>

      <div className="grid">
        <label>
          Full Name
          <input
            name="name"
            value={value.name || ""}
            onChange={handle}
            placeholder="Farmer's full name"
          />
        </label>

        <label>
          Phone Number
          <input
            name="phone"
            value={value.phone || ""}
            onChange={handle}
            placeholder="10-digit mobile"
            type="tel"
          />
        </label>

        <label>
          Village
          <input
            name="village"
            value={value.village || ""}
            onChange={handle}
            placeholder="Farmer's village"
          />
        </label>

        <label>
          Crop Type
          <select name="crop" value={value.crop || ""} onChange={handle}>
            <option value="">Select crop…</option>
            <option value="wheat">🌾 Wheat (गेहूँ)</option>
            <option value="maize">🌽 Maize (मक्का)</option>
            <option value="jute">🌿 Jute (जूट)</option>
            <option value="paddy">🌾 Paddy / Rice (धान)</option>
            <option value="potato">🥔 Potato (आलू)</option>
          </select>
        </label>

        <label>
          Crop Stage
          <select name="cropStage" value={value.cropStage || ""} onChange={handle}>
            <option value="">Select stage…</option>
            <option value="sowing">🌱 Sowing (बुवाई)</option>
            <option value="vegetative">🌿 Vegetative (मध्यम)</option>
            <option value="flowering">🌸 Flowering (फूल आना)</option>
            <option value="grain">🌾 Grain (फ़सल आना)</option>
            <option value="harvest">🚜 Harvest (फ़सल काटना)</option>
          </select>
        </label>
      </div>
    </div>
  );
}