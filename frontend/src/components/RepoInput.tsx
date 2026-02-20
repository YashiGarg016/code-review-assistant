import { useState } from "react"

interface Props {
  onAnalyze: (url: string) => void
  loading: boolean
}

export default function RepoInput({ onAnalyze, loading }: Props) {
  const [url, setUrl] = useState("")

  const handleSubmit = () => {
    if (url.trim()) onAnalyze(url.trim())
  }

  return (
    <div className="repo-input">
      <input
        type="text"
        placeholder="https://github.com/owner/repo"
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        disabled={loading}
      />
      <button onClick={handleSubmit} disabled={loading || !url.trim()}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  )
}