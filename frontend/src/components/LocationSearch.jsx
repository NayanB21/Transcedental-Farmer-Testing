import React, { useState } from "react";

export default function LocationSearch({ onLocationFound }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const searchLocation = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data.length === 0) {
        alert("Location not found. Try a more specific name.");
        return;
      }
      const result = data[0];
      onLocationFound({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    } catch (err) {
      console.error(err);
      alert("Error searching location.");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchLocation();
  };

  return (
    <div className="card animate-in">
      <div className="section-label">Step 3 — Find Your Village</div>
      <h2>🔍 Search Village / Location</h2>
      <p style={{ marginBottom: "var(--space-md)", fontSize: "0.875rem" }}>
        Type your village name to fly the map to your location.
      </p>
      <div style={{ display: "flex", gap: "var(--space-sm)" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Mohanpur, Paschim Medinipur, West Bengal"
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
        />
        <button
          className="primary"
          onClick={searchLocation}
          disabled={searching || !query.trim()}
          style={{ whiteSpace: "nowrap", opacity: (searching || !query.trim()) ? 0.75 : 1 }}
        >
          {searching ? (
            <><span className="spinner" style={{ borderTopColor: "#052e12" }}></span> Searching…</>
          ) : (
            "Search 🔍"
          )}
        </button>
      </div>
    </div>
  );
}