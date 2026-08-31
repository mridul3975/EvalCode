import { QuestionItem } from "@/types/question";

export const BACKTRACKING_QUESTIONS: QuestionItem[] = [
  {
    id: "q_bt_001",
    title: "Subsets (LeetCode 78)",
    topic: "backtracking",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
      constraints: ["1 <= nums.length <= 10", "-10 <= nums[i] <= 10", "All the numbers of nums are unique."],
      examples: [
        {
          input: "nums = [1,2,3]",
          output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"
        }
      ]
    },
    ai_response: {
      code: `def subsets(nums):\n    res = []\n    subset = []\n    \n    def dfs(i):\n        if i >= len(nums):\n            res.append(subset) # Bug: Appending reference instead of copy\n            return\n        \n        subset.append(nums[i])\n        dfs(i + 1)\n        \n        subset.pop()\n        dfs(i + 1)\n        \n    dfs(0)\n    return res`,
      stated_explanation: "Explores include/exclude decisions. When index reaches len(nums), appends the subset to res.",
      stated_time_complexity: "O(2^n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug", "pointer_bug"],
      expected_issues: [
        {
          id: "iss_bt_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [6],
          description: "Mutating shared list reference: Appends `subset` directly instead of a shallow copy `subset.copy()` or `subset[:]`.",
          failing_input_example: "nums = [1, 2]",
          why_it_matters: "Passing lists by reference without copying during backtracking mutates all accumulated states to empty lists."
        }
      ],
      optimal_complexity: {
        time: "O(n * 2^n)",
        space: "O(n)",
        reasoning: "There are 2^n subsets, each taking O(n) construction time."
      },
      corrected_code: `def subsets(nums):\n    res = []\n    subset = []\n    def dfs(i):\n        if i >= len(nums):\n            res.append(subset[:])\n            return\n        subset.append(nums[i])\n        dfs(i + 1)\n        subset.pop()\n        dfs(i + 1)\n    dfs(0)\n    return res`,
      model_critique_summary: "Classic Python reference aliasing trap in backtracking."
    },
    language_variants: {
      cpp: {
        code: `auto subsets(nums) {\n    res = []\n    subset = []\n    \n    def dfs(i):\n        if i >= nums.size():\n            res.push_back(subset) // Bug: Appending reference instead of copy\n            return\n        \n        subset.push_back(nums[i])\n        dfs(i + 1)\n        \n        subset.pop_back()\n        dfs(i + 1)\n        \n    dfs(0)\n    return res`,
        corrected_code: `auto subsets(nums) {\n    res = []\n    subset = []\n    def dfs(i):\n        if i >= nums.size():\n            res.push_back(subset[:])\n            return\n        subset.push_back(nums[i])\n        dfs(i + 1)\n        subset.pop_back()\n        dfs(i + 1)\n    dfs(0)\n    return res`,
      },
      javascript: {
        code: `var subsets = function(nums) {\n    res = []\n    subset = []\n    \n    def dfs(i):\n        if i >= nums.length:\n            res.push(subset) // Bug: Appending reference instead of copy\n            return\n        \n        subset.push(nums[i])\n        dfs(i + 1)\n        \n        subset.pop()\n        dfs(i + 1)\n        \n    dfs(0)\n    return res`,
        corrected_code: `var subsets = function(nums) {\n    res = []\n    subset = []\n    def dfs(i):\n        if i >= nums.length:\n            res.push(subset[:])\n            return\n        subset.push(nums[i])\n        dfs(i + 1)\n        subset.pop()\n        dfs(i + 1)\n    dfs(0)\n    return res`,
      },
    }
  },

  {
    id: "q_bt_002",
    title: "Permutations (LeetCode 46)",
    topic: "backtracking",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.",
      constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All the integers of nums are unique."],
      examples: [
        {
          input: "nums = [1,2,3]",
          output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"
        }
      ]
    },
    ai_response: {
      code: `def permute(nums):\n    result = []\n    def backtrack(curr, remaining):\n        if not remaining:\n            result.append(list(curr))\n            return\n        for i in range(len(remaining)):\n            # Bug: Slicing remaining[i:] includes remaining[i] again\n            backtrack(curr + [remaining[i]], remaining[:i] + remaining[i:])\n    backtrack([], nums)\n    return result`,
      stated_explanation: "Recursively picks each element from remaining and adds it to curr.",
      stated_time_complexity: "O(n * n!)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_bt_02",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [8],
          description: "Off-by-one slicing error: `remaining[i:]` includes `remaining[i]` again. Slicing must be `remaining[i+1:]`.",
          failing_input_example: "nums = [1, 2]",
          why_it_matters: "Slicing without +1 results in infinite recursion."
        }
      ],
      optimal_complexity: {
        time: "O(n * n!)",
        space: "O(n)",
        reasoning: "n! permutations with n construction cost."
      },
      corrected_code: `def permute(nums):\n    result = []\n    def backtrack(curr, remaining):\n        if not remaining:\n            result.append(list(curr))\n            return\n        for i in range(len(remaining)):\n            backtrack(curr + [remaining[i]], remaining[:i] + remaining[i+1:])\n    backtrack([], nums)\n    return result`,
      model_critique_summary: "Off-by-one slice omission."
    },
    language_variants: {
      cpp: {
        code: `auto permute(nums) {\n    result = []\n    def backtrack(curr, remaining):\n        if ! remaining:\n            result.push_back(list(curr))\n            return\n        for i in range(remaining.size()):\n            // Bug: Slicing remaining[i:] includes remaining[i] again\n            backtrack(curr + [remaining[i]], remaining[:i] + remaining[i:])\n    backtrack([], nums)\n    return result`,
        corrected_code: `auto permute(nums) {\n    result = []\n    def backtrack(curr, remaining):\n        if ! remaining:\n            result.push_back(list(curr))\n            return\n        for i in range(remaining.size()):\n            backtrack(curr + [remaining[i]], remaining[:i] + remaining[i+1:])\n    backtrack([], nums)\n    return result`,
      },
      javascript: {
        code: `var permute = function(nums) {\n    result = []\n    def backtrack(curr, remaining):\n        if ! remaining:\n            result.push(list(curr))\n            return\n        for i in range(remaining.length):\n            // Bug: Slicing remaining[i:] includes remaining[i] again\n            backtrack(curr + [remaining[i]], remaining[:i] + remaining[i:])\n    backtrack([], nums)\n    return result`,
        corrected_code: `var permute = function(nums) {\n    result = []\n    def backtrack(curr, remaining):\n        if ! remaining:\n            result.push(list(curr))\n            return\n        for i in range(remaining.length):\n            backtrack(curr + [remaining[i]], remaining[:i] + remaining[i+1:])\n    backtrack([], nums)\n    return result`,
      },
    }
  },

  {
    id: "q_bt_003",
    title: "Permutations II with Duplicates (LeetCode 47)",
    topic: "backtracking",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given a collection of numbers, `nums`, that might contain duplicates, return all possible unique permutations in any order.",
      constraints: ["1 <= nums.length <= 8", "-10 <= nums[i] <= 10"],
      examples: [
        {
          input: "nums = [1,1,2]",
          output: "[[1,1,2],[1,2,1],[2,1,1]]"
        }
      ]
    },
    ai_response: {
      code: `def permuteUnique(nums):\n    res = []\n    nums.sort()\n    used = [False] * len(nums)\n    \n    def backtrack(path):\n        if len(path) == len(nums):\n            res.append(path[:])\n            return\n            \n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            # Bug: skips duplicates only if used[i-1] is True instead of False\n            if i > 0 and nums[i] == nums[i-1] and used[i-1]:\n                continue\n                \n            used[i] = True\n            path.append(nums[i])\n            backtrack(path)\n            path.pop()\n            used[i] = False\n            \n    backtrack([])\n    return res`,
      stated_explanation: "Sorts nums and tracks used array. Prunes duplicate permutations using used[i-1] check.",
      stated_time_complexity: "O(n * n!)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_bt_03",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [14],
          description: "Inverted duplicate pruning condition: `if i > 0 and nums[i] == nums[i-1] and used[i-1]: continue` prevents using duplicate numbers within the same permutation and fails to eliminate identical duplicate branches. Must check `not used[i-1]`.",
          failing_input_example: "nums = [1, 1, 2]",
          why_it_matters: "Checking used[i-1] instead of not used[i-1] completely breaks duplicate permutation pruning."
        }
      ],
      optimal_complexity: {
        time: "O(n * n!)",
        space: "O(n)",
        reasoning: "Unique permutations bounded by multinomial coefficients."
      },
      corrected_code: `def permuteUnique(nums):\n    res = []\n    nums.sort()\n    used = [False] * len(nums)\n    def backtrack(path):\n        if len(path) == len(nums):\n            res.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:\n                continue\n            used[i] = True\n            path.append(nums[i])\n            backtrack(path)\n            path.pop()\n            used[i] = False\n    backtrack([])\n    return res`,
      model_critique_summary: "Inverted boolean condition in duplicate permutation pruning."
    },
    language_variants: {
      cpp: {
        code: `auto permuteUnique(nums) {\n    res = []\n    nums.sort()\n    used = [false] * nums.size()\n    \n    def backtrack(path):\n        if path.size() == nums.size():\n            res.push_back(path[:])\n            return\n            \n        for i in range(nums.size()):\n            if used[i]:\n                continue\n            // Bug: skips duplicates only if used[i-1] is true instead of false\n            if i > 0 && nums[i] == nums[i-1] && used[i-1]:\n                continue\n                \n            used[i] = true\n            path.push_back(nums[i])\n            backtrack(path)\n            path.pop_back()\n            used[i] = false\n            \n    backtrack([])\n    return res`,
        corrected_code: `auto permuteUnique(nums) {\n    res = []\n    nums.sort()\n    used = [false] * nums.size()\n    def backtrack(path):\n        if path.size() == nums.size():\n            res.push_back(path[:])\n            return\n        for i in range(nums.size()):\n            if used[i]:\n                continue\n            if i > 0 && nums[i] == nums[i-1] && ! used[i-1]:\n                continue\n            used[i] = true\n            path.push_back(nums[i])\n            backtrack(path)\n            path.pop_back()\n            used[i] = false\n    backtrack([])\n    return res`,
      },
      javascript: {
        code: `var permuteUnique = function(nums) {\n    res = []\n    nums.sort()\n    used = [false] * nums.length\n    \n    def backtrack(path):\n        if path.length == nums.length:\n            res.push(path[:])\n            return\n            \n        for i in range(nums.length):\n            if used[i]:\n                continue\n            // Bug: skips duplicates only if used[i-1] is true instead of false\n            if i > 0 && nums[i] == nums[i-1] && used[i-1]:\n                continue\n                \n            used[i] = true\n            path.push(nums[i])\n            backtrack(path)\n            path.pop()\n            used[i] = false\n            \n    backtrack([])\n    return res`,
        corrected_code: `var permuteUnique = function(nums) {\n    res = []\n    nums.sort()\n    used = [false] * nums.length\n    def backtrack(path):\n        if path.length == nums.length:\n            res.push(path[:])\n            return\n        for i in range(nums.length):\n            if used[i]:\n                continue\n            if i > 0 && nums[i] == nums[i-1] && ! used[i-1]:\n                continue\n            used[i] = true\n            path.push(nums[i])\n            backtrack(path)\n            path.pop()\n            used[i] = false\n    backtrack([])\n    return res`,
      },
    }
  },

  {
    id: "q_bt_004",
    title: "Generate Parentheses (LeetCode 22)",
    topic: "backtracking",
    difficulty: "medium",
    language: "javascript",
    problem_statement: {
      description: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
      constraints: ["1 <= n <= 8"],
      examples: [
        {
          input: "n = 3",
          output: '["((()))","(()())","(())()","()(())","()()()"]'
        }
      ]
    },
    ai_response: {
      code: `function generateParenthesis(n) {\n  const result = [];\n  function backtrack(current, open, close) {\n    if (current.length === 2 * n) {\n      result.push(current);\n      return;\n    }\n    if (open < n) {\n      backtrack(current + "(", open + 1, close);\n    }\n    if (close < n) {\n      backtrack(current + ")", open, close + 1);\n    }\n  }\n  backtrack("", 0, 0);\n  return result;\n}`,
      stated_explanation: "Generates combinations by adding open and close brackets until length is 2n.",
      stated_time_complexity: "O(4^n / sqrt(n))",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_bt_04",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [11],
          description: "Prefix balance violation: `if (close < n)` allows adding `)` even when `close >= open`.",
          failing_input_example: "n = 1",
          why_it_matters: "A well-formed parenthesis sequence requires close < open."
        }
      ],
      optimal_complexity: {
        time: "O(4^n / sqrt(n))",
        space: "O(n)",
        reasoning: "Catalan number growth rate."
      },
      corrected_code: `function generateParenthesis(n) {\n  const result = [];\n  function backtrack(current, open, close) {\n    if (current.length === 2 * n) {\n      result.push(current);\n      return;\n    }\n    if (open < n) {\n      backtrack(current + "(", open + 1, close);\n    }\n    if (close < open) {\n      backtrack(current + ")", open, close + 1);\n    }\n  }\n  backtrack("", 0, 0);\n  return result;\n`,
      model_critique_summary: "Prefix balance violation in parenthesis generation."
    },
    language_variants: {
      cpp: {
        code: `function generateParenthesis(n) {\n  const result = [];\n  function backtrack(current, open, close) {\n    if (current.length === 2 * n) {\n      result.push(current);\n      return;\n    }\n    if (open < n) {\n      backtrack(current + "(", open + 1, close);\n    }\n    if (close < n) {\n      backtrack(current + ")", open, close + 1);\n    }\n  }\n  backtrack("", 0, 0);\n  return result;\n}`,
        corrected_code: `function generateParenthesis(n) {\n  const result = [];\n  function backtrack(current, open, close) {\n    if (current.length === 2 * n) {\n      result.push(current);\n      return;\n    }\n    if (open < n) {\n      backtrack(current + "(", open + 1, close);\n    }\n    if (close < open) {\n      backtrack(current + ")", open, close + 1);\n    }\n  }\n  backtrack("", 0, 0);\n  return result;\n`,
      },
      javascript: {
        code: `function generateParenthesis(n) {\n  const result = [];\n  function backtrack(current, open, close) {\n    if (current.length === 2 * n) {\n      result.push(current);\n      return;\n    }\n    if (open < n) {\n      backtrack(current + "(", open + 1, close);\n    }\n    if (close < n) {\n      backtrack(current + ")", open, close + 1);\n    }\n  }\n  backtrack("", 0, 0);\n  return result;\n}`,
        corrected_code: `function generateParenthesis(n) {\n  const result = [];\n  function backtrack(current, open, close) {\n    if (current.length === 2 * n) {\n      result.push(current);\n      return;\n    }\n    if (open < n) {\n      backtrack(current + "(", open + 1, close);\n    }\n    if (close < open) {\n      backtrack(current + ")", open, close + 1);\n    }\n  }\n  backtrack("", 0, 0);\n  return result;\n`,
      },
    }
  },

  {
    id: "q_bt_005",
    title: "Letter Combinations of a Phone Number (LeetCode 17)",
    topic: "backtracking",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. If digits is empty, return an empty array.",
      constraints: ["0 <= digits.length <= 4", "digits[i] is a digit in the range ['2', '9']."],
      examples: [
        {
          input: 'digits = "23"',
          output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]'
        },
        {
          input: 'digits = ""',
          output: "[]"
        }
      ]
    },
    ai_response: {
      code: `def letterCombinations(digits: str):\n    mapping = {\n        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",\n        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"\n    }\n    res = []\n    def backtrack(index, path):\n        if index == len(digits):\n            res.append("".join(path))\n            return\n        for char in mapping[digits[index]]:\n            backtrack(index + 1, path + [char])\n    backtrack(0, [])\n    return res`,
      stated_explanation: "Recursively matches each digit to mapped letters.",
      stated_time_complexity: "O(4^n * n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "minor_issue",
      defect_type: "edge_case_blindness",
      error_categories: ["edge_case_blindness"],
      expected_issues: [
        {
          id: "iss_bt_05",
          severity: "major",
          dimension: "edge_case",
          line_numbers: [13],
          description: "Fails empty input boundary: When `digits = \"\"`, returns `[\"\"]` instead of `[]`.",
          failing_input_example: 'digits = ""',
          why_it_matters: "LeetCode 17 specifically mandates returning an empty list on empty string input."
        }
      ],
      optimal_complexity: {
        time: "O(4^n * n)",
        space: "O(n)",
        reasoning: "At most 4 letters per digit with recursion depth n."
      },
      corrected_code: `def letterCombinations(digits: str):\n    if not digits: return []\n    mapping = {\n        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",\n        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"\n    }\n    res = []\n    def backtrack(index, path):\n        if index == len(digits):\n            res.append("".join(path))\n            return\n        for char in mapping[digits[index]]:\n            backtrack(index + 1, path + [char])\n    backtrack(0, [])\n    return res`,
      model_critique_summary: "Empty input string returns [''] instead of []."
    },
    language_variants: {
      cpp: {
        code: `auto letterCombinations(string digits) {\n    mapping = {\n        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",\n        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"\n    }\n    res = []\n    def backtrack(index, path):\n        if index == digits.size():\n            res.push_back("".join(path))\n            return\n        for char in mapping[digits[index]]:\n            backtrack(index + 1, path + [char])\n    backtrack(0, [])\n    return res`,
        corrected_code: `auto letterCombinations(string digits) {\n    if ! digits: return []\n    mapping = {\n        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",\n        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"\n    }\n    res = []\n    def backtrack(index, path):\n        if index == digits.size():\n            res.push_back("".join(path))\n            return\n        for char in mapping[digits[index]]:\n            backtrack(index + 1, path + [char])\n    backtrack(0, [])\n    return res`,
      },
      javascript: {
        code: `var letterCombinations = function(digits) {\n    mapping = {\n        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",\n        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"\n    }\n    res = []\n    def backtrack(index, path):\n        if index == digits.length:\n            res.push("".join(path))\n            return\n        for char in mapping[digits[index]]:\n            backtrack(index + 1, path + [char])\n    backtrack(0, [])\n    return res`,
        corrected_code: `var letterCombinations = function(digits) {\n    if ! digits: return []\n    mapping = {\n        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",\n        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"\n    }\n    res = []\n    def backtrack(index, path):\n        if index == digits.length:\n            res.push("".join(path))\n            return\n        for char in mapping[digits[index]]:\n            backtrack(index + 1, path + [char])\n    backtrack(0, [])\n    return res`,
      },
    }
  }
];
