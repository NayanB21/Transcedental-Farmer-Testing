// src/components/MapSelector.jsx
import React, { useState, useEffect } from "react";
//useState is built-in React function called a Hook(special fn name
// start with use__ for state/lifecycle management). It give your
//  functional components an internal memory so they can remember,
//  track, and change data over time.

//useEffect is a React Hook used to synchronize your component
//with outside systems or trigger actions automatically when data changes.
import { MapContainer, TileLayer, Marker, WMSTileLayer, useMapEvents, useMap, FeatureGroup } from "react-leaflet";

import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import L from "leaflet";//core leaflet lib as name L
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) { onPick(e.latlng); }
  });
  return null;
}

/* Renders WMS layers but only when zoom >= layer.minZoom (if provided) */
function WMSLayers({ wmsList }) {
  const map = useMap();
  const zoom = map.getZoom();
  return (
    <>
      {Array.isArray(wmsList) && wmsList.map((w, i) => {  //array/wmslist stores the custom&detailed gov data layer defined downwards
        const shouldRender = (typeof w.minZoom === "number") ? zoom >= w.minZoom : true;
        if (!shouldRender) return null;
        return (
          <WMSTileLayer
            key={i}
            url={w.url}
            layers={w.layers}
            format={w.format || "image/png"}
            transparent={w.transparent ?? true}
            version={w.version || "1.3.0"}
            opacity={w.opacity ?? 0.7}
            eventHandlers={{
              loading: () => console.log("Loading WMS"),
              load: () => console.log("Loaded WMS"),
            }}
            // optional bbox or tileSize may be passed inside w if needed
          />
        );
      })}
    </>
  );
}

function FlyToLocation({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(
        [center.lat, center.lng],
        17,
        { duration: 2 }
      );
    }
  }, [center, map]);
  return null;
}

export default function MapSelector({
  center = null,
  polygon = null,
  onPolygonChange = () => {},
  initialCenter = [22.9734, 78.6569], // India-ish center
  initialZoom = 6,
  value = null,
  onChange = () => {},
  onSave = () => {},
  saved = false,
  height = "420px",
  wms = null,
}) {
  const [picked, setPicked] = useState(value);
  useEffect(() => setPicked(value), [value]);

  const handlePick = (latlng) => {
    setPicked(latlng);
    onChange(latlng);
  };

  const handlePolygonCreated = (e) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0];
    const polygonCoords = latlngs.map((point) => ({
      lat: point.lat,
      lng: point.lng
    }));
    onPolygonChange(polygonCoords);
    console.log("Polygon Saved:", polygonCoords);
  };

  // normalize wms to array
  const wmsList = wms ? (Array.isArray(wms) ? wms : [wms]) : [];

  return (
    <div>
      {/* Map */}
      <div className="map-wrapper" style={{ height }}>
        <MapContainer
          center={
            center
              ? [center.lat, center.lng]
              : picked
                ? [picked.lat, picked.lng]
                : initialCenter
          }
          zoom={picked ? 14 : initialZoom}
          style={{ height: "100%", width: "100%" }}
        >
          <FlyToLocation center={center} />

          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Esri"
          />

          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            attribution="Esri Labels"
          />

          <WMSLayers wmsList={wmsList} />
          {/* //Plugs in your other layers on top of the base map........
          // not needed actually since we have only one layer wms={bhuvanWms} if needed*/}

          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handlePolygonCreated}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false
              }}
            />
          </FeatureGroup>

          <ClickHandler onPick={handlePick} />
          {/* //click listner */}
          {picked && <Marker position={[picked.lat, picked.lng]} />}
        </MapContainer>
      </div>

      {/* Map Footer */}
      <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        {picked ? (
          <div className="badge badge--green" style={{ alignSelf: "flex-start", fontSize: "0.8rem" }}>
            📍 Selected: {picked.lat.toFixed(6)}, {picked.lng.toFixed(6)}
          </div>
        ) : (
          <div className="alert-warning">
            <span>⚠️</span>
            <span>
              <strong>Disclaimer:</strong> The land boundaries shown here are for reference purposes only.
              Official and legally valid records are available on the state Bhulekh / Bhunaksha portals and government offices.
            </span>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", flexWrap: "wrap" }}>
          <button
            className="primary"
            onClick={onSave}
            style={{ flex: "0 0 auto" }}
          >
            💾 Save Registration
          </button>

          {saved && (
            <div className="ok">
              ✅ Saved to MongoDB Atlas!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
