# AI-Powered Code Review Assistant

A full-stack machine learning system for automated code quality analysis combining static analysis, graph theory, and ML-based bug prediction. Trained on real-world data mined from open source repositories.

**Live Demo:** [https://code-review-assistant.vercel.app](https://code-review-assistant-ten.vercel.app/)

---

## Overview

This system analyzes GitHub repositories to identify bug-prone files, security vulnerabilities, and architectural issues using a hybrid approach combining traditional static analysis with machine learning. The model achieves a cross-validated ROC-AUC of 0.715 on real labeled data.

### Key Features

- **Multi-language support**: Python, JavaScript, TypeScript
- **Static analysis**: Cyclomatic complexity, maintainability index, security scanning
- **Graph-based analysis**: AST call graphs with NetworkX features
- **ML bug prediction**: Gradient Boosting classifier trained on 3,285 labeled files
- **LLM explanations**: Natural language code reviews via Groq API

---

## Technical Architecture

### Backend (FastAPI)

```
services/
├── parser.py           # AST extraction (Python's ast module)
├── js_parser.py        # JavaScript/TypeScript parsing (regex-based)
├── metrics.py          # Complexity metrics (radon)
├── js_metrics.py       # JS complexity calculation
├── security.py         # Vulnerability scanning (Bandit)
├── js_security.py      # JS security patterns + Semgrep
├── graph_builder.py    # Call graph construction (NetworkX)
├── predictor.py        # ML inference pipeline
└── explainer.py        # LLM-based code review (Groq)
```

### Frontend (React + TypeScript)

Single-page application with:
- Repository analysis interface
- Risk visualization (Recharts)
- File-level code viewer with inline metrics
- Interactive call graph display

---

## Machine Learning Model

### Dataset Collection

Used Mining Software Repositories (MSR) methodology to collect labeled training data:

1. Cloned 20 popular Python repositories
2. Identified bug-fix commits via keyword matching (`fix bug`, `bugfix`, etc.)
3. Labeled files changed in bug-fix commits as **buggy** (pre-fix state)
4. Labeled stable files (untouched for 15+ commits) as **clean**
5. Extracted 19 features from real source code

**Final dataset**: 3,285 files (1,603 buggy, 1,682 clean) from 20 production repositories.

### Feature Engineering

**Complexity Features (5)**
- Cyclomatic complexity (average, maximum)
- High-complexity function count
- Maintainability index
- Lines per function

**Size Features (4)**
- Total lines
- Function count
- Class count
- Import count

**Function-Level Features (2)**
- Average function length
- Maximum function length

**Graph Features (8)**
- Node/edge counts in call graph
- Average degree, maximum degree
- Graph density
- Average shortest path length
- Clustering coefficient
- Deep nesting count (functions 4+ hops from module root)

### Model Architecture

**Algorithm**: Gradient Boosting Classifier (scikit-learn)

**Hyperparameters**:
- 400 estimators
- Max depth: 3 (shallow trees reduce overfitting)
- Learning rate: 0.03
- Subsample: 0.7
- Min samples per leaf: 15

**Class imbalance handling**: Computed sample weights using `class_weight='balanced'`

**Decision threshold**: Lowered from 0.5 to 0.4 to improve recall on buggy class (0.73 recall at 0.4 vs 0.60 at 0.5)

### Performance Metrics

| Metric | Value |
|--------|-------|
| ROC-AUC (5-fold CV) | 0.715 ± 0.015 |
| Test Set AUC | 0.703 |
| Buggy Recall (threshold=0.4) | 0.73 |
| Clean Precision (threshold=0.4) | 0.71 |

Cross-validation folds: `[0.726, 0.713, 0.689, 0.732, 0.713]`

### Feature Importance

Top predictive features (Gini importance):

1. `total_lines` (14.4%)
2. `max_complexity` (13.6%)
3. `lines_per_function` (9.7%)
4. `maintainability` (9.4%)
5. `avg_complexity` (6.9%)

Graph features (`num_nodes`, `avg_shortest_path`) rank in top 10, validating the architectural analysis approach.

---

## Algorithms & Concepts

### Cyclomatic Complexity

Measures the number of linearly independent paths through code by counting decision points (if, for, while, case, &&, ||). A score above 10 is considered high risk. Implemented via McCabe's algorithm in the `radon` library for Python and custom branch-counting for JavaScript.

### Abstract Syntax Trees (AST)

Parses source code into a tree structure representing the grammatical structure of the program. Used to extract functions, classes, imports, and structural patterns without executing code. Python uses the built-in `ast` module; JavaScript uses regex-based extraction.

### Call Graph Analysis

Constructs a directed graph where nodes represent functions/classes and edges represent call relationships or containment. Implemented with NetworkX. Graph metrics capture architectural coupling:

- **High density**: Functions tightly interconnected (harder to modify safely)
- **Short average path**: Changes propagate quickly (high coupling)
- **High clustering**: Functions form tightly-knit modules (can indicate god objects)
- **Deep nesting**: Functions buried in call chains (hard to test)

### Gradient Boosting

Ensemble learning method that builds trees sequentially, where each tree corrects errors of the previous ensemble. Chosen over Random Forest for its superior performance on structured/tabular data. Uses gradient descent to minimize loss function.

### Mining Software Repositories (MSR)

Research methodology for extracting labeled training data from version control history. Labels are derived from developer actions (commit messages, bug reports) rather than manual annotation. Assumes files changed in bug-fix commits were buggy in the pre-fix state.

---

## Technology Stack

**Backend**
- FastAPI (API framework)
- scikit-learn (ML)
- NetworkX (graph analysis)
- Radon (complexity metrics)
- Bandit (security scanning)
- Groq (LLM inference)

**Frontend**
- React with TypeScript
- Recharts (visualization)
- Vite (build tool)

**Deployment**
- Backend: Render
- Frontend: Vercel
- Model: Joblib serialization

---

## Local Development

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Add environment variables
echo "GITHUB_TOKEN=your_token" > .env
echo "GROQ_API_KEY=your_key" >> .env

# Run server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Retrain Model

```bash
cd backend

# Collect real labeled data (takes 15-20 mins)
python ml/collect_data.py

# Train model
python ml/train_real.py
```

---

## API Endpoints

**POST** `/analyze/repo`

Analyze a GitHub repository.

```json
{
  "repo_url": "https://github.com/owner/repo",
  "max_files": 10,
  "explain": false
}
```

**Response**: File-level metrics, security issues, bug predictions, and optional LLM explanations.

---

## Limitations & Future Work

**Current Limitations**:
- Static features only; no runtime behavior analysis
- Limited to public GitHub repositories
- JavaScript analysis uses regex instead of full parser
- Model trained only on Python-dominated repositories

**Planned Improvements**:
- Add commit history features (author count, change frequency)
- Integrate token-level embeddings for semantic understanding
- Expand to Java, Go, C++ support
- Add graph neural networks for structural learning

---
