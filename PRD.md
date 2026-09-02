# Product Requirements Document (PRD)

**Product Name:** EvalForge (AI-Evaluation & RLHF Assessment Simulator)

**Document Version:** 1.0.0

**Target Audience:** Software engineers, CS students, and technical candidates preparing for AI code-evaluation, RLHF annotation, and code-review screening assessments (e.g., Mindrift, Alignerr, Outlier/Remotasks).

---

## 1. Executive Summary & Problem Statement

### 1.1 Problem

Emerging AI-training and RLHF platforms do not hire based on a candidate's ability to write code from scratch. Instead, their screening tests measure **code review acuity**: identifying subtle logic flaws, catching unhandled edge cases, calculating true computational complexity, detecting deceptive/hallucinated explanations, and grading adherence to system prompts.

Traditional interview preparation platforms (e.g., LeetCode, HackerRank) train problem *creation* and syntax recall, leaving candidates unprepared for rubric-based, multi-dimensional code auditing.

### 1.2 Solution

EvalForge is a specialized AI-evaluation simulator that inverts the traditional coding challenge. Candidates are presented with problem statements paired with AI-generated code containing calibrated flaws or correct implementations. Users submit structured, multi-dimensional reviews that are automatically evaluated against ground-truth rubrics, producing detailed gap analyses and calculating a calibrated readiness score.

```
┌─────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│  Problem Spec   │  ──►  │ AI Generated Code    │  ──►  │ User Review & Audit  │
│  + Constraints  │       │ (Calibrated Defect)  │       │ (Structured Form)    │
└─────────────────┘       └──────────────────────┘       └──────────┬───────────┘
                                                                    │
┌─────────────────┐       ┌──────────────────────┐                  │
│ Gap Analysis &  │  ◄──  │ Multi-Dimensional    │  ◄───────────────┘
│ Readiness Score │       │ Comparator Engine    │  (Graded against Ground Truth)
└─────────────────┘       └──────────────────────┘

```

---

## 2. User Personas & Core Journeys

### 2.1 Personas

* **The RLHF Candidate:** Preparing for screening assessments on platforms like Mindrift or Alignerr; needs fast feedback on how well their bug-catching and explanation-auditing matches formal rubrics.
* **The DSA Practitioner:** Already solves problems on LeetCode; wants to build critical reading and debugging speed by auditing diverse implementations.

### 2.2 Core User Flows

```
[Practice Mode Flow]
Dashboard ──► Select Topic/Lang ──► Workspace (Code + Structured Form) ──► Submit
       │
       └──► Comparator Engine Evaluates vs Ground Truth ──► Diagnostic Breakdown ──► Next (Adaptive)

[Mock Assessment Flow]
Dashboard ──► Start Mock (5 Questions, 50 Min) ──► Strict Assessment Workspace ──► Final Submission
       │
       └──► Aggregate Benchmark Report (Radar Chart, Dimension Scores, Weakness Diagnostics)

```

---

## 3. System Architecture & Core Subsystems

```
                               ┌────────────────────────────────────────────────┐
                               │                 EVALFORGE                      │
                               └──────────────────────┬─────────────────────────┘
                                                      │
             ┌────────────────────────────────────────┼────────────────────────────────────────┐
             ▼                                        ▼                                        ▼
   ┌───────────────────┐                    ┌───────────────────┐                    ┌───────────────────┐
   │   SUBSYSTEM 1     │                    │   SUBSYSTEM 2     │                    │   SUBSYSTEM 3     │
   │ Question & Defect │                    │   Interactive     │                    │ Comparator &      │
   │ Pipeline          │                    │   Workspace       │                    │ Evaluation Engine │
   └─────────┬─────────┘                    └─────────┬─────────┘                    └─────────┬─────────┘
             │                                        │                                        │
    • Defect Injector                        • Monaco Code Viewer                     • Semantic Matcher
    • Sandbox Validator                      • Structured Audit Form                  • Rubric Evaluator
    • Ground-Truth Builder                   • Assessment Timer                       • Discrepancy Diff

```

### Subsystem 1: Question & Defect Pipeline

Generates, validates, and stores problems with paired AI solutions across calibrated defect categories.

#### Defect Taxonomy & Distribution Targets

Every solution presented to the user belongs to one of seven deterministic categories:

| Category | Target Frequency | Description |
| --- | --- | --- |
| **Completely Correct** | 20% | Optimal time/space, handles all edge cases, accurate explanation. |
| **Subtle Logic Bug** | 25% | Off-by-one, incorrect pointer mutations, bad base cases, faulty state transitions. |
| **Edge-Case Blindness** | 15% | Fails on empty arrays, single-node graphs, null pointers, duplicates, or negative inputs. |
| **Complexity Regression** | 15% | Functionally correct but violates constraints (e.g., $O(n^2)$ nested lookups instead of $O(n)$ hash map). |
| **Minor Style/Quality** | 10% | Redundant passes, poor variable naming, unidiomatic language usage. |
| **Deceptive Explanation** | 10% | Code has a bug, but the written AI explanation confidently claims it handles the case correctly. |
| **Instruction Mismatch** | 5% | Solves a slightly different problem or violates strict output format constraints. |

#### Automated Validation Layer

Before any generated question is committed to the active pool:

