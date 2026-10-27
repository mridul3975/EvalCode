# EvalForge — AI Evaluation & Code Review Assessment Simulator

**EvalForge** is a specialized assessment platform engineered to train and evaluate AI code evaluators, RLHF raters, and software engineers on evaluating AI-generated code.

---

## Key Features

- **Review Studio**: Side-by-side IDE evaluation interface with multi-language code viewers (Python, C++, JavaScript), syntax highlighting, and inline defect tagging.
- **Comparator Engine**: Multi-dimensional grading system that scores candidate evaluations against ground-truth expert rubrics across Correctness, Efficiency, Edge Cases, Code Style, and Explanations.
- **Practice Problem Catalog**: Comprehensive problem catalog spanning Linked Lists, Stacks & Queues, Binary Trees & BSTs, Graphs, Backtracking, Heaps, Intervals & Greedy, Dynamic Programming, and Advanced Graph Algorithms.
- **Adaptive Weakness Selector**: Recommends personalized practice questions targeting candidate defect blindspots.
- **Progress Dashboard**: Explainable practice scores, skill trends, recent reviews, and mock history.
- **Timed Mock Assessment Simulator**: Complete 3-stage timed screening assessment with automated grading and comprehensive scorecard report.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with a restrained dark interface and shared accessible controls
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
# EvalCode

## UI and local assets

See [DESIGN.md](DESIGN.md) for interface conventions. Reviews begin without reference-answer hints, and drafts are saved in the current browser. New progress profiles show an unassessed state.

`npm run dev` and `npm run build` prepare Monaco assets from the installed `monaco-editor` package under `public/vendor/monaco/`. Those generated files are ignored by Git and served locally. The interface fonts are bundled locally from Next.js's packaged Geist fonts; neither feature needs a third-party CDN at runtime.

The UI review, implementation notes, screenshots, and isolated browser verification helpers are in `reports/ui-review/`. The browser checks stub API traffic and use disposable browser storage.
