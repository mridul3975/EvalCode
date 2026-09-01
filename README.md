# EvalForge — AI Evaluation & Code Review Assessment Simulator

**EvalForge** is a specialized assessment platform engineered to train and evaluate AI code evaluators, RLHF raters, and software engineers on evaluating AI-generated code.

---

## Key Features

- **Review Studio**: Side-by-side IDE evaluation interface with multi-language code viewers (Python, C++, JavaScript), syntax highlighting, and inline defect tagging.
- **Comparator Engine**: Multi-dimensional grading system that scores candidate evaluations against ground-truth expert rubrics across Correctness, Efficiency, Edge Cases, Code Style, and Explanations.
- **75+ Real-world Benchmark Problems**: Comprehensive problem catalog spanning Linked Lists, Stacks & Queues, Binary Trees & BSTs, Graphs, Backtracking, Heaps, Intervals & Greedy, Dynamic Programming, and Advanced Graph Algorithms.
- **Adaptive Weakness Selector**: Recommends personalized practice questions targeting candidate defect blindspots.
- **Full Analytics & Readiness Dashboard**: Visual competency radar charts, discrepancy diff breakdowns, and tier certifications.
- **Timed Mock Assessment Simulator**: Complete 3-stage timed screening assessment with automated grading and comprehensive scorecard report.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Vanilla Tailwind CSS with custom glassmorphism and dark themes
- **Charts & Visuals**: Custom SVG Competency Radars, Readiness Gauges, and Infographic visualizers
- **Persistence**: Client-side storage engine with localStorage synchronization

---

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/mridul3975/EvalForge.git

# Navigate into the project
cd EvalForge

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the simulator.

---

## Build & Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```