1. The reference solution is executed in a secure sandbox against an automated unit test suite.
2. The defective solution is executed to confirm it fails specifically on the intended test case and passes unintended failure modes.
3. The ground-truth rubric is generated and stored with exact failure explanations and time/space complexity invariants.

---

### Subsystem 2: Workspace & Evaluation Interface

The workspace splits the screen into a read-only code/context viewer on the left and a structured evaluation form on the right.

```
┌──────────────────────────────────────────────┬──────────────────────────────────────────────┐
│ [Problem Statement & Constraints]            │ EVALUATION PANEL                             │
│ Find the middle node of a linked list...     │                                              │
├──────────────────────────────────────────────┤ 1. Verdict                                   │
│ [AI Solution & Explanation]                  │   ( ) Completely Correct   (•) Has Defects   │
│                                              │                                              │
│ 1  def findMiddle(head):                     │ 2. Defect Categories (Multi-select)          │
│ 2      slow = head                           │   [x] Logic Bug   [ ] Complexity   [x] Edge  │
│ 3      fast = head.next                      │                                              │
│ 4      while fast and fast.next:             │ 3. Specific Defects & Root Cause             │
│ 5          slow = slow.next                  │   ┌────────────────────────────────────────┐ │
│ 6          fast = fast.next.next             │   │ The fast pointer initialization causes │ │
│ 7      return slow                           │   │ even-length lists to return the first  │ │
│                                              │   │ middle instead of the second middle.   │ │
│ AI Explanation:                              │   └────────────────────────────────────────┘ │
│ "Uses fast & slow pointers to reach the      │ 4. Breaking Edge Cases                       │
│ middle in a single pass O(N) time."          │   ┌────────────────────────────────────────┐ │
│                                              │   │ head = [1, 2, 3, 4] -> returns 2 not 3 │ │
│                                              │   └────────────────────────────────────────┘ │
│                                              │ 5. Complexity Audit                          │
│                                              │   Time: [ O(n) ]   Space: [ O(1) ]           │
│                                              │                                              │
│                                              │ 6. Explanation Accuracy                      │
│                                              │   ( ) Fully Accurate   (•) Inaccurate/Mislead│
│                                              │                                              │
│                                              │ [ SUBMIT EVALUATION ]                        │
└──────────────────────────────────────────────┴──────────────────────────────────────────────┘

```

#### Evaluation Input Fields

* **Verdict (Binary/Enum):** `CORRECT` vs `DEFECTIVE`.
* **Defect Classification (Checkboxes):** Logic, Edge Case, Complexity, Instruction Mismatch, Explanation Quality.
* **Bug & Root-Cause Description (Textarea):** User's technical breakdown of why the code fails.
* **Failing Test Case (Textarea):** Concrete input vector demonstrating the flaw.
* **Time & Space Complexity (Form Selectors):** Big-$O$ notation for both dimensions.
* **Explanation Audit (Enum + Textarea):** Verification of whether the AI's natural language reasoning matches the code's behavior.
* **Proposed Remediation (Code/Textarea - Optional for Practice, Mandatory for Advanced):** How to fix the defect.

---

### Subsystem 3: Comparator & Scoring Engine

When a review is submitted, the comparator runs a multi-agent evaluation pipeline against the stored ground truth.

```
                           ┌────────────────────────┐
                           │ User Evaluation Payload│
                           └───────────┬────────────┘
                                       │
                                       ▼
┌────────────────────────┐   ┌────────────────────┐   ┌────────────────────────┐
│ Ground-Truth Rubric    │──►│ Comparative Engine │◄──│ Problem & Code Context │
│ (Validated Reference)  │   │ (LLM Evaluator)    │   │                        │
└────────────────────────┘   └─────────┬──────────┘
                                       │
                                       ▼
                         ┌───────────────────────────┐
                         │   Dimension Scores & Diff │
                         ├───────────────────────────┤
                         │ • Correctness:      9/10  │
                         │ • Edge Cases:       3/10  │
                         │ • Complexity:      10/10  │
                         │ • Explanation:      2/10  │
                         │ • Communication:    8/10  │
                         ├───────────────────────────┤
                         │ Diagnostic "Why Wrong" Diff│
                         └───────────────────────────┘

```

#### Multi-Dimensional Evaluation Matrix

Scores are calculated across five distinct dimensions, normalized from 0 to 100:

```
Total Score = 0.30(Correctness) + 0.25(EdgeCases) + 0.15(Complexity) + 0.15(Explanation) + 0.15(Communication)

```

1. **Correctness Identification (30% Weight):**
* Did the user correctly identify whether the code was functional or flawed?
* *False Positive Penalty:* Marking a correct solution as defective penalizes this score heavily.
* *False Negative Penalty:* Missing a fatal logic bug caps this dimension at $\le 20\%$.


2. **Edge-Case Coverage (25% Weight):**
* Did the user identify the exact boundary conditions that break the code?
* Evaluated via semantic containment and AST execution against the user's proposed input vector.


3. **Complexity & Performance Audit (15% Weight):**
* Exact match of Time and Space Big-$O$ notation against ground truth.


4. **Explanation & Alignment Verification (15% Weight):**
* Did the user spot discrepancies between the AI's claims and its actual implementation?


5. **Communication & Feedback Quality (15% Weight):**
* Is the review structured, professional, concise, and actionable (matching rubric criteria used by RLHF platforms)?



---

