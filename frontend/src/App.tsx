import { useState } from "react"
import RepoInput from "./components/RepoInput"
import FileTree from "./components/FileTree"
import CodeViewer from "./components/CodeViewer"
import RiskChart from "./components/RiskChart"
import type { AnalysisResult, FileResult } from "./types/types"

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<FileResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [explain, setExplain] = useState(false)

  const handleAnalyze = async (repoUrl: string) => {
    setLoading(true)
    setError(null)
    setAnalysis(null)
    setSelectedFile(null)

    try {
      const res = await fetch(`${API_URL}/analyze/repo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl, max_files: 10, explain })
      })
      if (!res.ok) throw new Error("Failed to analyze repo")
      const data = await res.json()
      setAnalysis(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1> Code Review Assistant</h1>
        <p>Analyze any public GitHub repo for complexity, risk, and security issues</p>
      </header>

      <RepoInput onAnalyze={handleAnalyze} loading={loading} />
      
      <div className="explain-toggle">
        <label>
          <input
            type="checkbox"
            checked={explain}
            onChange={e => setExplain(e.target.checked)}
          />
          <span> Generate AI explanations</span>
        </label>
        {explain && (
          <span className="explain-warning">
            ⚠️ Uses Groq API — may take longer
          </span>
        )}
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {analysis && (
        <div className="dashboard">
          <div className="dashboard-header">
            <h2>{analysis.owner}/{analysis.repo}</h2>
            <span className="badge">{analysis.files_analyzed} files analyzed</span>
          </div>

          <RiskChart results={analysis.results} />

          <div className="main-panel">
            <FileTree
              results={analysis.results}
              selected={selectedFile}
              onSelect={setSelectedFile}
            />
            {selectedFile && <CodeViewer file={selectedFile} />}
          </div>
        </div>
      )}
    </div>
  )
}