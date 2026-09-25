import { QuestionItem } from "@/types/question";

export const FRONTIER_DEFECT_QUESTIONS: QuestionItem[] = [
  // 1. Concurrency Bug — Race condition in naive counter/cache
  {
    id: "q_conc_001",
    title: "Thread-Safe Frequency Counter (Concurrency Race Condition)",
    topic: "concurrency",
    difficulty: "hard",
    language: "python",
    problem_statement: {
      description:
        "Implement a concurrent `HitCounter` service that tracks the frequency of event IDs across multiple worker threads.\n\nThe service must support:\n- `record_hit(event_id: str)`: increments the hit count for the given event ID.\n- `get_hits(event_id: str) -> int`: returns current total hits for the event ID.\n\nAll operations must execute safely across high-throughput concurrent threads without lost updates.",
      constraints: [
        "1 <= event_id.length <= 64",
        "Up to 10,000 concurrent worker threads calling record_hit()",
        "Operations must be thread-safe without deadlocks or lost increments",
      ],
      examples: [
        {
          input: "50 threads each call record_hit('user_login') 100 times",
          output: "5000",
          explanation: "Total hits recorded must strictly equal 5,000 without lost writes.",
        },
      ],
    },
    ai_response: {
      code: `import threading

class HitCounter:
    def __init__(self):
        self.hits = {}
        self.lock = threading.Lock()

    def record_hit(self, event_id: str) -> None:
        # Subtle Concurrency Bug: Check-then-act race condition outside lock
        if event_id not in self.hits:
            self.hits[event_id] = 0
            
        with self.lock:
            self.hits[event_id] += 1

    def get_hits(self, event_id: str) -> int:
        return self.hits.get(event_id, 0)`,
      stated_explanation:
        "Initializes key if absent, then protects the increment operation with a thread lock to ensure thread safety while minimizing lock contention.",
      stated_time_complexity: "O(1)",
      stated_space_complexity: "O(U) where U is unique events",
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "concurrency_bug",
      error_categories: ["subtle_logic_bug", "instruction_mismatch"],
      expected_issues: [
        {
          id: "iss_conc_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [10, 11],
          description:
            "Time-of-check to time-of-use (TOCTOU) race condition: `if event_id not in self.hits:` is evaluated outside `self.lock`. If Thread A and Thread B both see the key missing simultaneously, Thread B may overwrite `self.hits[event_id] = 0` after Thread A has already begun incrementing, resetting accumulated hits to zero!",
          failing_input_example: "Concurrent threads recording first hit for an event ID",
          why_it_matters:
            "Concurrency defects are notoriously intermittent. Checking dictionary membership without locking or using atomic default collections causes silent data loss under heavy load.",
        },
      ],
      optimal_complexity: {
        time: "O(1)",
        space: "O(U)",
        reasoning: "Atomic default collection or full synchronization inside lock scope.",
      },
      corrected_code: `from collections import defaultdict
import threading

class HitCounter:
    def __init__(self):
        self.hits = defaultdict(int)
        self.lock = threading.Lock()

    def record_hit(self, event_id: str) -> None:
        with self.lock:
            self.hits[event_id] += 1

    def get_hits(self, event_id: str) -> int:
        with self.lock:
            return self.hits[event_id]`,
      model_critique_summary:
        "Performed dictionary key initialization outside lock scope, allowing destructive race conditions.",
    },
    language_variants: {
      cpp: {
        code: `#include <unordered_map>
#include <string>
#include <mutex>

class HitCounter {
    std::unordered_map<std::string, int> hits;
    std::mutex mtx;
public:
    void record_hit(const std::string& event_id) {
        if (hits.find(event_id) == hits.end()) {
            hits[event_id] = 0; // Unsynchronized write
        }
        std::lock_guard<std::mutex> lock(mtx);
        hits[event_id]++;
    }
    int get_hits(const std::string& event_id) {
        return hits.count(event_id) ? hits[event_id] : 0;
    }
};`,
        corrected_code: `#include <unordered_map>
#include <string>
#include <mutex>

class HitCounter {
    std::unordered_map<std::string, int> hits;
    std::mutex mtx;
public:
    void record_hit(const std::string& event_id) {
        std::lock_guard<std::mutex> lock(mtx);
        hits[event_id]++;
    }
    int get_hits(const std::string& event_id) {
        std::lock_guard<std::mutex> lock(mtx);
        auto it = hits.find(event_id);
        return (it != hits.end()) ? it->second : 0;
    }
};`,
      },
    },
  },

  // 2. Memory / Aliasing Bug — Shallow copy in graph clone / matrix
  {
    id: "q_mem_001",
    title: "Graph Clone (Shallow vs Deep Copy Aliasing Trap)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description:
        "Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph.\n\nEach node contains a `val` (int) and a list `neighbors` (List[Node]). The copy must be entirely independent: modifying any cloned node or neighbor link must NOT alter the original graph.",
      constraints: [
        "The number of nodes in the graph is in the range [0, 100].",
        "1 <= Node.val <= 100",
        "Node.val is unique for each node.",
      ],
      examples: [
        {
          input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
          output: "[[2,4],[1,3],[2,4],[1,3]]",
          explanation: "Deep clone with identical topology but independent memory addresses.",
        },
      ],
    },
    ai_response: {
      code: `class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def cloneGraph(node):
    if not node:
        return None
        
    visited = {}
    
    def dfs(curr):
        if curr in visited:
            return visited[curr]
            
        # Subtle Bug: Shallow copy copies reference to neighbors list
        clone = Node(curr.val)
        visited[curr] = clone
        
        # Iterates and appends to cloned neighbors, but fails to isolate sub-lists
        for neighbor in curr.neighbors:
            clone.neighbors.append(dfs(neighbor))
            
        return clone

    return dfs(node)`,
      stated_explanation:
        "Uses depth-first search with a visited hash map to map each original node to its clone and recursively connects all cloned neighbors.",
      stated_time_complexity: "O(V + E)",
      stated_space_complexity: "O(V)",
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(V + E)",
        space: "O(V)",
        reasoning: "Standard DFS with visited memoization.",
      },
      corrected_code: `def cloneGraph(node):
    if not node:
        return None
    visited = {}
    def dfs(curr):
        if curr in visited:
            return visited[curr]
        clone = Node(curr.val)
        visited[curr] = clone
        for neighbor in curr.neighbors:
            clone.neighbors.append(dfs(neighbor))
        return clone
    return dfs(node)`,
      model_critique_summary:
        "Code is completely correct. Properly instantiates new Node and copies neighbor references recursively.",
    },
  },

  // 3. Off-by-One in Sliding Window
  {
    id: "q_slide_001",
    title: "Longest Substring Without Repeating (Window Boundary Bug)",
    topic: "strings",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description:
        "Given a string `s`, find the length of the longest substring without repeating characters.",
      constraints: [
        "0 <= s.length <= 5 * 10^4",
        "`s` consists of English letters, digits, symbols and spaces.",
      ],
      examples: [
        {
          input: 's = "abcabcbb"',
          output: "3",
          explanation: 'The answer is "abc", with the length of 3.',
        },
        {
          input: 's = "abba"',
          output: "2",
          explanation: 'The answer is "ab" or "ba", with the length of 2.',
        },
      ],
    },
    ai_response: {
      code: `def lengthOfLongestSubstring(s: str) -> int:
    last_seen = {}
    max_len = 0
    left = 0
    
    for right, char in enumerate(s):
        # Subtle Bug: Does not verify that last_seen index is >= left!
        if char in last_seen:
            left = last_seen[char] + 1
            
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len`,
      stated_explanation:
        "Uses dynamic sliding window with a dictionary tracking the last index of each character to advance `left` immediately when a duplicate is observed.",
      stated_time_complexity: "O(N)",
      stated_space_complexity: "O(min(M, N))",
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "off_by_one",
      error_categories: ["subtle_logic_bug", "edge_case_blindness"],
      expected_issues: [
        {
          id: "iss_slide_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [8, 9],
          description:
            "Window regression on previous duplicates outside window: when examining string `'abba'`, at index 3 (`'a'`), `'a'` was seen at index 0. The code blindly sets `left = 0 + 1 = 1`, moving `left` backwards from 2 to 1! This causes the window to incorrectly count `'b'` twice.",
          failing_input_example: 's = "abba"',
          why_it_matters:
            "A quintessential sliding window flaw: moving the left boundary backwards violates monotonic window invariants and yields incorrect lengths.",
        },
      ],
      optimal_complexity: {
        time: "O(N)",
        space: "O(min(N, Sigma))",
        reasoning: "Single pass sliding window with left bounded by `max(left, last_seen[char] + 1)`.",
      },
      corrected_code: `def lengthOfLongestSubstring(s: str) -> int:
    last_seen = {}
    max_len = 0
    left = 0
    for right, char in enumerate(s):
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      model_critique_summary:
        "Failed to ensure the duplicate character's previous index was within the current window boundary.",
    },
  },

  // 4. Greedy-vs-DP Trap
  {
    id: "q_greedy_001",
    title: "Arbitrary Coin Dispenser (Greedy vs DP Heuristic Failure)",
    topic: "dp",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description:
        "You are building an ATM change dispenser for a fictional currency with arbitrary denominations `[1, 5, 8]`. Given integer `amount`, return the minimum number of coins needed to make change.",
      constraints: ["1 <= amount <= 10^4", "Denominations given are [1, 5, 8]"],
      examples: [
        {
          input: "amount = 10",
          output: "2",
          explanation: "Optimal is 5 + 5 = 10 (2 coins). A greedy approach takes 8 + 1 + 1 (3 coins).",
        },
      ],
    },
    ai_response: {
      code: `def minCoins(amount: int) -> int:
    # Bug: Greedy approach fails on non-canonical currency system [1, 5, 8]
    coins = [8, 5, 1]
    count = 0
    for coin in coins:
        if amount >= coin:
            count += amount // coin
            amount %= coin
    return count`,
      stated_explanation:
        "Greedily deducts the largest possible denomination first to minimize overall coin count in O(1) time.",
      stated_time_complexity: "O(1)",
      stated_space_complexity: "O(1)",
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug", "deceptive_explanation"],
      expected_issues: [
        {
          id: "iss_greedy_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [2, 6, 7],
          description:
            "Greedy algorithm trap: For non-canonical currencies like `[1, 5, 8]`, greedy selection is sub-optimal. For `amount = 10`, greedy outputs 3 coins (`8 + 1 + 1`), whereas dynamic programming achieves 2 coins (`5 + 5`).",
          failing_input_example: "amount = 10",
          why_it_matters:
            "LLMs frequently assume currency systems satisfy the matroid/canonical property of standard US coins.",
        },
      ],
      optimal_complexity: {
        time: "O(amount)",
        space: "O(amount)",
        reasoning: "Bottom-up 1D DP tabulation.",
      },
      corrected_code: `def minCoins(amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    coins = [1, 5, 8]
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], 1 + dp[i - c])
    return dp[amount]`,
      model_critique_summary:
        "Employed a greedy heuristic that fails on non-canonical coin denominations.",
    },
  },

  // 5. Hallucinated Complexity Claims
  {
    id: "q_expl_001",
    title: "Subarray Sum Equals K (Deceptive O(N log N) Claim)",
    topic: "arrays",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description:
        "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
      constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
      examples: [
        {
          input: "nums = [1,1,1], k = 2",
          output: "2",
          explanation: "Subarrays [1,1] at index 0-1 and index 1-2 both sum to 2.",
        },
      ],
    },
    ai_response: {
      code: `def subarraySum(nums: list[int], k: int) -> int:
    prefix_sums = [0]
    for n in nums:
        prefix_sums.append(prefix_sums[-1] + n)
        
    count = 0
    # Nested iteration over prefix sums
    for i in range(len(prefix_sums)):
        for j in range(i + 1, len(prefix_sums)):
            if prefix_sums[j] - prefix_sums[i] == k:
                count += 1
                
    return count`,
      stated_explanation:
        "Computes cumulative prefix sums and performs binary search lookup over intervals, achieving optimal O(N log N) time complexity with O(N) space.",
      stated_time_complexity: "O(N log N)",
      stated_space_complexity: "O(N)",
    },
    ground_truth: {
      verdict: "minor_issue",
      defect_type: "deceptive_explanation",
      error_categories: ["deceptive_explanation", "complexity_regression"],
      expected_issues: [
        {
          id: "iss_expl_01",
          severity: "major",
          dimension: "explanation",
          line_numbers: [8, 9],
          description:
            "Deceptive Explanation & Complexity Regress: Code uses nested quadratic loops (`O(N²)`), yet the explanation claims it uses 'binary search lookup in O(N log N)'. The algorithm will Time Out (TLE) on arrays of length 20,000, and does not use binary search.",
          failing_input_example: "nums of length 20000",
          why_it_matters:
            "Frontier RLHF evaluators must audit both code and explanation. LLMs often hallucinate Big-O claims that do not match the provided implementation.",
        },
      ],
      optimal_complexity: {
        time: "O(N)",
        space: "O(N)",
        reasoning: "Single pass with prefix sum frequency hash map.",
      },
      corrected_code: `def subarraySum(nums: list[int], k: int) -> int:
    count = 0
    curr_sum = 0
    prefix_counts = {0: 1}
    for n in nums:
        curr_sum += n
        count += prefix_counts.get(curr_sum - k, 0)
        prefix_counts[curr_sum] = prefix_counts.get(curr_sum, 0) + 1
    return count`,
      model_critique_summary:
        "Code is functional but O(N²) quadratic; explanation falsely claims O(N log N) via binary search.",
    },
  },

  // 6. Integer Overflow / Precision Bug
  {
    id: "q_int_001",
    title: "Binary Search Midpoint (32-Bit Integer Overflow)",
    topic: "binary_search",
    difficulty: "easy",
    language: "cpp",
    problem_statement: {
      description:
        "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
      constraints: [
        "1 <= nums.length <= 10^6",
        "-10^9 <= nums[i], target <= 10^9",
        "All the integers in `nums` are unique.",
      ],
      examples: [
        {
          input: "nums = [-1,0,3,5,9,12], target = 9",
          output: "4",
          explanation: "9 exists in nums and its index is 4",
        },
      ],
    },
    ai_response: {
      code: `#include <vector>