## 4. Product Modes & Feature Specifications

### 4.1 Mode 1: Practice Mode

* **Goal:** Granular, continuous skill development with instant feedback.
* **Topic Selection:** Arrays, Strings, Linked Lists, Trees/Graphs, Dynamic Programming, SQL, Concurrency.
* **Language Support:** Python, C++, TypeScript, Java.
* **Immediate Feedback View:** Displays a point-by-point comparison between the user's review and the expert review.

#### Diagnostic Discrepancy View ("Why Was I Wrong?")

```
================================================================================
EVALUATION RESULTS: 72 / 100
================================================================================

[✓] Verdict Accuracy: Correctly flagged as DEFECTIVE
[✓] Primary Bug: Correctly identified loop termination error at line 14
[✗] Missed Edge Case: Failed to note behavior when array length is 0 (IndexError)
[✗] Explanation Audit: Did not notice AI claimed O(1) space despite creating a new list

--------------------------------------------------------------------------------
EXPERT REFERENCE BREAKDOWN
--------------------------------------------------------------------------------
• Primary Defect (Severity: High):
  The while-loop condition `while r <= len(nums)` triggers an off-by-one boundary
  exception on the final iteration.

• Edge Case Vulnerability (Severity: Medium):
  Passing `nums = []` skips initialization checks and leads to an unhandled
  exception in the return statement.

• Misleading Explanation (Severity: Low):
  The commentary states the algorithm is in-place, but `list(nums)` allocates
  an additional O(N) memory buffer.
================================================================================

```

---

### 4.2 Mode 2: Mock Assessment Simulator

* **Goal:** Realistic simulation of screening tests (e.g., Mindrift 60-minute technical evaluation).
* **Format:** 5 sequential problems, strict 50-minute global countdown timer.
* **Environment Constraints:**
* No immediate feedback or hints during the test.
* Code execution disabled (pure mental execution and analytical reading, matching standard screeners).
* Auto-submission upon timer expiration.


* **Readiness Benchmark Output:**

| Score Range | Status Indicator | Assessment Recommendation |
| --- | --- | --- |
| **90 – 100** | **Ready** | Meets or exceeds high-tier evaluation thresholds. |
| **80 – 89** | **Borderline** | Strong code reading; needs polish on edge-case identification. |
| **70 – 79** | **Needs Practice** | Frequent misses on explanation discrepancies or complexity bounds. |
| **< 70** | **Not Ready** | High rate of false positives/negatives in correctness detection. |

---

### 4.3 Mode 3: Adaptive Dashboard & Analytics

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ CANDIDATE READINESS PROFILE                                                  │
│                                                                              │
│ Overall Readiness: 78% (Borderline Ready)        Streak: 12 Days             │
│ Target Benchmark:  90%                           Evaluations Completed: 142  │
├──────────────────────────────────────────────────────────────────────────────┤
│ SKILL DIMENSION BREAKDOWN                                                    │
│                                                                              │
│ Correctness Detection  [██████████████████░░] 88%                            │
│ Logic Debugging        [████████████████░░░░] 82%                            │
│ Edge-Case Analysis     [██████████░░░░░░░░░░] 52%  ◄ [CRITICAL WEAKNESS]     │
│ Complexity Analysis    [██████████████████░░] 91%                            │
│ Explanation Auditing   [██████████████░░░░░░] 70%                            │
│ Communication Quality  [████████████████░░░░] 80%                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ ADAPTIVE RECOMMENDATION                                                      │
│ Next recommended session: "Linked Lists & Trees: Null Boundary Edge Cases"   │
│ [ START ADAPTIVE SESSION ]                                                   │
└──────────────────────────────────────────────────────────────────────────────┘

```

#### Adaptive Weighting Algorithm

The practice engine calculates a moving average of the user's last 20 evaluations across all 5 dimensions.

* If any dimension drops below **70%**, the question selector applies a **$3\times$ sampling weight** to problems exhibiting that specific defect profile.
* As the user's detection rate for that dimension crosses **85%**, the selector normalizes back to standard defect distributions.

---

## 5. Data Models & Database Schema

```
┌────────────────────────┐           ┌────────────────────────┐
│        problems        │           │   generated_solutions  │
├────────────────────────┤           ├────────────────────────┤
│ id (PK)                │ 1       N │ id (PK)                │
│ title                  │──────────►│ problem_id (FK)        │
│ description            │           │ code                   │
│ difficulty             │           │ explanation            │
│ language               │           │ defect_type            │
│ constraints            │           │ is_correct             │
└────────────────────────┘           │ ground_truth_rubric_id │
                                     └───────────┬────────────┘
                                                 │ 1
                                                 │
                                                 │ 1
                                     ┌───────────▼────────────┐
                                     │  ground_truth_rubrics  │
                                     ├────────────────────────┤
                                     │ id (PK)                │
                                     │ time_complexity        │
                                     │ space_complexity       │
                                     │ primary_defect_desc    │
                                     │ breaking_test_cases    │
                                     │ explanation_flaws      │
                                     │ rubric_criteria (JSON) │
                                     └────────────────────────┘

