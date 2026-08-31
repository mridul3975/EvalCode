import { QuestionItem } from "@/types/question";

export const ARRAYS_STRINGS_QUESTIONS: QuestionItem[] = [
  {
    id: "q_arr_001",
    title: "Trapping Rain Water (LeetCode 42)",
    topic: "arrays",
    difficulty: "hard",
    language: "python",
    problem_statement: {
      description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
      examples: [
        {
          input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
          output: "6",
          explanation: "The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped."
        }
      ]
    },
    ai_response: {
      code: `def trap(height):\n    if not height:\n        return 0\n        \n    l, r = 0, len(height) - 1\n    left_max, right_max = height[l], height[r]\n    water = 0\n    \n    while l < r:\n        # Bug: Updates left_max/right_max after computing trapped water instead of before\n        if left_max < right_max:\n            l += 1\n            water += left_max - height[l]\n            left_max = max(left_max, height[l])\n        else:\n            r -= 1\n            water += right_max - height[r]\n            right_max = max(right_max, height[r])\n            \n    return water`,
      stated_explanation: "Uses two pointers from the left and right boundaries. Moves the pointer with the smaller max wall and accumulates trapped water.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_arr_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [12, 16],
          description: "Order of calculation error: `water += left_max - height[l]` calculates water before updating `left_max`. If `height[l] > left_max`, it adds a negative number to `water`, subtracting from the total trapped water.",
          failing_input_example: "height = [2, 0, 3]",
          why_it_matters: "In two-pointer rain water trapping, the maximum wall boundary must be updated prior to computing the trapped differential."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Single pass with two pointers inward."
      },
      corrected_code: `def trap(height):\n    if not height:\n        return 0\n    l, r = 0, len(height) - 1\n    left_max, right_max = height[l], height[r]\n    water = 0\n    while l < r:\n        if left_max < right_max:\n            l += 1\n            left_max = max(left_max, height[l])\n            water += left_max - height[l]\n        else:\n            r -= 1\n            right_max = max(right_max, height[r])\n            water += right_max - height[r]\n    return water`,
      model_critique_summary: "Calculated water trapped before updating left_max/right_max, causing negative water subtractions on taller bars."
    },
    language_variants: {
      cpp: {
        code: `auto trap(height) {\n    if ! height:\n        return 0\n        \n    l, r = 0, height.size() - 1\n    left_max, right_max = height[l], height[r]\n    water = 0\n    \n    while l < r:\n        // Bug: Updates left_max/right_max after computing trapped water instead of before\n        if left_max < right_max:\n            l += 1\n            water += left_max - height[l]\n            left_max = max(left_max, height[l])\n        else:\n            r -= 1\n            water += right_max - height[r]\n            right_max = max(right_max, height[r])\n            \n    return water`,
        corrected_code: `auto trap(height) {\n    if ! height:\n        return 0\n    l, r = 0, height.size() - 1\n    left_max, right_max = height[l], height[r]\n    water = 0\n    while l < r:\n        if left_max < right_max:\n            l += 1\n            left_max = max(left_max, height[l])\n            water += left_max - height[l]\n        else:\n            r -= 1\n            right_max = max(right_max, height[r])\n            water += right_max - height[r]\n    return water`,
      },
      javascript: {
        code: `var trap = function(height) {\n    if ! height:\n        return 0\n        \n    l, r = 0, height.length - 1\n    left_max, right_max = height[l], height[r]\n    water = 0\n    \n    while l < r:\n        // Bug: Updates left_max/right_max after computing trapped water instead of before\n        if left_max < right_max:\n            l += 1\n            water += left_max - height[l]\n            left_max = max(left_max, height[l])\n        else:\n            r -= 1\n            water += right_max - height[r]\n            right_max = max(right_max, height[r])\n            \n    return water`,
        corrected_code: `var trap = function(height) {\n    if ! height:\n        return 0\n    l, r = 0, height.length - 1\n    left_max, right_max = height[l], height[r]\n    water = 0\n    while l < r:\n        if left_max < right_max:\n            l += 1\n            left_max = max(left_max, height[l])\n            water += left_max - height[l]\n        else:\n            r -= 1\n            right_max = max(right_max, height[r])\n            water += right_max - height[r]\n    return water`,
      },
    }
  },

  {
    id: "q_arr_002",
    title: "3Sum (LeetCode 15)",
    topic: "arrays",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
      constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
      examples: [
        {
          input: "nums = [-1,0,1,2,-1,-4]",
          output: "[[-1,-1,2],[-1,0,1]]"
        }
      ]
    },
    ai_response: {
      code: `def threeSum(nums):\n    nums.sort()\n    res = []\n    \n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n            \n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            total = nums[i] + nums[l] + nums[r]\n            if total == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                l += 1\n                r -= 1\n                # Bug: Missing duplicate skip loop for l and r pointers\n            elif total < 0:\n                l += 1\n            else:\n                r -= 1\n                \n    return res`,
      stated_explanation: "Sorts array and fixes the first element. Uses two pointers l and r to find pairs summing to -nums[i]. Skips duplicates on the outer loop.",
      stated_time_complexity: "O(n^2)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug", "edge_case_blindness"],
      expected_issues: [
        {
          id: "iss_arr_02",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [16],
          description: "Duplicate triplet emission: Fails to skip consecutive identical values for `l` and `r` after finding a matching triplet (e.g. `while nums[l] == nums[l - 1] and l < r: l += 1`), generating duplicate entries in the result set.",
          failing_input_example: "nums = [-2, 0, 0, 2, 2] -> returns [[-2, 0, 2], [-2, 0, 2]]",
          why_it_matters: "Problem statement explicitly specifies 'the solution set must not contain duplicate triplets'."
        }
      ],
      optimal_complexity: {
        time: "O(n^2)",
        space: "O(1)",
        reasoning: "Sorting takes O(n log n) followed by n two-pointer scans taking O(n) each."
      },
      corrected_code: `def threeSum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            total = nums[i] + nums[l] + nums[r]\n            if total == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                l += 1\n                r -= 1\n                while l < r and nums[l] == nums[l - 1]:\n                    l += 1\n                while l < r and nums[r] == nums[r + 1]:\n                    r -= 1\n            elif total < 0:\n                l += 1\n            else:\n                r -= 1\n    return res`,
      model_critique_summary: "Omitted internal two-pointer duplicate skip loops resulting in duplicate triplets."
    },
    language_variants: {
      cpp: {
        code: `auto threeSum(nums) {\n    nums.sort()\n    res = []\n    \n    for i in range(nums.size() - 2):\n        if i > 0 && nums[i] == nums[i - 1]:\n            continue\n            \n        l, r = i + 1, nums.size() - 1\n        while l < r:\n            total = nums[i] + nums[l] + nums[r]\n            if total == 0:\n                res.push_back([nums[i], nums[l], nums[r]])\n                l += 1\n                r -= 1\n                // Bug: Missing duplicate skip loop for l && r pointers\n            elif total < 0:\n                l += 1\n            else:\n                r -= 1\n                \n    return res`,
        corrected_code: `auto threeSum(nums) {\n    nums.sort()\n    res = []\n    for i in range(nums.size() - 2):\n        if i > 0 && nums[i] == nums[i - 1]:\n            continue\n        l, r = i + 1, nums.size() - 1\n        while l < r:\n            total = nums[i] + nums[l] + nums[r]\n            if total == 0:\n                res.push_back([nums[i], nums[l], nums[r]])\n                l += 1\n                r -= 1\n                while l < r && nums[l] == nums[l - 1]:\n                    l += 1\n                while l < r && nums[r] == nums[r + 1]:\n                    r -= 1\n            elif total < 0:\n                l += 1\n            else:\n                r -= 1\n    return res`,
      },
      javascript: {
        code: `var threeSum = function(nums) {\n    nums.sort()\n    res = []\n    \n    for i in range(nums.length - 2):\n        if i > 0 && nums[i] == nums[i - 1]:\n            continue\n            \n        l, r = i + 1, nums.length - 1\n        while l < r:\n            total = nums[i] + nums[l] + nums[r]\n            if total == 0:\n                res.push([nums[i], nums[l], nums[r]])\n                l += 1\n                r -= 1\n                // Bug: Missing duplicate skip loop for l && r pointers\n            elif total < 0:\n                l += 1\n            else:\n                r -= 1\n                \n    return res`,
        corrected_code: `var threeSum = function(nums) {\n    nums.sort()\n    res = []\n    for i in range(nums.length - 2):\n        if i > 0 && nums[i] == nums[i - 1]:\n            continue\n        l, r = i + 1, nums.length - 1\n        while l < r:\n            total = nums[i] + nums[l] + nums[r]\n            if total == 0:\n                res.push([nums[i], nums[l], nums[r]])\n                l += 1\n                r -= 1\n                while l < r && nums[l] == nums[l - 1]:\n                    l += 1\n                while l < r && nums[r] == nums[r + 1]:\n                    r -= 1\n            elif total < 0:\n                l += 1\n            else:\n                r -= 1\n    return res`,
      },
    }
  },

  {
    id: "q_str_001",
    title: "Longest Substring Without Repeating Characters (LeetCode 3)",
    topic: "strings",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given a string `s`, find the length of the longest substring without repeating characters.",
      constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
      examples: [
        {
          input: 's = "abcabcbb"',
          output: "3",
          explanation: "The answer is \"abc\", with the length of 3."
        },
        {
          input: 's = "bbbbb"',
          output: "1"
        }
      ]
    },
    ai_response: {
      code: `def lengthOfLongestSubstring(s: str) -> int:\n    char_index = {}\n    max_len = 0\n    left = 0\n    \n    for right, char in enumerate(s):\n        if char in char_index:\n            # Bug: Does not clamp left boundary with max(left, ...)\n            left = char_index[char] + 1\n            \n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n        \n    return max_len`,
      stated_explanation: "Uses a sliding window with a dictionary storing the last seen index of each character. When a duplicate appears, moves the left pointer to last_seen + 1.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(min(m, n))"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_str_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [8],
          description: "Left pointer backwards jump regression: `left = char_index[char] + 1` blindly moves `left` backwards if a repeated character occurred before the current window's `left` boundary. Must use `left = max(left, char_index[char] + 1)`.",
          failing_input_example: 's = "abba"',
          why_it_matters: "On strings like 'abba', when the second 'a' appears at index 3, `char_index['a']` is 0, resetting `left` backwards to 1 instead of keeping `left` at 2."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(min(m, n))",
        reasoning: "Single pass sliding window with hash map."
      },
      corrected_code: `def lengthOfLongestSubstring(s: str) -> int:\n    char_index = {\n    max_len = 0\n    left = 0\n    for right, char in enumerate(s):\n        if char in char_index:\n            left = max(left, char_index[char] + 1)\n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len`,
      model_critique_summary: "Failed to clamp left pointer movement with max(left, char_index[char] + 1)."
    },
    language_variants: {
      cpp: {
        code: `def lengthOfLongestSubstring(s: str) -> int:\n    char_index = {}\n    max_len = 0\n    left = 0\n    \n    for right, char in enumerate(s):\n        if char in char_index:\n            // Bug: Does ! clamp left boundary with max(left, ...)\n            left = char_index[char] + 1\n            \n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n        \n    return max_len`,
        corrected_code: `def lengthOfLongestSubstring(s: str) -> int:\n    char_index = {\n    max_len = 0\n    left = 0\n    for right, char in enumerate(s):\n        if char in char_index:\n            left = max(left, char_index[char] + 1)\n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len`,
      },
      javascript: {
        code: `def lengthOfLongestSubstring(s: str) -> int:\n    char_index = {}\n    max_len = 0\n    left = 0\n    \n    for right, char in enumerate(s):\n        if char in char_index:\n            // Bug: Does ! clamp left boundary with max(left, ...)\n            left = char_index[char] + 1\n            \n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n        \n    return max_len`,
        corrected_code: `def lengthOfLongestSubstring(s: str) -> int:\n    char_index = {\n    max_len = 0\n    left = 0\n    for right, char in enumerate(s):\n        if char in char_index:\n            left = max(left, char_index[char] + 1)\n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len`,
      },
    }
  }
];