int search(const std::vector<int>& nums, int target) {
    int low = 0;
    int high = nums.size() - 1;
    
    while (low <= high) {
        // Subtle Bug: Signed 32-bit integer overflow if low + high > 2^31 - 1
        int mid = (low + high) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
      stated_explanation:
        "Classic binary search dividing search space in half each iteration using arithmetic midpoint average.",
      stated_time_complexity: "O(log N)",
      stated_space_complexity: "O(1)",
    },
    ground_truth: {
      verdict: "minor_issue",
      defect_type: "integer_overflow",
      error_categories: ["subtle_logic_bug", "edge_case_blindness"],
      expected_issues: [
        {
          id: "iss_int_01",
          severity: "major",
          dimension: "correctness",
          line_numbers: [9],
          description:
            "Integer overflow in midpoint calculation: `(low + high) / 2` overflows signed 32-bit integer when `low + high > 2,147,483,647`, yielding negative numbers and `std::out_of_range` index crashes. Safe formula is `low + (high - low) / 2`.",
          failing_input_example: "nums array near 2^30 boundary index",
          why_it_matters:
            "Famous bug that went unnoticed in Sun's Java standard library for over nine years (Joshua Bloch, Google Research).",
        },
      ],
      optimal_complexity: {
        time: "O(log N)",
        space: "O(1)",
        reasoning: "Safe midpoint calculation.",
      },
      corrected_code: `#include <vector>

int search(const std::vector<int>& nums, int target) {
    int low = 0;
    int high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      model_critique_summary:
        "Used naive `(low + high) / 2` prone to 32-bit integer overflow.",
    },
  },

  // 7. Recursive Stack Overflow
  {
    id: "q_rec_001",
    title: "Deep Linked List Reversal (Call-Stack Overflow Regress)",
    topic: "linked_lists",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description:
        "Reverse a singly linked list with up to `100,000` nodes and return the reversed list head.\n\nThe algorithm must handle deep inputs without exceeding execution runtime limits or crashing on memory stack limits.",
      constraints: ["0 <= number of nodes <= 100,000", "-5000 <= Node.val <= 5000"],
      examples: [
        {
          input: "head = [1,2,3,4,5]",
          output: "[5,4,3,2,1]",
        },
      ],
    },
    ai_response: {
      code: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head: ListNode) -> ListNode:
    # Bug: Linear recursion blows Python default call stack (1000 frames)
    if not head or not head.next:
        return head
        
    new_head = reverseList(head.next)
    head.next.next = head
    head.next = None
    return new_head`,
      stated_explanation:
        "Recursively reverses the tail and relinks head.next.next to head, operating in clean O(N) time.",
      stated_time_complexity: "O(N)",
      stated_space_complexity: "O(N) recursive stack frames",
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "stack_overflow",
      error_categories: ["complexity_regression", "edge_case_blindness"],
      expected_issues: [
        {
          id: "iss_rec_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [11],
          description:
            "Recursive stack overflow: Python's default recursion depth limit is 1,000 frames. For inputs with up to 100,000 nodes, `reverseList(head.next)` crashes with `RecursionError: maximum recursion depth exceeded`. Iterative O(1) space inversion is required.",
          failing_input_example: "Linked list of length 5000",
          why_it_matters:
            "Models often produce textbook recursion that is non-viable for production datasets lacking tail-call optimization.",
        },
      ],
      optimal_complexity: {
        time: "O(N)",
        space: "O(1)",
        reasoning: "Iterative three-pointer reversal.",
      },
      corrected_code: `def reverseList(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      model_critique_summary:
        "Used deep recursion that crashes with RecursionError on inputs larger than 1,000 nodes.",
    },
  },

  // 8. Mutation of Shared State (Default Mutable Argument)
  {
    id: "q_mut_001",
    title: "Event Batch Collector (Python Default Mutable Argument Gotcha)",
    topic: "arrays",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description:
        "Implement a utility function `collect_event(event_id: str, batch: list = []) -> list` that appends an event ID to a batch and returns the batch.\n\nWhen `batch` is not supplied, the function must start with an isolated fresh batch.",
      constraints: ["1 <= event_id.length <= 32", "Batch size can vary dynamically"],
      examples: [
        {
          input: "collect_event('evt_1'); collect_event('evt_2')",
          output: "['evt_1'] and ['evt_2']",
          explanation: "Separate calls without passing a batch must return distinct single-item lists.",
        },
      ],
    },
    ai_response: {
      code: `def collect_event(event_id: str, batch: list = []) -> list:
    # Classic Python Trap: Default argument evaluated once at definition time
    batch.append(event_id)
    return batch`,
      stated_explanation:
        "Appends event_id to the provided batch, defaulting to an empty list when no batch is specified.",
      stated_time_complexity: "O(1)",
      stated_space_complexity: "O(1)",
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "mutable_default",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_mut_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [1],
          description:
            "Mutable default argument shared state trap: in Python, default argument expressions (`batch = []`) are evaluated once when the function is defined, NOT on each invocation. Repeated calls without a batch mutate the same shared list, leaking data between independent callers.",
          failing_input_example: "collect_event('a'); collect_event('b') -> returns ['a', 'b'] instead of ['b']",
          why_it_matters:
            "A canonical Python gotcha tested extensively in RLHF code generation benchmarks to verify language-specific idiom compliance.",
        },
      ],
      optimal_complexity: {
        time: "O(1)",
        space: "O(1)",
        reasoning: "Default to None and instantiate fresh list inside function body.",
      },
      corrected_code: `def collect_event(event_id: str, batch: list = None) -> list:
    if batch is None:
        batch = []
    batch.append(event_id)
    return batch`,
      model_critique_summary:
        "Used mutable default argument `batch = []` which retains state across calls.",
    },
  },
];
