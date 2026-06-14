// src/pages/FarmRegistration.jsx
import React, { useState } from "react";
import API from "../utils/api";
import FarmerForm from "../components/FarmerForm";
import CadastralForm from "../components/CadastralForm";
import LocationSearch from "../components/LocationSearch";
import MapSelector from "../components/MapSelector";

const bhuvanWms = {
  url: "https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wms?",
  layers: "basemap:WB_Vill",
  format: "image/png",
  transparent: true,
  version: "1.1.1",
  opacity: 0.8,
};

export default function FarmRegistration({ user, onBack }) {
  const [farmer, setFarmer] = useState({
    name: "",
    phone: "",
    village: "",
    crop: "",
    cropStage: "",
  });

  const [landRecord, setLandRecord] = useState({
    state: "West Bengal",
    district: "",
    tehsil: "",
    village: "",
  });

  const [farmLocation, setFarmLocation] = useState(null);
  const [farmPolygon, setFarmPolygon] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [saved, setSaved] = useState(false);

  const saveToCloud = async () => {
    if (
      !farmer.name ||
      !farmer.phone ||
      !farmer.crop ||
      !farmLocation ||
      farmPolygon.length < 3
    ) {
      alert("Fill all fields and draw polygon.");
      return;
    }

    try {
      const payload = {
        farmer,
        landRecord,
        location: { lat: farmLocation.lat, lng: farmLocation.lng },
        polygon: farmPolygon,
        boundarySource: "farmer_drawn_polygon",
      };

      const response = await fetch(`${API}/api/farms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save");
      setSaved(true);
      alert("Saved to MongoDB");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-wrapper">
      <nav className="topbar">
        <div className="topbar__brand"><span>🌾</span> Transcedental Farmers</div>
        <button className="btn-back" onClick={onBack}>← Dashboard</button>
      </nav>

      <div className="container animate-in">
        <div className="page-header">
          <div className="page-header__eyebrow">➕ New Farm</div>
          <h1 className="page-header__title">Register Farm</h1>
          <p className="page-header__sub">
            Fill in farm details, search your village, then draw your farm boundary on the map.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-xl)", flexWrap: "wrap" }}>
          {["1. Farmer Details", "2. Land Location", "3. Find Village", "4. Draw & Save"].map((step, i) => (
            <div
              key={i}
              className="badge badge--green"
              style={{ fontSize: "0.75rem", opacity: 0.8 }}
            >
              {step}
            </div>
          ))}
        </div>

        <FarmerForm
          value={farmer}
          onChange={setFarmer}
          onEdit={() => setSaved(false)}
        />

        <CadastralForm
          value={landRecord}
          onChange={setLandRecord}
          onEdit={() => setSaved(false)}
        />

        <LocationSearch
          onLocationFound={(location) => {
            setMapCenter(location);
            setFarmLocation(location);
          }}
        />

        <div className="card">
          <h2>🗺️ Farm Boundary</h2>
          <p style={{ fontSize: "0.875rem", marginBottom: "var(--space-md)" }}>
            Use the polygon tool (top-right of map) to draw your farm's boundary. The map will fly to your searched village.
          </p>
          <MapSelector
            center={mapCenter}
            polygon={farmPolygon}
            onPolygonChange={setFarmPolygon}
            onSave={saveToCloud}
            saved={saved}
            value={farmLocation}
            onChange={(location) => {
              setSaved(false);
              setFarmLocation(location);
            }}
            wms={bhuvanWms}
          />
        </div>
      </div>
    </div>
  );
}
