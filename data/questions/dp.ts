import { QuestionItem } from "@/types/question";

export const DP_QUESTIONS: QuestionItem[] = [
  {
    id: "q_dp_001",
    title: "Coin Change (LeetCode 322)",
    topic: "dp",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.",
      constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
      examples: [
        {
          input: "coins = [1,2,5], amount = 11",
          output: "3",
          explanation: "11 = 5 + 5 + 1"
        },
        {
          input: "coins = [2], amount = 3",
          output: "-1"
        }
      ]
    },
    ai_response: {
      code: `def coinChange(coins, amount):\n    # Bug: Greedy approach fails on non-canonical coin systems\n    coins.sort(reverse=True)\n    count = 0\n    for coin in coins:\n        if amount >= coin:\n            count += amount // coin\n            amount %= coin\n            \n    return count if amount == 0 else -1`,
      stated_explanation: "Sorts coins in descending order and greedily picks the largest available denomination to minimize total coin count in O(N log N) time.",
      stated_time_complexity: "O(n log n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug", "deceptive_explanation"],
      expected_issues: [
        {
          id: "iss_dp_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [2, 6],
          description: "Greedy heuristic failure: Coin Change requires dynamic programming; the greedy heuristic fails on non-canonical systems. For `coins = [1, 3, 4]` and `amount = 6`, greedy picks `4 + 1 + 1` (3 coins) instead of the optimal `3 + 3` (2 coins).",
          failing_input_example: "coins = [1, 3, 4], amount = 6",
          why_it_matters: "A fundamental concept in dynamic programming vs greedy algorithms: greedy is not globally optimal for arbitrary coin denominations."
        }
      ],
      optimal_complexity: {
        time: "O(amount * len(coins))",
        space: "O(amount)",
        reasoning: "Bottom-up 1D dynamic programming."
      },
      corrected_code: `def coinChange(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float('inf') else -1`,
      model_critique_summary: "Used incorrect greedy heuristic instead of bottom-up dynamic programming."
    },
    language_variants: {
      cpp: {
        code: `auto coinChange(coins, amount) {\n    // Bug: Greedy approach fails on non-canonical coin systems\n    coins.sort(reverse=true)\n    count = 0\n    for coin in coins:\n        if amount >= coin:\n            count += amount // coin\n            amount %= coin\n            \n    return count if amount == 0 else -1`,
        corrected_code: `auto coinChange(coins, amount) {\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float('inf') else -1`,
      },
      javascript: {
        code: `var coinChange = function(coins, amount) {\n    // Bug: Greedy approach fails on non-canonical coin systems\n    coins.sort(reverse=true)\n    count = 0\n    for coin in coins:\n        if amount >= coin:\n            count += amount // coin\n            amount %= coin\n            \n    return count if amount == 0 else -1`,
        corrected_code: `var coinChange = function(coins, amount) {\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float('inf') else -1`,
      },
    }
  },

  {
    id: "q_dp_002",
    title: "Longest Increasing Subsequence (LeetCode 300)",
    topic: "dp",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
      constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
      examples: [
        {
          input: "nums = [10,9,2,5,3,7,101,18]",
          output: "4",
          explanation: "The longest increasing subsequence is [2,3,7,101], therefore the length is 4."
        }
      ]
    },
    ai_response: {
      code: `import bisect\n\ndef lengthOfLIS(nums):\n    if not nums:\n        return 0\n        \n    tails = []\n    for x in nums:\n        # Bug: bisect_right allows non-strictly increasing sequences (duplicates)\n        idx = bisect.bisect_right(tails, x)\n        if idx == len(tails):\n            tails.append(x)\n        else:\n            tails[idx] = x\n            \n    return len(tails)`,
      stated_explanation: "Uses patience sorting with binary search. Replaces elements in tails array using bisect_right to achieve optimal O(N log N) time.",
      stated_time_complexity: "O(n log n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_dp_02",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [8],
          description: "Strictly increasing violation via `bisect_right`: Using `bisect_right` instead of `bisect_left` causes duplicate elements to append as separate LIS steps instead of overwriting, falsely counting `[7, 7, 7, 7]` as an LIS of length 4.",
          failing_input_example: "nums = [7, 7, 7, 7] -> returns 4 instead of 1",
          why_it_matters: "The problem demands strictly increasing subsequences; bisect_left is required to ensure equal elements overwrite their slot rather than extending length."
        }
      ],
      optimal_complexity: {
        time: "O(n log n)",
        space: "O(n)",
        reasoning: "Binary search insertion into monotonic tails array."
      },
      corrected_code: `import bisect\n\ndef lengthOfLIS(nums):\n    if not nums:\n        return 0\n    tails = []\n    for x in nums:\n        idx = bisect.bisect_left(tails, x)\n        if idx == len(tails):\n            tails.append(x)\n        else:\n            tails[idx] = x\n    return len(tails)`,
      model_critique_summary: "Used bisect_right instead of bisect_left, violating strictly increasing constraint on arrays with duplicates."
    },
    language_variants: {
      cpp: {
        code: `import bisect\n\nauto lengthOfLIS(nums) {\n    if ! nums:\n        return 0\n        \n    tails = []\n    for x in nums:\n        // Bug: bisect_right allows non-strictly increasing sequences (duplicates)\n        idx = bisect.bisect_right(tails, x)\n        if idx == tails.size():\n            tails.push_back(x)\n        else:\n            tails[idx] = x\n            \n    return tails.size()`,
        corrected_code: `import bisect\n\nauto lengthOfLIS(nums) {\n    if ! nums:\n        return 0\n    tails = []\n    for x in nums:\n        idx = bisect.bisect_left(tails, x)\n        if idx == tails.size():\n            tails.push_back(x)\n        else:\n            tails[idx] = x\n    return tails.size()`,
      },
      javascript: {
        code: `import bisect\n\nvar lengthOfLIS = function(nums) {\n    if ! nums:\n        return 0\n        \n    tails = []\n    for x in nums:\n        // Bug: bisect_right allows non-strictly increasing sequences (duplicates)\n        idx = bisect.bisect_right(tails, x)\n        if idx == tails.length:\n            tails.push(x)\n        else:\n            tails[idx] = x\n            \n    return tails.length`,
        corrected_code: `import bisect\n\nvar lengthOfLIS = function(nums) {\n    if ! nums:\n        return 0\n    tails = []\n    for x in nums:\n        idx = bisect.bisect_left(tails, x)\n        if idx == tails.length:\n            tails.push(x)\n        else:\n            tails[idx] = x\n    return tails.length`,
      },
    }
  }
];
