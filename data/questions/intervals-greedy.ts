import { QuestionItem } from "@/types/question";

export const INTERVALS_GREEDY_QUESTIONS: QuestionItem[] = [
  {
    id: "q_int_001",
    title: "Merge Intervals (LeetCode 56)",
    topic: "intervals",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      constraints: ["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= start_i <= end_i <= 10^4"],
      examples: [
        {
          input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
          output: "[[1,6],[8,10],[15,18]]"
        }
      ]
    },
    ai_response: {
      code: `def merge(intervals):\n    # Bug: Assumes input is already sorted by start time\n    if not intervals:\n        return []\n        \n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        prev = merged[-1]\n        if current[0] <= prev[1]:\n            prev[1] = max(prev[1], current[1])\n        else:\n            merged.append(current)\n            \n    return merged`,
      stated_explanation: "Iterates through intervals merging overlapping ranges in linear O(N) time.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug", "deceptive_explanation"],
      expected_issues: [
        {
          id: "iss_int_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [2, 5],
          description: "Missing sort prerequisite: Assumes input is sorted by start_i.",
          failing_input_example: "intervals = [[2, 6], [1, 3]]",
          why_it_matters: "Merge intervals is fundamentally an O(N log N) sorting problem."
        }
      ],
      optimal_complexity: {
        time: "O(n log n)",
        space: "O(n)",
        reasoning: "Sorting intervals by start time."
      },
      corrected_code: `def merge(intervals):\n    if not intervals: return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        prev = merged[-1]\n        if current[0] <= prev[1]:\n            prev[1] = max(prev[1], current[1])\n        else:\n            merged.append(current)\n    return merged`,
      model_critique_summary: "Failed to sort intervals prior to merging."
    },
    language_variants: {
      cpp: {
        code: `auto merge(intervals) {\n    // Bug: Assumes input is already sorted by start time\n    if ! intervals:\n        return []\n        \n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        prev = merged[-1]\n        if current[0] <= prev[1]:\n            prev[1] = max(prev[1], current[1])\n        else:\n            merged.push_back(current)\n            \n    return merged`,
        corrected_code: `auto merge(intervals) {\n    if ! intervals: return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        prev = merged[-1]\n        if current[0] <= prev[1]:\n            prev[1] = max(prev[1], current[1])\n        else:\n            merged.push_back(current)\n    return merged`,
      },
      javascript: {
        code: `var merge = function(intervals) {\n    // Bug: Assumes input is already sorted by start time\n    if ! intervals:\n        return []\n        \n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        prev = merged[-1]\n        if current[0] <= prev[1]:\n            prev[1] = max(prev[1], current[1])\n        else:\n            merged.push(current)\n            \n    return merged`,
        corrected_code: `var merge = function(intervals) {\n    if ! intervals: return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        prev = merged[-1]\n        if current[0] <= prev[1]:\n            prev[1] = max(prev[1], current[1])\n        else:\n            merged.push(current)\n    return merged`,
      },
    }
  },

  {
    id: "q_int_002",
    title: "Non-overlapping Intervals (LeetCode 435)",
    topic: "intervals",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Return minimum intervals to remove to make the rest non-overlapping.",
      constraints: ["1 <= intervals.length <= 10^5"],
      examples: [
        {
          input: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
          output: "1"
        }
      ]
    },
    ai_response: {
      code: `def eraseOverlapIntervals(intervals):\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    prev_end = float('-inf')\n    for start, end in intervals:\n        if start >= prev_end:\n            prev_end = end\n        else:\n            count += 1\n    return count`,
      stated_explanation: "Greedy sort by end time.",
      stated_time_complexity: "O(n log n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n log n)",
        space: "O(1)",
        reasoning: "Greedy scheduling."
      },
      corrected_code: `def eraseOverlapIntervals(intervals):\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    prev_end = float('-inf')\n    for start, end in intervals:\n        if start >= prev_end:\n            prev_end = end\n        else:\n            count += 1\n    return count`,
      model_critique_summary: "Optimal, completely correct greedy scheduling."
    },
    language_variants: {
      cpp: {
        code: `auto eraseOverlapIntervals(intervals) {\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    prev_end = float('-inf')\n    for start, end in intervals:\n        if start >= prev_end:\n            prev_end = end\n        else:\n            count += 1\n    return count`,
        corrected_code: `auto eraseOverlapIntervals(intervals) {\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    prev_end = float('-inf')\n    for start, end in intervals:\n        if start >= prev_end:\n            prev_end = end\n        else:\n            count += 1\n    return count`,
      },
      javascript: {
        code: `var eraseOverlapIntervals = function(intervals) {\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    prev_end = float('-inf')\n    for start, end in intervals:\n        if start >= prev_end:\n            prev_end = end\n        else:\n            count += 1\n    return count`,
        corrected_code: `var eraseOverlapIntervals = function(intervals) {\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    prev_end = float('-inf')\n    for start, end in intervals:\n        if start >= prev_end:\n            prev_end = end\n        else:\n            count += 1\n    return count`,
      },
    }
  },

  {
    id: "q_int_253",
    title: "Meeting Rooms II (LeetCode 253)",
    topic: "intervals",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required.",
      constraints: ["1 <= intervals.length <= 10^4", "0 <= start_i < end_i <= 10^6"],
      examples: [
        {
          input: "intervals = [[0,30],[5,10],[15,20]]",
          output: "2"
        }
      ]
    },
    ai_response: {
      code: `import heapq\n\ndef minMeetingRooms(intervals):\n    if not intervals: return 0\n    intervals.sort(key=lambda x: x[0])\n    rooms = [] # min-heap of meeting end times\n    \n    for start, end in intervals:\n        # Bug: uses rooms[0] > start instead of rooms[0] <= start to free a room\n        if rooms and rooms[0] > start:\n            heapq.heappop(rooms)\n        heapq.heappush(rooms, end)\n        \n    return len(rooms)`,
      stated_explanation: "Sorts intervals by start time and tracks room end times in a min-heap.",
      stated_time_complexity: "O(n log n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_int_253_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [8],
          description: "Inverted room release condition: `rooms[0] > start` pops a room when the ongoing meeting has *not yet finished*, while failing to reuse rooms whose meetings *have* completed (`rooms[0] <= start`).",
          failing_input_example: "intervals = [[0, 10], [10, 20]] (should require 1 room, returns 2)",
          why_it_matters: "A conference room can only be freed if the earliest meeting end time is <= current meeting start time."
        }
      ],
      optimal_complexity: {
        time: "O(n log n)",
        space: "O(n)",
        reasoning: "Sorting + min heap tracking."
      },
      corrected_code: `import heapq\ndef minMeetingRooms(intervals):\n    if not intervals: return 0\n    intervals.sort(key=lambda x: x[0])\n    rooms = []\n    for start, end in intervals:\n        if rooms and rooms[0] <= start:\n            heapq.heappop(rooms)\n        heapq.heappush(rooms, end)\n    return len(rooms)`,
      model_critique_summary: "Inverted meeting room release comparison."
    },
    language_variants: {
      cpp: {
        code: `import heapq\n\nauto minMeetingRooms(intervals) {\n    if ! intervals: return 0\n    intervals.sort(key=lambda x: x[0])\n    rooms = [] // min-heap of meeting end times\n    \n    for start, end in intervals:\n        # Bug: uses rooms[0] > start instead of rooms[0] <= start to free a room\n        if rooms && rooms[0] > start:\n            heapq.heappop(rooms)\n        heapq.heappush(rooms, end)\n        \n    return rooms.size()`,
        corrected_code: `import heapq\nauto minMeetingRooms(intervals) {\n    if ! intervals: return 0\n    intervals.sort(key=lambda x: x[0])\n    rooms = []\n    for start, end in intervals:\n        if rooms && rooms[0] <= start:\n            heapq.heappop(rooms)\n        heapq.heappush(rooms, end)\n    return rooms.size()`,
      },
      javascript: {
        code: `import heapq\n\nvar minMeetingRooms = function(intervals) {\n    if ! intervals: return 0\n    intervals.sort(key=lambda x: x[0])\n    rooms = [] // min-heap of meeting end times\n    \n    for start, end in intervals:\n        # Bug: uses rooms[0] > start instead of rooms[0] <= start to free a room\n        if rooms && rooms[0] > start:\n            heapq.heappop(rooms)\n        heapq.heappush(rooms, end)\n        \n    return rooms.length`,
        corrected_code: `import heapq\nvar minMeetingRooms = function(intervals) {\n    if ! intervals: return 0\n    intervals.sort(key=lambda x: x[0])\n    rooms = []\n    for start, end in intervals:\n        if rooms && rooms[0] <= start:\n            heapq.heappop(rooms)\n        heapq.heappush(rooms, end)\n    return rooms.length`,
      },
    }
  },

  {
    id: "q_int_055",
    title: "Jump Game (LeetCode 55)",
    topic: "greedy",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Return true if you can reach the last index of array nums.",
      constraints: ["1 <= nums.length <= 10^4"],
      examples: [
        {
          input: "nums = [2,3,1,1,4]",
          output: "true"
        }
      ]
    },
    ai_response: {
      code: `def canJump(nums):\n    max_reach = 0\n    for i in range(len(nums)):\n        # Bug: Does not check if current index is reachable\n        max_reach = max(max_reach, i + nums[i])\n        if max_reach >= len(nums) - 1: return True\n    return max_reach >= len(nums) - 1`,
      stated_explanation: "Greedy max reach.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_greedy_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [4],
          description: "Missing unreachable guard `if i > max_reach: return False`.",
          failing_input_example: "nums = [0, 2, 3]",
          why_it_matters: "Cannot extend reach from unreachable indices."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Single pass."
      },
      corrected_code: `def canJump(nums):\n    max_reach = 0\n    for i in range(len(nums)):\n        if i > max_reach: return False\n        max_reach = max(max_reach, i + nums[i])\n        if max_reach >= len(nums) - 1: return True\n    return True`,
      model_critique_summary: "Missing i > max_reach guard."
    },
    language_variants: {
      cpp: {
        code: `auto canJump(nums) {\n    max_reach = 0\n    for i in range(nums.size()):\n        // Bug: Does ! check if current index is reachable\n        max_reach = max(max_reach, i + nums[i])\n        if max_reach >= nums.size() - 1: return true\n    return max_reach >= nums.size() - 1`,
        corrected_code: `auto canJump(nums) {\n    max_reach = 0\n    for i in range(nums.size()):\n        if i > max_reach: return false\n        max_reach = max(max_reach, i + nums[i])\n        if max_reach >= nums.size() - 1: return true\n    return true`,
      },
      javascript: {
        code: `var canJump = function(nums) {\n    max_reach = 0\n    for i in range(nums.length):\n        // Bug: Does ! check if current index is reachable\n        max_reach = max(max_reach, i + nums[i])\n        if max_reach >= nums.length - 1: return true\n    return max_reach >= nums.length - 1`,
        corrected_code: `var canJump = function(nums) {\n    max_reach = 0\n    for i in range(nums.length):\n        if i > max_reach: return false\n        max_reach = max(max_reach, i + nums[i])\n        if max_reach >= nums.length - 1: return true\n    return true`,
      },
    }
  },

  {
    id: "q_int_045",
    title: "Jump Game II (LeetCode 45)",
    topic: "greedy",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Return the minimum number of jumps to reach the last index in `nums`.",
      constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000"],
      examples: [
        {
          input: "nums = [2,3,1,1,4]",
          output: "2"
        }
      ]
    },
    ai_response: {
      code: `def jump(nums):\n    jumps = 0\n    curr_end = 0\n    farthest = 0\n    \n    for i in range(len(nums) - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == curr_end:\n            jumps += 1\n            curr_end = farthest\n            \n    return jumps`,
      stated_explanation: "Greedy BFS interval jump calculation. Increments jumps when reaching current window boundary `curr_end`.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Single pass greedy BFS horizon."
      },
      corrected_code: `def jump(nums):\n    jumps = 0\n    curr_end = 0\n    farthest = 0\n    for i in range(len(nums) - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == curr_end:\n            jumps += 1\n            curr_end = farthest\n    return jumps`,
      model_critique_summary: "Optimal, completely correct greedy jump BFS."
    },
    language_variants: {
      cpp: {
        code: `auto jump(nums) {\n    jumps = 0\n    curr_end = 0\n    farthest = 0\n    \n    for i in range(nums.size() - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == curr_end:\n            jumps += 1\n            curr_end = farthest\n            \n    return jumps`,
        corrected_code: `auto jump(nums) {\n    jumps = 0\n    curr_end = 0\n    farthest = 0\n    for i in range(nums.size() - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == curr_end:\n            jumps += 1\n            curr_end = farthest\n    return jumps`,
      },
      javascript: {
        code: `var jump = function(nums) {\n    jumps = 0\n    curr_end = 0\n    farthest = 0\n    \n    for i in range(nums.length - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == curr_end:\n            jumps += 1\n            curr_end = farthest\n            \n    return jumps`,
        corrected_code: `var jump = function(nums) {\n    jumps = 0\n    curr_end = 0\n    farthest = 0\n    for i in range(nums.length - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == curr_end:\n            jumps += 1\n            curr_end = farthest\n    return jumps`,
      },
    }
  },

  {
    id: "q_int_134",
    title: "Gas Station (LeetCode 134)",
    topic: "greedy",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Return starting gas station index to complete circular journey.",
      constraints: ["1 <= n <= 10^5"],
      examples: [
        {
          input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
          output: "3"
        }
      ]
    },
    ai_response: {
      code: `def canCompleteCircuit(gas, cost):\n    if sum(gas) < sum(cost): return -1\n    curr_tank = 0\n    starting_station = 0\n    for i in range(len(gas)):\n        curr_tank += gas[i] - cost[i]\n        if curr_tank < 0:\n            starting_station = i + 1\n            curr_tank = 0\n    return starting_station`,
      stated_explanation: "Single pass greedy fuel reset.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Single pass."
      },
      corrected_code: `def canCompleteCircuit(gas, cost):\n    if sum(gas) < sum(cost): return -1\n    curr_tank = 0\n    starting_station = 0\n    for i in range(len(gas)):\n        curr_tank += gas[i] - cost[i]\n        if curr_tank < 0:\n            starting_station = i + 1\n            curr_tank = 0\n    return starting_station`,
      model_critique_summary: "Optimal, completely correct greedy circuit evaluation."
    },
    language_variants: {
      cpp: {
        code: `auto canCompleteCircuit(gas, cost) {\n    if sum(gas) < sum(cost): return -1\n    curr_tank = 0\n    starting_station = 0\n    for i in range(gas.size()):\n        curr_tank += gas[i] - cost[i]\n        if curr_tank < 0:\n            starting_station = i + 1\n            curr_tank = 0\n    return starting_station`,
        corrected_code: `auto canCompleteCircuit(gas, cost) {\n    if sum(gas) < sum(cost): return -1\n    curr_tank = 0\n    starting_station = 0\n    for i in range(gas.size()):\n        curr_tank += gas[i] - cost[i]\n        if curr_tank < 0:\n            starting_station = i + 1\n            curr_tank = 0\n    return starting_station`,
      },
      javascript: {
        code: `var canCompleteCircuit = function(gas, cost) {\n    if sum(gas) < sum(cost): return -1\n    curr_tank = 0\n    starting_station = 0\n    for i in range(gas.length):\n        curr_tank += gas[i] - cost[i]\n        if curr_tank < 0:\n            starting_station = i + 1\n            curr_tank = 0\n    return starting_station`,
        corrected_code: `var canCompleteCircuit = function(gas, cost) {\n    if sum(gas) < sum(cost): return -1\n    curr_tank = 0\n    starting_station = 0\n    for i in range(gas.length):\n        curr_tank += gas[i] - cost[i]\n        if curr_tank < 0:\n            starting_station = i + 1\n            curr_tank = 0\n    return starting_station`,
      },
    }
  },

  {
    id: "q_int_135",
    title: "Candy (LeetCode 135)",
    topic: "greedy",
    difficulty: "hard",
    language: "python",
    problem_statement: {
      description: "There are `n` children standing in a line with ratings. Each child must have at least 1 candy. Children with a higher rating get more candies than their neighbors. Return the minimum candies required.",
      constraints: ["1 <= ratings.length <= 2 * 10^4", "0 <= ratings[i] <= 2 * 10^4"],
      examples: [
        {
          input: "ratings = [1,0,2]",
          output: "5",
          explanation: "Distribute [2,1,2] candies."
        }
      ]
    },
    ai_response: {
      code: `def candy(ratings):\n    n = len(ratings)\n    candies = [1] * n\n    \n    # Left-to-right pass\n    for i in range(1, n):\n        if ratings[i] > ratings[i - 1]:\n            candies[i] = candies[i - 1] + 1\n            \n    # Right-to-left pass\n    for i in range(n - 2, -1, -1):\n        if ratings[i] > ratings[i + 1]:\n            # Bug: assigns candies[i+1] + 1 directly, destroying left-to-right invariant\n            candies[i] = candies[i + 1] + 1\n            \n    return sum(candies)`,
      stated_explanation: "Two pass greedy candy distribution.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_int_135_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [13],
          description: "Overwriting left-pass constraint in right-pass: `candies[i] = candies[i + 1] + 1` blindly overwrites `candies[i]`, lowering it if the left-to-right pass already assigned a higher candy count. Must use `candies[i] = max(candies[i], candies[i + 1] + 1)`.",
          failing_input_example: "ratings = [1, 3, 2, 2, 1] (resets peak value)",
          why_it_matters: "Two-pass candy distribution must satisfy both neighbor constraints simultaneously using max()."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(n)",
        reasoning: "Two linear scans."
      },
      corrected_code: `def candy(ratings):\n    n = len(ratings)\n    candies = [1] * n\n    for i in range(1, n):\n        if ratings[i] > ratings[i - 1]:\n            candies[i] = candies[i - 1] + 1\n    for i in range(n - 2, -1, -1):\n        if ratings[i] > ratings[i + 1]:\n            candies[i] = max(candies[i], candies[i + 1] + 1)\n    return sum(candies)`,
      model_critique_summary: "Overwrote left-pass candy distribution without max()."
    },
    language_variants: {
      cpp: {
        code: `auto candy(ratings) {\n    n = ratings.size()\n    candies = [1] * n\n    \n    // Left-to-right pass\n    for i in range(1, n):\n        if ratings[i] > ratings[i - 1]:\n            candies[i] = candies[i - 1] + 1\n            \n    # Right-to-left pass\n    for i in range(n - 2, -1, -1):\n        if ratings[i] > ratings[i + 1]:\n            # Bug: assigns candies[i+1] + 1 directly, destroying left-to-right invariant\n            candies[i] = candies[i + 1] + 1\n            \n    return sum(candies)`,
        corrected_code: `auto candy(ratings) {\n    n = ratings.size()\n    candies = [1] * n\n    for i in range(1, n):\n        if ratings[i] > ratings[i - 1]:\n            candies[i] = candies[i - 1] + 1\n    for i in range(n - 2, -1, -1):\n        if ratings[i] > ratings[i + 1]:\n            candies[i] = max(candies[i], candies[i + 1] + 1)\n    return sum(candies)`,
      },
      javascript: {
        code: `var candy = function(ratings) {\n    n = ratings.length\n    candies = [1] * n\n    \n    // Left-to-right pass\n    for i in range(1, n):\n        if ratings[i] > ratings[i - 1]:\n            candies[i] = candies[i - 1] + 1\n            \n    # Right-to-left pass\n    for i in range(n - 2, -1, -1):\n        if ratings[i] > ratings[i + 1]:\n            # Bug: assigns candies[i+1] + 1 directly, destroying left-to-right invariant\n            candies[i] = candies[i + 1] + 1\n            \n    return sum(candies)`,
        corrected_code: `var candy = function(ratings) {\n    n = ratings.length\n    candies = [1] * n\n    for i in range(1, n):\n        if ratings[i] > ratings[i - 1]:\n            candies[i] = candies[i - 1] + 1\n    for i in range(n - 2, -1, -1):\n        if ratings[i] > ratings[i + 1]:\n            candies[i] = max(candies[i], candies[i + 1] + 1)\n    return sum(candies)`,
      },
    }
  }
];
