// import type { FileResult } from "../types/types"

// function renderMarkdown(text: string): string {
//   return text
//     .replace(/^## (.+)$/gm, '<h4 class="md-h4">$1</h4>')
//     .replace(/^### (.+)$/gm, '<h5 class="md-h5">$1</h5>')
//     .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
//     .replace(/`(.+?)`/g, '<code class="md-code">$1</code>')
//     .replace(/^(\d+)\.\s(.+)$/gm, '<div class="md-li-num"><span class="md-num">$1.</span> $2</div>')
//     .replace(/^\*\s(.+)$/gm, '<div class="md-li">• $1</div>')
//     .replace(/^\-\s(.+)$/gm, '<div class="md-li">• $1</div>')
//     .replace(/^(?!<[hd]).+$/gm, (line) => line.trim() ? `<p class="md-p">${line}</p>` : '')
//     .replace(/\n{2,}/g, '')
// }

// function riskColor(score: number) {
//   if (score >= 60) return "#ef4444"
//   if (score >= 30) return "#f59e0b"
//   return "#22c55e"
// }

// export default function CodeViewer({ file }: { file: FileResult }) {
//   const { metrics, security, ast } = file

//   return (
//     <div className="code-viewer">
//       <h3>{file.path}</h3>

//       {/* LLM Explanation */}
//         {file.explanation && (
//         <div className="explanation-block">
//             <div className="explanation-header">
//             <span>🤖 AI Code Review</span>
//             <span
//                 className="verdict-badge"
//                 style={{
//                 background:
//                     file.explanation.verdict === "GREEN" ? "#14532d" :
//                     file.explanation.verdict === "RED"   ? "#450a0a" : "#422006",
//                 color:
//                     file.explanation.verdict === "GREEN" ? "#22c55e" :
//                     file.explanation.verdict === "RED"   ? "#ef4444" : "#f59e0b",
//                 }}
//             >
//                 {file.explanation.verdict}
//             </span>
//             </div>
//             <div
//             className="explanation-text"
//             dangerouslySetInnerHTML={{ __html: 
//                 file.explanation.explanation
//                 .replace(/## (.*)/g, "<h4>$1</h4>")
//                 .replace(/\n/g, "<br/>")
//             }}
//             />
//         </div>
//         )}

//       {/* Metrics Summary */}
//       <div className="metrics-grid">
//         <div className="metric-card">
//           <span className="metric-label">Risk Score</span>
//           <span className="metric-value" style={{ color: riskColor(metrics.risk_score) }}>
//             {metrics.risk_score}
//           </span>
//         </div>
//         <div className="metric-card">
//           <span className="metric-label">Avg Complexity</span>
//           <span className="metric-value">{metrics.avg_complexity}</span>
//         </div>
//         <div className="metric-card">
//           <span className="metric-label">Maintainability</span>
//           <span className="metric-value">{metrics.maintainability_index}</span>
//         </div>
//         <div className="metric-card">
//           <span className="metric-label">Total Lines</span>
//           <span className="metric-value">{metrics.total_lines}</span>
//         </div>
//       </div>

//       {/* Bug Prediction */}
//         <div className="bug-prediction">
//         <span className="bp-label">🤖 ML Bug Prediction</span>
//         <span
//             className="bp-score"
//             style={{ color: file.bug_prediction.is_likely_buggy ? "#ef4444" : "#22c55e" }}
//         >
//             {(file.bug_prediction.bug_probability * 100).toFixed(1)}% bug probability
//         </span>
//         <span className="bp-confidence">
//             {file.bug_prediction.confidence} confidence
//         </span>
// </div>

//       {/* Complex Functions */}
//       {metrics.complex_functions.length > 0 && (
//         <div className="issue-section">
//           <h4>⚠️ Complex Functions</h4>
//           {metrics.complex_functions.map((fn, i) => (
//             <div key={i} className="issue-item yellow">
//               <code>{fn.name}</code>
//               <span>Complexity: {fn.complexity} (line {fn.line})</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Security Issues */}
//       {security.length > 0 && (
//         <div className="issue-section">
//           <h4>🔒 Security Issues</h4>
//           {security.map((issue, i) => (
//             <div key={i} className={`issue-item ${issue.severity === "HIGH" ? "red" : "yellow"}`}>
//               <span className="severity-tag">{issue.severity}</span>
//               <span>{issue.description}</span>
//               <span className="line-tag">Line {issue.line}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* AST Summary */}
//       <div className="issue-section">
//         <h4>📊 Structure</h4>
//         <div className="ast-summary">
//           <span>🔧 {ast.functions?.length || 0} functions</span>
//           <span>🏛️ {ast.classes?.length || 0} classes</span>
//           <span>📦 {ast.imports?.length || 0} imports</span>
//         </div>
//       </div>

//             {/* Graph Analysis */}
//         {file.graph && (
//         <div className="issue-section">
//             <h4>🕸️ Call Graph Analysis</h4>
//             <div className="ast-summary">
//             <span>🔵 {file.graph.num_nodes} nodes</span>
//             <span>➡️ {file.graph.num_edges} edges</span>
//             <span>🔗 avg degree {file.graph.avg_degree}</span>
//             <span>📍 {file.graph.deep_nesting_count} deep nesting</span>
//             </div>
//             {file.graph.most_connected_node !== "none" && (
//             <div className="issue-item yellow" style={{ marginTop: "0.5rem" }}>
//                 <span>Most connected:</span>
//                 <code>{file.graph.most_connected_node}</code>
//                 <span className="line-tag">potential hub function</span>
//             </div>
//             )}
//         </div>
// )}
//     </div>
//   )
// }