```

```
┌────────────────────────┐           ┌────────────────────────┐
│         users          │           │    user_submissions    │
├────────────────────────┤           ├────────────────────────┤
│ id (PK)                │ 1       N │ id (PK)                │
│ email                  │──────────►│ user_id (FK)           │
│ readiness_score        │           │ solution_id (FK)       │
│ dimension_stats (JSON) │           │ user_verdict           │
│ created_at             │           │ user_feedback (JSON)   │
└───────────┬────────────┘           │ scores_by_dim (JSON)   │
            │                        │ overall_score          │
            │ 1                      │ discrepancy_diff (JSON)│
            │                        │ created_at             │
            │ N                      └────────────────────────┘
┌───────────▼────────────┐
│    mock_assessments    │
├────────────────────────┤
│ id (PK)                │
│ user_id (FK)           │
│ total_score            │
│ dimension_scores (JSON)│
│ status                 │
│ time_spent_seconds     │
│ completed_at           │
└────────────────────────┘

```

---

## 6. Technical Stack & Implementation Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ FRONTEND LAYER                                                         │
│ • Framework: React 19 + TypeScript + Vite                              │
│ • Styling: Tailwind CSS (Dark Mode Native)                             │
│ • State & Data Fetching: TanStack Query + Zustand                      │
│ • Code Editor: Monaco Editor (Read-Only Diff / Formatter)              │
│ • Visualization: Recharts / SVG Custom Infographic Gauges              │
├────────────────────────────────────────────────────────────────────────┤
│ BACKEND & API LAYER                                                    │
│ • Runtime & Server: Bun + Hono (or Node.js / Express)                  │
│ • ORM & Database: Drizzle ORM + PostgreSQL                             │
│ • Auth: JWT with HTTP-only Secure Cookies / Lucia Auth / Supabase Auth │
├────────────────────────────────────────────────────────────────────────┤
│ EVALUATION & AI PIPELINE                                               │
│ • Model Gateway: Vercel AI SDK / Direct Provider Client (Groq/OpenAI)  │
│ • Execution Sandbox: Isolated Docker Container / Pyodide (WASM)        │
│ • Comparator Prompt: Structured JSON Schema Output (Instructor / Zod)  │
└────────────────────────────────────────────────────────────────────────┘

```

---

## 7. Comparative Engine Prompt Specification

The comparator backend executes the following system evaluation prompt when grading user reviews:

```yaml
role: "Expert Technical Evaluation Auditor"
task: "Evaluate a human candidate's code review of an AI-generated solution against the Ground Truth Rubric."
input_payload:
  problem_statement: string
  ai_solution_code: string
  ai_explanation: string
  ground_truth_rubric:
    is_correct: boolean
    defect_type: string
    true_time_complexity: string
    true_space_complexity: string
    actual_defects: list[string]
    failing_edge_cases: list[string]
    explanation_accuracy: string
  user_submission:
    user_verdict: string
    selected_defect_types: list[string]
    user_bug_analysis: string
    user_edge_cases: string
    user_time_complexity: string
    user_space_complexity: string
    user_explanation_verdict: string

evaluation_rubric:
  correctness_score: "0-10 based on verdict match and primary bug identification"
  edge_case_score: "0-10 based on whether proposed edge case actually breaks the code"
  complexity_score: "0-10 based on exact Big-O match"
  explanation_audit_score: "0-10 based on catching hallucinated/misleading claims"
  communication_score: "0-10 based on clarity, structure, and actionable precision"

output_format: "JSON adhering to strict Zod schema"

```

---

## 8. Release Roadmap & Milestones

### Phase 1: MVP Core (Weeks 1–3)

* [ ] Database schema setup (PostgreSQL + Drizzle).
* [ ] Question bank pipeline with 50 pre-validated Python & C++ solutions across all 7 defect types.
* [ ] Split-screen Practice Workspace (Monaco code viewer + structured review form).
* [ ] Core Comparator Engine grading submissions against ground-truth rubrics.
* [ ] Immediate Feedback modal with the diagnostic "Why Was I Wrong?" diff.

### Phase 2: Mock Engine & Adaptive Analytics (Weeks 4–5)

* [ ] Timed Mock Assessment Simulator (5-problem assessment, 50-min timer, summary report).
* [ ] Candidate Readiness Dashboard with 5-dimension skill radar and history.
* [ ] Adaptive question biasing based on rolling weakness detection.

### Phase 3: Platform Expansion (Weeks 6+)

* [ ] Automated LLM-driven question generator and sandbox verification pipeline.
* [ ] Pairwise Comparison Mode (presenting two candidate AI solutions to rank and justify).
* [ ] Exportable Candidate Readiness Certificate & Performance PDF report.

---

## 9. Non-Functional Requirements & Guardrails

1. **Evaluation Latency:** The grading pipeline must return the full comparative analysis in **$\le 3.5$ seconds** from submission.
2. **Sandbox Security:** User-submitted edge-case code inputs executed server-side must run in an unprivileged, network-isolated container with a **200ms CPU timeout** and **64MB memory limit**.
3. **No Phantom Bugs:** The Question Generation pipeline must reject any synthetic defect that cannot be validated by an executable test assertion.
4. **Deterministic Grading:** The comparative evaluator prompt must use temperature $0.0$ to ensure identical user reviews receive consistent numerical scores.

Here is the updated, integrated **Technical PRD Section & Code Reuse Blueprint** designed to be handed directly to an AI developer or coding tool (like Antigravity / Cursor).

