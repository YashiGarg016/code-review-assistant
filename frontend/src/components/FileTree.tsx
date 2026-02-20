import type { FileResult } from "../types/types"

interface Props {
  results: FileResult[]
  selected: FileResult | null
  onSelect: (file: FileResult) => void
}

function riskColor(score: number) {
  if (score >= 60) return "#ef4444"   // red
  if (score >= 30) return "#f59e0b"   // yellow
  return "#22c55e"                     // green
}

function riskLabel(score: number) {
  if (score >= 60) return "HIGH"
  if (score >= 30) return "MEDIUM"
  return "LOW"
}

export default function FileTree({ results, selected, onSelect }: Props) {
  return (
    <div className="file-tree">
      <h3>Files by Risk</h3>
      {results.map(file => (
        <div
          key={file.path}
          className={`file-item ${selected?.path === file.path ? "active" : ""}`}
          onClick={() => onSelect(file)}
        >
          <span className="file-path">{file.path}</span>
          <span className="lang-badge">
            {file.language === "python" ? "🐍" :
            file.language === "typescript" ? "🔷" : "🟡"}
            </span>
                    <span
            className="risk-badge"
            style={{ background: riskColor(file.metrics.risk_score) }}
          >
            {riskLabel(file.metrics.risk_score)} {file.metrics.risk_score}
          </span>
        </div>
      ))}
    </div>
  )
}