import type { FileResult } from "../types/types"

// Simple markdown renderer
function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h4 class="md-h4">$1</h4>')
    .replace(/^### (.+)$/gm, '<h5 class="md-h5">$1</h5>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="md-code">$1</code>')
    .replace(/^(\d+)\.\s(.+)$/gm, '<div class="md-li-num"><span class="md-num">$1.</span> $2</div>')
    .replace(/^\*\s(.+)$/gm, '<div class="md-li">• $1</div>')
    .replace(/^\-\s(.+)$/gm, '<div class="md-li">• $1</div>')
    .replace(/^(?!<[hd]).+$/gm, (line) => line.trim() ? `<p class="md-p">${line}</p>` : '')
    .replace(/\n{2,}/g, '')
}

function riskColor(score: number) {
  if (score >= 60) return "#ef4444"
  if (score >= 30) return "#f59e0b"
  return "#22c55e"
}

export default function CodeViewer({ file }: { file: FileResult }) {
  const { metrics, security, ast, bug_prediction, graph, explanation } = file

  return (
    <div className="code-viewer">
      <h3>{file.path}</h3>

      {/* Metrics Summary */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Risk Score</span>
          <span className="metric-value" style={{ color: riskColor(metrics.risk_score) }}>
            {metrics.risk_score}
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Avg Complexity</span>
          <span className="metric-value">{metrics.avg_complexity}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Maintainability</span>
          <span className="metric-value">{metrics.maintainability_index}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total Lines</span>
          <span className="metric-value">{metrics.total_lines}</span>
        </div>
      </div>

      {/* Bug Prediction */}
      <div className="bug-prediction">
        <span className="bp-label">🤖 ML Bug Prediction</span>
        <span
          className="bp-score"
          style={{ color: bug_prediction.is_likely_buggy ? "#ef4444" : "#22c55e" }}
        >
          {(bug_prediction.bug_probability * 100).toFixed(1)}% bug probability
        </span>
        <span className="bp-confidence">{bug_prediction.confidence} confidence</span>
      </div>

      {/* LLM Explanation — now below metrics */}
      {explanation && explanation.verdict !== "UNKNOWN" && (
        <div className="explanation-block">
          <div className="explanation-header">
            <span className="explanation-title">✨ AI Code Review</span>
            <span
              className="verdict-badge"
              style={{
                background:
                  explanation.verdict === "GREEN" ? "#14532d" :
                  explanation.verdict === "RED"   ? "#450a0a" : "#422006",
                color:
                  explanation.verdict === "GREEN" ? "#22c55e" :
                  explanation.verdict === "RED"   ? "#ef4444" : "#f59e0b",
                border: `1px solid ${
                  explanation.verdict === "GREEN" ? "#22c55e" :
                  explanation.verdict === "RED"   ? "#ef4444" : "#f59e0b"
                }`
              }}
            >
              {explanation.verdict}
            </span>
          </div>
          <div
            className="explanation-text"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(explanation.explanation) }}
          />
        </div>
      )}

      {/* Complex Functions */}
      {metrics.complex_functions.length > 0 && (
        <div className="issue-section">
          <h4>⚠️ Complex Functions</h4>
          {metrics.complex_functions.map((fn, i) => (
            <div key={i} className="issue-item yellow">
              <code>{fn.name}</code>
              <span>Complexity: {fn.complexity} (line {fn.line})</span>
            </div>
          ))}
        </div>
      )}

      {/* Security Issues */}
      {security.length > 0 && (
        <div className="issue-section">
          <h4>🔒 Security Issues</h4>
          {security.map((issue, i) => (
            <div key={i} className={`issue-item ${issue.severity === "HIGH" ? "red" : "yellow"}`}>
              <span className="severity-tag">{issue.severity}</span>
              <span>{issue.description}</span>
              <span className="line-tag">Line {issue.line}</span>
            </div>
          ))}
        </div>
      )}

      {/* AST Summary */}
      <div className="issue-section">
        <h4>📊 Structure</h4>
        <div className="ast-summary">
          <span>🔧 {ast.functions?.length || 0} functions</span>
          <span>🏛️ {ast.classes?.length || 0} classes</span>
          <span>📦 {ast.imports?.length || 0} imports</span>
        </div>
      </div>

      {/* Graph Analysis */}
      {graph && (
        <div className="issue-section">
          <h4>🕸️ Call Graph Analysis</h4>
          <div className="ast-summary">
            <span>🔵 {graph.num_nodes} nodes</span>
            <span>➡️ {graph.num_edges} edges</span>
            <span>🔗 avg degree {graph.avg_degree}</span>
            <span>📍 {graph.deep_nesting_count} deep nesting</span>
          </div>
          {graph.most_connected_node !== "none" && (
            <div className="issue-item yellow" style={{ marginTop: "0.5rem" }}>
              <span>Most connected:</span>
              <code>{graph.most_connected_node}</code>
              <span className="line-tag">potential hub function</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}