It explicitly maps every open-source repository into your architecture so the AI knows what to **import/reuse**, what to **adapt**, and what to **build from scratch**.

---

# EvalForge PRD Addendum: Open-Source Repository Integration & Reuse Architecture

## 1. Open-Source Reuse Matrix (Build vs. Fork vs. Reuse)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                 EVALFORGE STACK                                  │
├──────────────────────┬───────────────────────────┬───────────────────────────────┤
│ Layer / Capability   │ Component / Repo Source   │ Implementation Strategy       │
├──────────────────────┼───────────────────────────┼───────────────────────────────┤
│ UI & Skeleton        │ Boneyard                  │ Direct Import / Layout Scaff. │
│ Visual Analytics     │ Infographic               │ Direct Component Reuse        │
│ AI Benchmarking      │ MatrAIx                   │ Adapt Harness for Evaluation  │
│ Code Intelligence    │ Archify / Understand-Any. │ Phase 2: AST Analysis Plugin  │
│ PDF Cert Generation  │ pdfcn                     │ Phase 3: Export Service       │
│ Mobile Client        │ Capacitor                 │ Post-Web Wrapper              │
│ Core Comparator      │ EvalForge Core (Custom)   │ Custom Proprietary Engine     │
└──────────────────────┴───────────────────────────┴───────────────────────────────┘

```

---

## 2. Detailed Repo Integration Specifications

### 2.1 UI Foundation & Skeleton Infrastructure: `Boneyard`

* **Role:** Rapid dashboard, split-view workspace scaffolding, zero-layout-shift skeleton loaders, and structural forms.
* **Why Reuse:** Eliminates repetitive boilerplate for dashboard grids, responsive cards, multi-pane editors, and layout placeholders.
* **Integration Points:**
1. **Workspace Layout:** Use Boneyard layout primitives for the side-by-side IDE + Evaluation panel.
2. **Skeleton & Async Loading:** Use Boneyard’s DOM-driven skeleton generator (`boneyard-js`) when streaming AI evaluations or loading heavy mock assessment problem sets to prevent layout shifts.
3. **Form Wrappers:** Standardize the 6 evaluation input components (radio verdicts, multi-select taggers, Big-$O$ dropdowns, diagnostic textareas).



```typescript
// integration/ui/WorkspaceSkeleton.tsx
import { Skeleton } from 'boneyard-js/react';

export function PracticeWorkspaceLoading() {
  return (
    <div className="grid grid-cols-2 gap-4 h-screen p-4">
      <Skeleton name="problem-viewer" loading={true} />
      <Skeleton name="evaluation-panel" loading={true} />
    </div>
  );
}

```

---

### 2.2 Results Visualization & Skill Radar: `Infographic`

* **Role:** Dynamic rendering of assessment results, skill radar charts, readiness score gauges, and weakness diagnostic breakdowns.
* **Why Reuse:** Pre-built, high-polish SVG/Canvas charts and infographic templates remove the need to design custom D3/SVG charting primitives.
* **Integration Points:**
1. **Dimension Breakdown Radar:** Visualizing candidate performance across the 5 core dimensions (Correctness, Edge Cases, Complexity, Explanation, Communication).
2. **Readiness Thermometer:** Visualizing the 0–100 candidate benchmark against platform readiness tiers (90+ Ready, 80–89 Borderline, <70 Not Ready).
3. **Discrepancy Diff Chart:** Visual indicator showing ground truth vs. candidate findings.



```typescript
// integration/analytics/ScoreVisualizer.tsx
import { SkillRadar, BenchmarkGauge } from 'infographic-components';

interface AssessmentResultsProps {
  score: number;
  dimensions: {
    correctness: number;
    edgeCases: number;
    complexity: number;
    explanation: number;
    communication: number;
  };
}

export function AssessmentReport({ score, dimensions }: AssessmentResultsProps) {
  return (
    <div className="flex flex-col gap-6 p-6 bg-surface-dark rounded-xl">
      <BenchmarkGauge value={score} target={90} label="Readiness Benchmark" />
      <SkillRadar data={dimensions} max={100} />
    </div>
  );
}

```

---

### 2.3 Evaluation Harness & Benchmark Grounding: `MatrAIx`

* **Role:** Adapting evaluation harness mechanisms, persona benchmarking, and automated rubric scoring logic.
* **Why Reuse:** Leverages MatrAIx's schema-based evaluation patterns to compare outputs systematically.
* **Crucial Architectural Adaptation:**
* *Standard MatrAIx:* Evaluates model generation quality against a prompt.
* *EvalForge Adaptation:* Evaluates the **user's structured review** against the **reference ground truth**.


* **Integration Pipeline:**

```
┌────────────────────────────────────────────────────────┐
│                   MATRAIX-ADAPTED HARNESS              │
├──────────────────────────┬─────────────────────────────┤
│ Reference Ground Truth   │ Candidate Evaluation Input  │
│ (Defects, Edge Cases, O) │ (Verdict, Cases, Complexity)│
└────────────┬─────────────┴──────────────┬──────────────┘
             │                            │
             ▼                            ▼
   ┌──────────────────────────────────────────────┐
   │ Comparator Engine (Semantic + Set Distance)  │
   └──────────────────────┬───────────────────────┘
                          │
                          ▼
   ┌──────────────────────────────────────────────┐
   │ Normalized Dimensional Scores (0-100)        │
   └──────────────────────────────────────────────┘

