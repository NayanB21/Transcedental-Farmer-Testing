import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const color = val >= 75 ? "#22c55e" : val >= 50 ? "#f59e0b" : "#f87171";
    return (
      <div style={{
        background: "#162418",
        border: "1px solid rgba(34,197,94,0.25)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        fontFamily: "Inter, sans-serif",
      }}>
        <div style={{ color: "#a7c4a8", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>{label}</div>
        <div style={{ color, fontWeight: 800, fontSize: "18px" }}>{val}</div>
        <div style={{ color: "#5d8a60", fontSize: "11px" }}>Health Score</div>
      </div>
    );
  }
  return null;
};

export default function HealthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(34,197,94,0.1)"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tick={{ fill: "#5d8a60", fontSize: 11, fontFamily: "Inter, sans-serif" }}
          axisLine={{ stroke: "rgba(34,197,94,0.15)" }}
          tickLine={false}
        />

        <YAxis
          ticks={[0, 20, 40, 60, 80, 100]}
          domain={[0, 100]}
          tick={{ fill: "#5d8a60", fontSize: 11, fontFamily: "Inter, sans-serif" }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} />

        {/* Reference lines for thresholds */}
        <ReferenceLine y={75} stroke="rgba(34,197,94,0.3)" strokeDasharray="4 4" />
        <ReferenceLine y={50} stroke="rgba(245,158,11,0.3)" strokeDasharray="4 4" />

        <Area
          type="monotone"
          dataKey="healthScore"
          stroke="#22c55e"
          strokeWidth={2.5}
          fill="url(#healthGradient)"
          dot={{ fill: "#22c55e", stroke: "#0a1a0f", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "#4ade80", stroke: "#22c55e", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}