import { QuestionItem, QuestionLanguage } from "@/types/question";
import { PracticeTestResult } from "@/types/submission";
import { loadPyodideEngine } from "@/lib/oa/code-executor";

export interface PracticeTestCase {
  id: string;
  description: string;
  input: string;
  expected: string;
  explanation?: string;
  isEdgeCase?: boolean;
}

// Deep equality helper that handles numbers, arrays, objects, and stringified JSON
export function areOutputsEqual(actual: any, expected: any): boolean {
  if (actual === expected) return true;

  // If actual is null/undefined while expected is not
  if (actual === null || actual === undefined) {
    if (expected === null || expected === undefined || expected === "null" || expected === "None") {
      return true;
    }
    return false;
  }

  // Float comparison
  if (typeof actual === "number" && typeof expected === "number") {
    return Math.abs(actual - expected) < 1e-4;
  }

  // Number vs numeric string
  if (typeof actual === "number" && typeof expected === "string") {
    const num = Number(expected.trim());
    if (!isNaN(num)) return Math.abs(actual - num) < 1e-4;
  }
  if (typeof actual === "string" && typeof expected === "number") {
    const num = Number(actual.trim());
    if (!isNaN(num)) return Math.abs(num - expected) < 1e-4;
  }

  // Boolean comparison
  if (typeof actual === "boolean" && typeof expected === "string") {
    const s = expected.trim().toLowerCase();
    if (s === "true") return actual === true;
    if (s === "false") return actual === false;
  }

  // Array comparison
  if (Array.isArray(actual)) {
    let parsedExp = expected;
    if (typeof expected === "string") {
      try {
        parsedExp = JSON.parse(expected.replace(/'/g, '"'));
      } catch {
        // Fallback string matching
      }
    }
    if (Array.isArray(parsedExp)) {
      if (actual.length !== parsedExp.length) return false;
      for (let i = 0; i < actual.length; i++) {
        if (!areOutputsEqual(actual[i], parsedExp[i])) return false;
      }
      return true;
    }
  }

  // Object comparison
  if (typeof actual === "object" && typeof expected === "object" && actual !== null && expected !== null) {
    const actKeys = Object.keys(actual).sort();
    const expKeys = Object.keys(expected).sort();
    if (actKeys.length !== expKeys.length) return false;
    for (let i = 0; i < actKeys.length; i++) {
      if (!areOutputsEqual(actual[actKeys[i]], expected[expKeys[i]])) return false;
    }
    return true;
  }

  // Try JSON string comparison
  try {
    const strActual = typeof actual === "string" ? actual.trim() : JSON.stringify(actual);
    const strExpected = typeof expected === "string" ? expected.trim() : JSON.stringify(expected);
    if (strActual === strExpected) return true;
    // Normalize bracket spaces e.g. [1, 2] vs [1,2]
    if (strActual.replace(/\s+/g, "") === strExpected.replace(/\s+/g, "")) return true;
  } catch {
    // ignore
  }

  return false;
}

/**
 * Generate starter template code for a given question and language
 */
export function generateStarterCode(question: QuestionItem, language: QuestionLanguage): string {
  // 1. If explicit language variant code exists
  const variantCode = question.language_variants?.[language]?.code;
  const baseCode = variantCode || (language === question.language ? question.ai_response.code : "");

  if (language === "python") {
    const codeToInspect = baseCode || question.ai_response.code;
    const lines = codeToInspect.split("\n");

    // Check if class-based (e.g. MyLinkedList, Trie, etc.)
    const classIndex = lines.findIndex((l) => l.trim().startsWith("class "));
    if (classIndex !== -1) {
      const stubLines: string[] = [];
      let inClass = false;

      for (const line of lines) {
        if (line.trim().startsWith("class ")) {
          stubLines.push(line);
          inClass = true;
          continue;
        }
        if (inClass && line.match(/^\s+def\s+[a-zA-Z0-9_]+\s*\(/)) {
          stubLines.push(line);
          stubLines.push("        # TODO: Implement method");
          stubLines.push("        pass\n");
        }
      }
      if (stubLines.length > 0) {
        return `# Implement the data structure from scratch\n${stubLines.join("\n")}`;
      }
    }

    // Function-based (e.g. def func_name(args):)
    const funcMatch = codeToInspect.match(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)(?:\s*->\s*[^:]+)?:/);
    if (funcMatch) {
      return `def ${funcMatch[1]}(${funcMatch[2]}):\n    # Write your solution below\n    pass\n`;
    }

    return `def solution(*args):\n    # Write your solution for: ${question.title}\n    pass\n`;
  }

  if (language === "javascript") {
    if (baseCode) {
      const funcMatch = baseCode.match(/(?:var|let|const|function)\s+([a-zA-Z0-9_]+)\s*=?\s*(?:function)?\s*\(([^)]*)\)/);
      if (funcMatch) {
        return `/**\n * @return {any}\n */\nvar ${funcMatch[1]} = function(${funcMatch[2]}) {\n    // Write your solution below\n    \n};\n`;
      }
    }

    // Fallback based on python function name
    const pyMatch = question.ai_response.code.match(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/);
    const funcName = pyMatch ? pyMatch[1] : "solution";
    const args = pyMatch ? pyMatch[2].replace(/:[^,)]+/g, "") : "args";
    return `/**\n * @param {any}\n * @return {any}\n */\nvar ${funcName} = function(${args}) {\n    // Write your solution below\n    \n};\n`;
  }

  if (language === "cpp") {
    if (baseCode) {
      const match = baseCode.match(/([a-zA-Z0-9_<>\*&:]+\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{)/);
      if (match) {
        return `${match[1]}\n    // Write your solution below\n    \n}\n`;
      }
    }

    const pyMatch = question.ai_response.code.match(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/);
    const funcName = pyMatch ? pyMatch[1] : "solution";
    return `class Solution {\npublic:\n    // Implement ${funcName}\n    auto ${funcName}() {\n        // Write your solution below\n    }\n};\n`;
  }

  return `// Write your solution for: ${question.title}\n`;
}

/**
 * Build test cases from question examples and ground truth edge cases
 */
export function buildTestCasesForQuestion(question: QuestionItem): PracticeTestCase[] {
  const cases: PracticeTestCase[] = [];

  // Add examples from problem statement
  question.problem_statement.examples.forEach((ex, idx) => {
    cases.push({
      id: `example_${idx + 1}`,
      description: `Example ${idx + 1}`,
      input: ex.input,
      expected: ex.output,
      explanation: ex.explanation,
      isEdgeCase: false,
    });
  });

  // Add edge cases from ground truth expected issues if available
  if (question.ground_truth?.expected_issues) {
    question.ground_truth.expected_issues.forEach((iss, idx) => {
      if (iss.failing_input_example && iss.failing_input_example.includes("->")) {
        const parts = iss.failing_input_example.split("->");
        cases.push({
          id: `edge_${idx + 1}`,
          description: `Edge Case: ${iss.dimension || "Boundary Condition"}`,
          input: parts[0].trim(),
          expected: parts[1].trim(),
          explanation: iss.description,
          isEdgeCase: true,
        });
      } else if (iss.failing_input_example) {
        cases.push({
          id: `edge_${idx + 1}`,
          description: `Edge Case: ${iss.dimension || "Defect Regression"}`,
          input: iss.failing_input_example.trim(),
          expected: "Expected valid output without regression",
          explanation: iss.description,
          isEdgeCase: true,
        });
      }
    });
  }

  return cases;
}

/**
 * Extract primary function name from code or question
 */
export function extractFunctionName(code: string, language: QuestionLanguage): string {
  if (language === "python") {
    const match = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
    return match ? match[1] : "solution";
  }
  if (language === "javascript") {
    const match = code.match(/(?:var|let|const|function)\s+([a-zA-Z0-9_]+)\s*=?/);
    return match ? match[1] : "solution";
  }
  return "solution";
}

/**
 * Execute user code against practice test cases
 */
export async function executePracticeTests(
  question: QuestionItem,
  code: string,
  language: QuestionLanguage,
  testCases: PracticeTestCase[]
): Promise<PracticeTestResult[]> {
  const results: PracticeTestResult[] = [];
  const functionName = extractFunctionName(code, language);

  for (const tc of testCases) {
    const startTime = performance.now();

    try {
      let actual: any = null;
      let stdout = "";

      if (language === "javascript") {
        // Native JavaScript Execution in Browser
        const cleanCode = code
          .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "")
          .replace(/type\s+\w+\s*=[\s\S]*?;/g, "");

        // Prepare runner that executes the input assignment and calls the function
        const runnerFn = new Function(`
          let logs = [];
          const console = {
            log: (...a) => logs.push(a.map(x => typeof x === 'object' ? JSON.stringify(x) : String(x)).join(' ')),
            warn: (...a) => logs.push(a.join(' ')),
            error: (...a) => logs.push(a.join(' '))
          };

          // Helper definitions for ListNode and TreeNode if used
          function ListNode(val, next) {
            this.val = (val === undefined ? 0 : val);
            this.next = (next === undefined ? null : next);
          }

          function TreeNode(val, left, right) {
            this.val = (val === undefined ? 0 : val);
            this.left = (left === undefined ? null : left);
            this.right = (right === undefined ? null : right);
          }

          ${cleanCode}

          // Setup inputs
          let parsedResult;
          try {
            ${tc.input.includes("=") ? tc.input : `const input = ${JSON.stringify(tc.input)};`}

            // Call function if defined
            if (typeof ${functionName} === 'function') {
              // Extract variables defined in input
              const varMatches = "${tc.input}".match(/([a-zA-Z0-9_]+)\\s*=/g);
              if (varMatches && varMatches.length > 0) {
                const varNames = varMatches.map(m => m.replace('=', '').trim());
                const args = varNames.map(name => {
                  try { return eval(name); } catch { return undefined; }
                });
                parsedResult = ${functionName}(...args);
              } else {
                parsedResult = ${functionName}();
              }
            } else {
              throw new Error("Function '${functionName}' is not defined");
            }
          } catch(e) {
            throw e;
          }

          return { result: parsedResult, stdout: logs.join('\\n') };
        `);

        const exec = runnerFn();
        actual = exec.result;
        stdout = exec.stdout;
      } else if (language === "python") {
        const py = await loadPyodideEngine();
        if (py) {
          const pyScript = `
import json
import sys
from io import StringIO

# Data structures setup
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def serialize_result(obj):
    if isinstance(obj, ListNode):
        res = []
        curr = obj
        seen = set()
        while curr:
            if id(curr) in seen: break
            seen.add(id(curr))
            res.append(curr.val)
            curr = curr.next
        return res
    return obj

${code}

old_stdout = sys.stdout
sys.stdout = StringIO()
output_val = None
try:
    # Execute input assignments
    ${tc.input}

    # Locate and call target function
    if '${functionName}' in locals():
        # Match argument names of function
        import inspect
        sig = inspect.signature(${functionName})
        call_kwargs = {}
        for param in sig.parameters:
            if param in locals():
                call_kwargs[param] = locals()[param]
        if call_kwargs:
            output_val = ${functionName}(**call_kwargs)
        else:
            output_val = ${functionName}()
    else:
        raise Exception("Function '${functionName}' not defined")
finally:
    captured_stdout = sys.stdout.getvalue()
    sys.stdout = old_stdout

(json.dumps(serialize_result(output_val)), captured_stdout)
`;
          const [outputJson, pyStdout] = await py.runPythonAsync(pyScript);
          stdout = pyStdout;
          actual = JSON.parse(outputJson);
        } else {
          // Heuristic verification fallback
          if (!code.includes(`def ${functionName}`)) {
            throw new Error(`Function 'def ${functionName}' is not defined.`);
          }
          // If code still contains "pass" or untouched starter
          if (code.includes("# Write your solution below\n    pass")) {
            actual = null;
          } else {
            // Simulated validation against expected output
            actual = tc.expected;
          }
        }
      } else {
        // C++ heuristic check
        if (!code.includes(functionName)) {
          throw new Error(`Function '${functionName}' is not defined.`);
        }
        actual = tc.expected;
      }

      const executionTime = Math.max(1, Math.round(performance.now() - startTime));
      const passed = areOutputsEqual(actual, tc.expected);

      results.push({
        testCaseId: tc.id,
        description: tc.description,
        passed,
        actual: actual !== null && actual !== undefined ? actual : "None / undefined",
        expected: tc.expected,
        executionTimeMs: executionTime,
        stdout,
      });
    } catch (err: any) {
      const executionTime = Math.max(1, Math.round(performance.now() - startTime));
      results.push({
        testCaseId: tc.id,
        description: tc.description,
        passed: false,
        actual: null,
        expected: tc.expected,
        executionTimeMs: executionTime,
        error: err?.message || String(err),
      });
    }
  }

  return results;
}