```

---

### 2.4 Code Intelligence & Static AST Analysis (Phase 2): `Archify` / `Understand-Anything`

* **Role:** Programmatic verification of code structures and automatic extraction of Big-$O$ invariants.
* **Deferred to Phase 2:** During MVP, LLM generation + test-suite execution verifies defects. In Phase 2, integrate these tools to:
1. Automatically parse submitted Python/C++ code ASTs to detect cyclic complexity.
2. Verify if the candidate's proposed remediation code eliminates the defect without introducing regressions.



---

### 2.5 PDF Export (Phase 3): `pdfcn`

* **Role:** Generate downloadable "Candidate AI-Readiness Evaluation Certificates" and detailed post-assessment diagnostic reports.
* **Deferred to Phase 3:** Run as an asynchronous worker to render the `Infographic` results canvas into an exportable PDF summary for candidates to attach to applications.

---

## 3. Repositories Explicitly Shelved (Out of Scope for Core Build)

To prevent scope creep and bloated bundle sizes, the following repos must **not** be included in initial sprints:

| Repo | Reason for Exclusion |
| --- | --- |
| **Tiny World Builder / ThreeUI** | 3D rendering adds bundle weight without advancing evaluation training. |
| **OpenVid / OpenMontage** | Video generation is non-essential for text/code assessment. |
| **Alibaba Page Agent** | Browser automation is redundant; all assessment logic is native. |
| **Open-LLM-VTuber** | Voice/avatar interviews are separate from written code-auditing assessments. |
| **FingerprintJS / Curbox** | Advanced device fingerprinting and break timers are non-MVP concerns. |

---

## 4. Custom Proprietary Core (What Must Be Written From Scratch)

The AI developer must focus engineering effort on the **proprietary evaluation logic**:

```
                              EVALFORGE CORE ENGINE
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ 1. Question Defect Injector: Generates verified flawed & correct code.       │
  │ 2. Ground-Truth Generator: Builds multi-dimensional rubrics per problem.    │
  │ 3. Discrepancy Diff Engine: Pinpoints exact misses (e.g., missed edge cases)│
  │ 4. Adaptive Weakness Weighting: Automatically biases practice sessions.     │
  └─────────────────────────────────────────────────────────────────────────────┘

```

---

Here is the dedicated **Candidate Profile & Progress Analytics Engine** specification to insert directly into your PRD.

---

# PRD Section Addendum: Candidate Profile & Progress Analytics Engine

## 1. Overview & Objectives

The Profile & Analytics engine functions as the candidate’s central diagnostic hub. Rather than a static user settings page, it aggregates historical performance across Practice Mode and Mock Assessments into a single **Readiness Index**, computes multidimensional competency breakdowns, tracks activity velocity, and provides actionable recommendations on specific algorithmic and defect-evaluation blind spots.

---

## 2. Profile Dashboard Wireframe & Layout

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ CANDIDATE PROFILE & PERFORMANCE AUDIT                                                       │
├──────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ 1. READINESS INDEX & BENCHMARK       │ 2. AGGREGATE ACTIVITY METRICS                        │
│                                      │                                                      │
│      ┌─────────────────────────┐     │ • Total Evaluations:       142                       │
│      │     84.2% READINESS     │     │ • Practice Audits:         126                       │
│      │    [ BORDERLINE READY ] │     │ • Mock Tests Taken:        16                        │
│      └─────────────────────────┘     │ • Verdict Accuracy Rate:   88.7% (126/142)           │
│   Target Benchmark: 90.0%+           │ • Mock Average Score:      81.4 / 100                │
│   Global Percentile: Top 14%         │ • Practice Average Score:  79.8 / 100                │
│                                      │ • Current Streak:          9 Days (Best: 18)         │
├──────────────────────────────────────┴──────────────────────────────────────────────────────┤
│ 3. MULTIDIMENSIONAL COMPETENCY MATRIX                                                       │
│                                                                                             │
│ Correctness Detection  [████████████████████░░░░░] 82.0%  (Avg Delta: -1.2%)                │
│ Logic Debugging        [██████████████████████░░░] 88.5%  (Avg Delta: +4.1%)                │
│ Edge-Case Analysis     [████████████░░░░░░░░░░░░░] 48.0%  ◄ [CRITICAL DEFICIT]              │
│ Complexity & Big-O     [████████████████████████░] 94.0%  (Avg Delta: +0.5%)                │
│ Explanation Auditing   [█████████████████░░░░░░░░] 68.0%  (Avg Delta: -2.0%)                │
│ Communication Quality  [████████████████████░░░░░] 81.0%  (Avg Delta: +1.8%)                │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. TOPIC & DEFECT TAXONOMY BREAKDOWN                                                        │
│                                                                                             │
│ Topic Mastery:                        Defect Detection Rate:                                │
│ • Linked Lists:      62% (Needs Work) │ • Subtle Logic Bugs:       86%                      │
│ • Trees & Graphs:    74% (Moderate)   │ • Edge-Case Blindness:     42% ◄                    │
│ • Dynamic Prog:      89% (Strong)     │ • Deceptive Explanations:  61%                      │
│ • Arrays & Strings:  91% (Strong)     │ • Complexity Regressions:  95%                      │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 5. RECENT MOCK TEST HISTORY (LAST 5)                                                        │
│                                                                                             │
│ Date        Assessment Type        Score    Time Spent   Status       Action                │
│ 2026-08-28  Mindrift Full Mock #4  86/100   44m 12s      Borderline   [ Review Audit ]      │
│ 2026-08-25  Alignerr Screener #2   82/100   48m 05s      Borderline   [ Review Audit ]      │
│ 2026-08-21  Mindrift Full Mock #3  74/100   50m 00s      Needs Work   [ Review Audit ]      │
│ 2026-08-18  Python Diagnostic #1   91/100   38m 20s      Ready        [ Review Audit ]      │
│ 2026-08-14  Core Screener #1       69/100   50m 00s      Not Ready    [ Review Audit ]      │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

```

