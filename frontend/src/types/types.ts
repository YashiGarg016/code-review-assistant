export interface FileResult {
  path: string
  ast: {
    functions: any[]
    classes: any[]
    imports: string[]
    total_lines: number
    error?: string
  }
  metrics: {
    path: string
    total_lines: number
    avg_complexity: number
    max_complexity: number
    maintainability_index: number
    complex_functions: any[]
    risk_score: number
  }
  security: any[]
  bug_prediction: {                 
    bug_probability: number
    is_likely_buggy: boolean
    confidence: "high" | "medium"
  }

  graph: {
  num_nodes: number
  num_edges: number
  avg_degree: number
  most_connected_node: string
  deep_nesting_count: number
  clustering_coefficient: number
}

language: string

explanation: {          
    explanation: string
    verdict: "GREEN" | "YELLOW" | "RED" | "UNKNOWN"
    tokens_used: number
  } | null
}

export interface AnalysisResult {
  owner: string
  repo: string
  files_analyzed: number
  results: FileResult[]
}