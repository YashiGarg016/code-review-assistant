import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { FileResult } from "../types/types"

interface Props {
  results: FileResult[]
}

function riskColor(score: number) {
  if (score >= 60) return "#ef4444"
  if (score >= 30) return "#f59e0b"
  return "#22c55e"
}

export default function RiskChart({ results }: Props) {
  const data = results.map(f => ({
    name: f.path.split("/").pop(),   // just the filename
    score: f.metrics.risk_score,
    fullPath: f.path
  }))

  return (
    <div className="risk-chart">
      <h3>Risk Score by File</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
          <XAxis
            dataKey="name"
            angle={-35}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value) => [`${value}`, "Risk Score"]}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullPath || ""}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={riskColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}