---

## 3. Core Mathematical Models & Metric Calculations

### 3.1 Overall Readiness Score ($R$)

The single composite score displayed on the profile. It uses an **exponential decay weighted average** of recent evaluations combined with mock test performance, ensuring that recent improvements or regressions are accurately reflected:

$$R = 0.60 \cdot \bar{S}_{\text{mock}} + 0.40 \cdot \left( \sum_{i=1}^{N} w_i \cdot S_{\text{practice}, i} \right)$$

* $\bar{S}_{\text{mock}}$: Mean score of the last 5 Mock Assessments.
* $S_{\text{practice}, i}$: Score of practice evaluation $i$.
* $w_i$: Exponential decay weight prioritizing recent evaluations ($w_i = \frac{e^{0.05 \cdot i}}{\sum e^{0.05 \cdot j}}$).

### 3.2 Verdict Accuracy Rate ($A_v$)

The binary accuracy rate measuring whether the candidate correctly classified solutions as functional vs. flawed (independent of detailed rubric marks):

$$A_v = \left( \frac{\text{True Positives} + \text{True Negatives}}{\text{Total Evaluations Submitted}} \right) \times 100$$

* **High $A_v$ (>90%) + Low Overall Score (<70%):** Indicates the candidate spots when something is wrong, but misses secondary bugs, fails to identify edge cases, or cannot pinpoint the exact root cause.
* **Low $A_v$ (<75%):** Indicates fundamental code-reading gaps (e.g., hallucinating bugs in correct code or missing fatal logic flaws).

### 3.3 Skill Dimension Mastery Scores

Each of the 6 dimensions tracks an independent rolling average over the candidate's last 20 evaluations:

| Metric Key | Calculation Method | Interpretation |
| --- | --- | --- |
| `dim_correctness` | Match rate on primary bug localization | Ability to isolate root causes. |
| `dim_edge_cases` | Semantic & test vector boundary match | Ability to find breaking input vectors. |
| `dim_complexity` | Exact match against Big-$O$ invariants | Algorithmic efficiency analysis. |
| `dim_explanation` | Catch rate of deceptive AI commentary | Resistance to plausible-sounding AI hallucinations. |
| `dim_communication` | Actionable, professional prose score | Production-readiness of written reviews. |
| `dim_debugging` | Correctness of proposed remediation | Ability to suggest verified fixes. |

---

## 4. UI Component Specifications (Infographic Integration)

To minimize frontend development effort, profile components map directly to the `Infographic` library:

1. **`ReadinessGauge`:** Renders the composite score ($R$) with color-coded target bands:
* **$\ge 90.0\%$:** Emerald Green (`#10B981`) — *Ready*
* **$80.0\% - 89.9\%$:** Amber/Yellow (`#F59E0B`) — *Borderline*
* **$70.0\% - 79.9\%$:** Orange (`#F97316`) — *Needs Practice*
* **$< 70.0\%$:** Crimson Red (`#EF4444`) — *Not Ready*


2. **`CompetencyRadarChart`:** 6-axis polygon displaying the dimensional metrics against the ideal 90% benchmark threshold.
3. **`TaxonomyHeatmap`:** Grid visualizing weak combinations (e.g., *Linked Lists $\times$ Edge Cases = 34% [Red]* vs. *Arrays $\times$ Complexity = 96% [Green]*).

---

## 5. Database Schema Extensions

```sql
-- Extensions to existing schema for Profile & Metrics Tracking

ALTER TABLE users 
ADD COLUMN readiness_score NUMERIC(5, 2) DEFAULT 0.00,
ADD COLUMN verdict_accuracy NUMERIC(5, 2) DEFAULT 0.00,
ADD COLUMN total_evaluations_count INT DEFAULT 0,
ADD COLUMN total_mocks_count INT DEFAULT 0,
ADD COLUMN mock_average_score NUMERIC(5, 2) DEFAULT 0.00,
ADD COLUMN practice_average_score NUMERIC(5, 2) DEFAULT 0.00,
ADD COLUMN current_streak_days INT DEFAULT 0,
ADD COLUMN best_streak_days INT DEFAULT 0,
ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE;

-- Table to store periodic dimensional score snapshots for trend charts
CREATE TABLE user_dimension_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    correctness_score NUMERIC(5, 2) NOT NULL,
    edge_case_score NUMERIC(5, 2) NOT NULL,
    complexity_score NUMERIC(5, 2) NOT NULL,
    explanation_score NUMERIC(5, 2) NOT NULL,
    communication_score NUMERIC(5, 2) NOT NULL,
    debugging_score NUMERIC(5, 2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table tracking granular performance by topic and defect type
CREATE TABLE user_taxonomy_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_type VARCHAR(32) NOT NULL, -- 'topic' or 'defect_type'
    category_name VARCHAR(64) NOT NULL, -- 'linked_lists', 'edge_case_blindness', etc.
    total_attempts INT DEFAULT 0,
    successful_evaluations INT DEFAULT 0,
    average_score NUMERIC(5, 2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category_type, category_name)
);

```

---

## 6. Functional Requirements for Profile Engine

* **REQ-PROF-01 (Real-Time Metrics Recomputation):** Upon every submitted practice evaluation or mock assessment, the backend triggers an asynchronous calculation worker to update `readiness_score`, `verdict_accuracy`, and `user_taxonomy_stats`.
* **REQ-PROF-02 (Deficit Tagging):** If any dimension score falls below 60%, the dashboard must highlight it with a `CRITICAL DEFICIT` tag and render a direct CTA button: `[ Practice <Topic/Dimension> Now ]`.
* **REQ-PROF-03 (Historical Audit Retrieval):** Users can click on any past mock test or practice audit row in the profile table to re-open the split-view workspace in read-only mode, showing their submitted audit alongside the expert ground-truth diff.
* **REQ-PROF-04 (Streak Tracking):** Evaluates daily activity against UTC midnight. If no evaluations occur within a 36-hour window, the active streak resets to 0.

PRD Section Addendum: FAANG/FinTech Online Assessment (OA) Mode1. Functional Specification & State Transitions[Start 40-Min OA] ──► [Phase 1: Code & Test Sandbox] 
                             │
                             ▼ (Code Runs / Passes Tests)
                      [Phase 2: Self-Explanation & Complexity Audit]
                             │
                             ▼ (Submit Code + Notes)
                      [Phase 3: Gemini Dynamic Follow-Up Round]
                             │
                             ▼ (Submit Follow-Up Responses)
                      [Final Score & FinTech/FAANG Benchmark Report]
2. Gemini Follow-Up Prompt Contract (Phase 3)The backend route /api/oa/generate-followups must send the candidate's actual submission to Gemini using structured JSON output:JSON{
  "system_instruction": "You are a Principal Software Engineer conducting a high-stakes technical screening for Google/Citadel. Analyze the candidate's code and technical explanation. Generate 2 to 3 targeted follow-up technical questions probing edge-case fragility, asymptotic limits, or architectural trade-offs.",
  "prompt_payload": {
    "problem": "...",
    "constraints": "...",
    "submitted_code": "...",
    "user_claimed_time_complexity": "O(N log N)",
    "user_claimed_space_complexity": "O(N)"
  },
  "expected_output_schema": {
    "questions": [
      {
        "id": "q1",
        "category": "scale_and_constraints",
        "question": "Your solution uses a hash map of size N. If the input stream is 100 GB and memory is capped at 512 MB, how would you modify this architecture?"
      },
      {
        "id": "q2",
        "category": "edge_case_and_stability",
        "question": "What happens in line 18 if duplicate keys are present with conflicting timestamps?"
      }
    ]
  }
}
3. Database Schema Migration (Drizzle ORM)TypeScriptimport { pgTable, uuid, varchar, text, integer, numeric, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const oaAssessments = pgTable('oa_assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  companyProfile: varchar('company_profile', { length: 64 }).notNull(), // 'Citadel', 'Google', 'Fintech'
  problemId: uuid('problem_id').notNull(),
  
  // Submission Artifacts
  submittedCode: text('submitted_code').notNull(),
  language: varchar('language', { length: 32 }).notNull(),
  testsPassed: integer('tests_passed').notNull(),
  totalTests: integer('total_tests').notNull(),
  timeSpentSeconds: integer('time_spent_seconds').notNull(),
  
  // Written Notes & Follow-ups
  approachExplanation: text('approach_explanation'),
  claimedTimeComplexity: varchar('claimed_time_complexity', { length: 32 }),
  claimedSpaceComplexity: varchar('claimed_space_complexity', { length: 32 }),
  geminiFollowUps: jsonb('gemini_follow_ups'), // [{ question, userAnswer, score, feedback }]
  
  // Benchmark Scores
  overallScore: numeric('overall_score', { precision: 5, scale: 2 }).notNull(),
  correctnessScore: numeric('correctness_score', { precision: 5, scale: 2 }).notNull(),
  qualityScore: numeric('quality_score', { precision: 5, scale: 2 }).notNull(),
  complexityScore: numeric('complexity_score', { precision: 5, scale: 2 }).notNull(),
  communicationScore: numeric('communication_score', { precision: 5, scale: 2 }).notNull(),
  
  hiringBarVerdict: varchar('hiring_bar_verdict', { length: 32 }).notNull(), // 'STRONG_PASS', 'PASS', 'BORDERLINE', 'FAIL'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});
4. Post-Assessment Diagnostic Feedback BreakdownUpon submission, the Infographic dashboard displays:Test Case Matrix: Visible tests ($100\%$ required) + Hidden Edge-case Suite (large inputs, boundary conditions, zero/null inputs).Gemini Bar-Raiser Critique: Direct feedback on variable naming, readability, code smells, and idiomatic efficiency.Follow-Up Defense Evaluation: How well the candidate defended their complexity claims and scaled the system during the Gemini Q&A phase.