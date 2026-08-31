import { QuestionItem } from "@/types/question";

export const HEAP_QUESTIONS: QuestionItem[] = [
  {
    id: "q_heap_scratch",
    title: "Implement Min Heap from Scratch (Python)",
    topic: "heaps",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Implement a binary min heap from scratch supporting `push`, `pop`, `peek`, and `size` using zero external libraries.",
      constraints: ["push: O(log n), pop: O(log n), peek: O(1)"],
      examples: [
        {
          input: "push(5), push(3), push(8), pop(), peek()",
          output: "3, 5"
        }
      ]
    },
    ai_response: {
      code: `class MinHeap:\n    def __init__(self):\n        self.heap = []\n\n    def push(self, val):\n        self.heap.append(val)\n        self._sift_up(len(self.heap) - 1)\n\n    def pop(self):\n        if not self.heap:\n            raise IndexError("Heap is empty")\n        # Bug: Pops root directly without swapping with tail and sifting down\n        return self.heap.pop(0)\n\n    def _sift_up(self, i):\n        parent = (i - 1) // 2\n        while i > 0 and self.heap[i] < self.heap[parent]:\n            self.heap[i], self.heap[parent] = self.heap[parent], self.heap[i]\n            i = parent\n            parent = (i - 1) // 2`,
      stated_explanation: "Min heap maintaining heap property via sift up. Pops minimum element from index 0 in O(log n) time.",
      stated_time_complexity: "push: O(log n), pop: O(log n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug", "complexity_regression"],
      expected_issues: [
        {
          id: "iss_heap_scratch_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [11],
          description: "Linear O(N) array deletion and broken heap invariant: `self.heap.pop(0)` shifts all remaining array elements in O(N) time and fails to maintain the binary tree heap property. Must swap `heap[0], heap[-1] = heap[-1], heap[0]`, pop from the tail in O(1), and call `_sift_down(0)`.",
          failing_input_example: "push(5), push(3), push(8), push(4), pop(), pop() -> leaves heap in non-heap sorted state",
          why_it_matters: "A heap pop requires swapping with the last element and sifting down to achieve O(log n) time."
        }
      ],
      optimal_complexity: {
        time: "push: O(log n), pop: O(log n), peek: O(1)",
        space: "O(n)",
        reasoning: "Binary tree array representation with logarithmic tree height."
      },
      corrected_code: `class MinHeap:\n    def __init__(self):\n        self.heap = []\n    def push(self, val):\n        self.heap.append(val)\n        self._sift_up(len(self.heap) - 1)\n    def pop(self):\n        if not self.heap: raise IndexError("Empty")\n        self.heap[0], self.heap[-1] = self.heap[-1], self.heap[0]\n        min_val = self.heap.pop()\n        if self.heap: self._sift_down(0)\n        return min_val\n    def _sift_up(self, i):\n        p = (i - 1) // 2\n        while i > 0 and self.heap[i] < self.heap[p]:\n            self.heap[i], self.heap[p] = self.heap[p], self.heap[i]\n            i = p; p = (i - 1) // 2\n    def _sift_down(self, i):\n        n = len(self.heap)\n        while 2 * i + 1 < n:\n            smallest = i\n            l, r = 2 * i + 1, 2 * i + 2\n            if l < n and self.heap[l] < self.heap[smallest]: smallest = l\n            if r < n and self.heap[r] < self.heap[smallest]: smallest = r\n            if smallest == i: break\n            self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]\n            i = smallest`,
      model_critique_summary: "Used list.pop(0) instead of tail-swap and sift-down."
    },
    language_variants: {
      cpp: {
        code: `class MinHeap:\n    auto __init__() {\n        this->heap = []\n\n    def push(self, val):\n        this->heap.push_back(val)\n        this->_sift_up(this->heap.size() - 1)\n\n    def pop(self):\n        if ! this->heap:\n            raise IndexError("Heap is empty")\n        // Bug: Pops root directly without swapping with tail && sifting down\n        return this->heap.pop(0)\n\n    def _sift_up(self, i):\n        parent = (i - 1) // 2\n        while i > 0 && this->heap[i] < this->heap[parent]:\n            this->heap[i], this->heap[parent] = this->heap[parent], this->heap[i]\n            i = parent\n            parent = (i - 1) // 2`,
        corrected_code: `class MinHeap:\n    auto __init__() {\n        this->heap = []\n    def push(self, val):\n        this->heap.push_back(val)\n        this->_sift_up(this->heap.size() - 1)\n    def pop(self):\n        if ! this->heap: raise IndexError("Empty")\n        this->heap[0], this->heap[-1] = this->heap[-1], this->heap[0]\n        min_val = this->heap.pop_back()\n        if this->heap: this->_sift_down(0)\n        return min_val\n    def _sift_up(self, i):\n        p = (i - 1) // 2\n        while i > 0 && this->heap[i] < this->heap[p]:\n            this->heap[i], this->heap[p] = this->heap[p], this->heap[i]\n            i = p; p = (i - 1) // 2\n    def _sift_down(self, i):\n        n = this->heap.size()\n        while 2 * i + 1 < n:\n            smallest = i\n            l, r = 2 * i + 1, 2 * i + 2\n            if l < n && this->heap[l] < this->heap[smallest]: smallest = l\n            if r < n && this->heap[r] < this->heap[smallest]: smallest = r\n            if smallest == i: break\n            this->heap[i], this->heap[smallest] = this->heap[smallest], this->heap[i]\n            i = smallest`,
      },
      javascript: {
        code: `class MinHeap:\n    var __init__ = function() {\n        this.heap = []\n\n    def push(self, val):\n        this.heap.push(val)\n        this._sift_up(this.heap.length - 1)\n\n    def pop(self):\n        if ! this.heap:\n            raise IndexError("Heap is empty")\n        // Bug: Pops root directly without swapping with tail && sifting down\n        return this.heap.pop(0)\n\n    def _sift_up(self, i):\n        parent = (i - 1) // 2\n        while i > 0 && this.heap[i] < this.heap[parent]:\n            this.heap[i], this.heap[parent] = this.heap[parent], this.heap[i]\n            i = parent\n            parent = (i - 1) // 2`,
        corrected_code: `class MinHeap:\n    var __init__ = function() {\n        this.heap = []\n    def push(self, val):\n        this.heap.push(val)\n        this._sift_up(this.heap.length - 1)\n    def pop(self):\n        if ! this.heap: raise IndexError("Empty")\n        this.heap[0], this.heap[-1] = this.heap[-1], this.heap[0]\n        min_val = this.heap.pop()\n        if this.heap: this._sift_down(0)\n        return min_val\n    def _sift_up(self, i):\n        p = (i - 1) // 2\n        while i > 0 && this.heap[i] < this.heap[p]:\n            this.heap[i], this.heap[p] = this.heap[p], this.heap[i]\n            i = p; p = (i - 1) // 2\n    def _sift_down(self, i):\n        n = this.heap.length\n        while 2 * i + 1 < n:\n            smallest = i\n            l, r = 2 * i + 1, 2 * i + 2\n            if l < n && this.heap[l] < this.heap[smallest]: smallest = l\n            if r < n && this.heap[r] < this.heap[smallest]: smallest = r\n            if smallest == i: break\n            this.heap[i], this.heap[smallest] = this.heap[smallest], this.heap[i]\n            i = smallest`,
      },
    }
  },

  {
    id: "q_heap_215",
    title: "Kth Largest Element in an Array (LeetCode 215)",
    topic: "heaps",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an integer array `nums` and an integer `k`, return the `k-th` largest element in the array without full sorting.",
      constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      examples: [
        {
          input: "nums = [3,2,1,5,6,4], k = 2",
          output: "5"
        }
      ]
    },
    ai_response: {
      code: `import heapq\n\ndef findKthLargest(nums, k):\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if len(min_heap) > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]`,
      stated_explanation: "Maintains a min-heap of size k. The root of the heap is the k-th largest element.",
      stated_time_complexity: "O(n log k)",
      stated_space_complexity: "O(k)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n log k)",
        space: "O(k)",
        reasoning: "Min heap bounded at size k."
      },
      corrected_code: `import heapq\ndef findKthLargest(nums, k):\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if len(min_heap) > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]`,
      model_critique_summary: "Optimal, completely correct bounded min-heap."
    },
    language_variants: {
      cpp: {
        code: `import heapq\n\nauto findKthLargest(nums, k) {\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if min_heap.size() > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]`,
        corrected_code: `import heapq\nauto findKthLargest(nums, k) {\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if min_heap.size() > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]`,
      },
      javascript: {
        code: `import heapq\n\nvar findKthLargest = function(nums, k) {\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if min_heap.length > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]`,
        corrected_code: `import heapq\nvar findKthLargest = function(nums, k) {\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if min_heap.length > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]`,
      },
    }
  },

  {
    id: "q_heap_347",
    title: "Top K Frequent Elements (LeetCode 347)",
    topic: "heaps",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.",
      constraints: ["1 <= nums.length <= 10^5", "1 <= k <= unique elements"],
      examples: [
        {
          input: "nums = [1,1,1,2,2,3], k = 2",
          output: "[1,2]"
        }
      ]
    },
    ai_response: {
      code: `import heapq\nfrom collections import Counter\n\ndef topKFrequent(nums, k):\n    count = Counter(nums)\n    min_heap = []\n    for num, freq in count.items():\n        heapq.heappush(min_heap, (freq, num))\n        if len(min_heap) > k:\n            heapq.heappop(min_heap)\n    return [num for freq, num in min_heap]`,
      stated_explanation: "Min-heap bounded at size k.",
      stated_time_complexity: "O(n log k)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n log k)",
        space: "O(n)",
        reasoning: "Bounded min-heap."
      },
      corrected_code: `import heapq\nfrom collections import Counter\ndef topKFrequent(nums, k):\n    count = Counter(nums)\n    min_heap = []\n    for num, freq in count.items():\n        heapq.heappush(min_heap, (freq, num))\n        if len(min_heap) > k:\n            heapq.heappop(min_heap)\n    return [num for freq, num in min_heap]`,
      model_critique_summary: "Optimal min-heap frequency ranking."
    },
    language_variants: {
      cpp: {
        code: `import heapq\nfrom collections import Counter\n\nauto topKFrequent(nums, k) {\n    count = Counter(nums)\n    min_heap = []\n    for num, freq in count.items():\n        heapq.heappush(min_heap, (freq, num))\n        if min_heap.size() > k:\n            heapq.heappop(min_heap)\n    return [num for freq, num in min_heap]`,
        corrected_code: `import heapq\nfrom collections import Counter\nauto topKFrequent(nums, k) {\n    count = Counter(nums)\n    min_heap = []\n    for num, freq in count.items():\n        heapq.heappush(min_heap, (freq, num))\n        if min_heap.size() > k:\n            heapq.heappop(min_heap)\n    return [num for freq, num in min_heap]`,
      },
      javascript: {
        code: `import heapq\nfrom collections import Counter\n\nvar topKFrequent = function(nums, k) {\n    count = Counter(nums)\n    min_heap = []\n    for num, freq in count.items():\n        heapq.heappush(min_heap, (freq, num))\n        if min_heap.length > k:\n            heapq.heappop(min_heap)\n    return [num for freq, num in min_heap]`,
        corrected_code: `import heapq\nfrom collections import Counter\nvar topKFrequent = function(nums, k) {\n    count = Counter(nums)\n    min_heap = []\n    for num, freq in count.items():\n        heapq.heappush(min_heap, (freq, num))\n        if min_heap.length > k:\n            heapq.heappop(min_heap)\n    return [num for freq, num in min_heap]`,
      },
    }
  },

  {
    id: "q_heap_973",
    title: "K Closest Points to Origin (LeetCode 973)",
    topic: "heaps",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an array of `points` where `points[i] = [x_i, y_i]` and an integer `k`, return the `k` closest points to the origin `(0, 0)`.",
      constraints: ["1 <= k <= points.length <= 10^4", "-10^4 <= x_i, y_i <= 10^4"],
      examples: [
        {
          input: "points = [[1,3],[-2,2]], k = 1",
          output: "[[-2,2]]"
        }
      ]
    },
    ai_response: {
      code: `import heapq\n\ndef kClosest(points, k):\n    # Max-heap storing (-distance, point)\n    max_heap = []\n    for x, y in points:\n        dist = x*x + y*y\n        heapq.heappush(max_heap, (-dist, [x, y]))\n        if len(max_heap) > k:\n            heapq.heappop(max_heap)\n    return [pt for dist, pt in max_heap]`,
      stated_explanation: "Maintains a max-heap of size k by storing negated Euclidean distances.",
      stated_time_complexity: "O(n log k)",
      stated_space_complexity: "O(k)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n log k)",
        space: "O(k)",
        reasoning: "Max heap bounded at k elements."
      },
      corrected_code: `import heapq\ndef kClosest(points, k):\n    max_heap = []\n    for x, y in points:\n        dist = x*x + y*y\n        heapq.heappush(max_heap, (-dist, [x, y]))\n        if len(max_heap) > k:\n            heapq.heappop(max_heap)\n    return [pt for dist, pt in max_heap]`,
      model_critique_summary: "Optimal bounded max-heap."
    },
    language_variants: {
      cpp: {
        code: `import heapq\n\nauto kClosest(points, k) {\n    // Max-heap storing (-distance, point)\n    max_heap = []\n    for x, y in points:\n        dist = x*x + y*y\n        heapq.heappush(max_heap, (-dist, [x, y]))\n        if max_heap.size() > k:\n            heapq.heappop(max_heap)\n    return [pt for dist, pt in max_heap]`,
        corrected_code: `import heapq\nauto kClosest(points, k) {\n    max_heap = []\n    for x, y in points:\n        dist = x*x + y*y\n        heapq.heappush(max_heap, (-dist, [x, y]))\n        if max_heap.size() > k:\n            heapq.heappop(max_heap)\n    return [pt for dist, pt in max_heap]`,
      },
      javascript: {
        code: `import heapq\n\nvar kClosest = function(points, k) {\n    // Max-heap storing (-distance, point)\n    max_heap = []\n    for x, y in points:\n        dist = x*x + y*y\n        heapq.heappush(max_heap, (-dist, [x, y]))\n        if max_heap.length > k:\n            heapq.heappop(max_heap)\n    return [pt for dist, pt in max_heap]`,
        corrected_code: `import heapq\nvar kClosest = function(points, k) {\n    max_heap = []\n    for x, y in points:\n        dist = x*x + y*y\n        heapq.heappush(max_heap, (-dist, [x, y]))\n        if max_heap.length > k:\n            heapq.heappop(max_heap)\n    return [pt for dist, pt in max_heap]`,
      },
    }
  },

  {
    id: "q_heap_767",
    title: "Reorganize String (LeetCode 767)",
    topic: "heaps",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given a string `s`, rearrange the characters of `s` so that any two adjacent characters are not the same. Return any possible rearrangement of `s` or return `\"\"` if not possible.",
      constraints: ["1 <= s.length <= 500", "s consists of lowercase English letters."],
      examples: [
        {
          input: 's = "aab"',
          output: '"aba"'
        },
        {
          input: 's = "aaab"',
          output: '""'
        }
      ]
    },
    ai_response: {
      code: `import heapq\nfrom collections import Counter\n\ndef reorganizeString(s: str) -> str:\n    count = Counter(s)\n    max_heap = [(-cnt, char) for char, cnt in count.items()]\n    heapq.heapify(max_heap)\n    \n    prev = None\n    res = []\n    \n    while max_heap or prev:\n        # Bug: does not check if max_heap is empty when prev still has count\n        if prev and not max_heap:\n            return ""\n            \n        cnt, char = heapq.heappop(max_heap)\n        res.append(char)\n        cnt += 1 # decrease magnitude\n        \n        if prev:\n            heapq.heappush(max_heap, prev)\n            prev = None\n            \n        if cnt < 0:\n            prev = (cnt, char)\n            \n    return "".join(res)`,
      stated_explanation: "Greedily picks the most frequent character using a max-heap, withholding the previously used character until the next cycle.",
      stated_time_complexity: "O(n log 26) = O(n)",
      stated_space_complexity: "O(26) = O(1)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Alphabet size bounded at 26."
      },
      corrected_code: `import heapq\nfrom collections import Counter\ndef reorganizeString(s: str) -> str:\n    count = Counter(s)\n    max_heap = [(-cnt, char) for char, cnt in count.items()]\n    heapq.heapify(max_heap)\n    prev = None\n    res = []\n    while max_heap or prev:\n        if prev and not max_heap: return ""\n        cnt, char = heapq.heappop(max_heap)\n        res.append(char)\n        cnt += 1\n        if prev:\n            heapq.heappush(max_heap, prev)\n            prev = None\n        if cnt < 0:\n            prev = (cnt, char)\n    return "".join(res)`,
      model_critique_summary: "Optimal, completely correct greedy max-heap reorganization."
    },
    language_variants: {
      cpp: {
        code: `import heapq\nfrom collections import Counter\n\ndef reorganizeString(s: str) -> str:\n    count = Counter(s)\n    max_heap = [(-cnt, char) for char, cnt in count.items()]\n    heapq.heapify(max_heap)\n    \n    prev = nullptr\n    res = []\n    \n    while max_heap || prev:\n        // Bug: does ! check if max_heap is empty when prev still has count\n        if prev && ! max_heap:\n            return ""\n            \n        cnt, char = heapq.heappop(max_heap)\n        res.push_back(char)\n        cnt += 1 # decrease magnitude\n        \n        if prev:\n            heapq.heappush(max_heap, prev)\n            prev = nullptr\n            \n        if cnt < 0:\n            prev = (cnt, char)\n            \n    return "".join(res)`,
        corrected_code: `import heapq\nfrom collections import Counter\ndef reorganizeString(s: str) -> str:\n    count = Counter(s)\n    max_heap = [(-cnt, char) for char, cnt in count.items()]\n    heapq.heapify(max_heap)\n    prev = nullptr\n    res = []\n    while max_heap || prev:\n        if prev && ! max_heap: return ""\n        cnt, char = heapq.heappop(max_heap)\n        res.push_back(char)\n        cnt += 1\n        if prev:\n            heapq.heappush(max_heap, prev)\n            prev = nullptr\n        if cnt < 0:\n            prev = (cnt, char)\n    return "".join(res)`,
      },
      javascript: {
        code: `import heapq\nfrom collections import Counter\n\ndef reorganizeString(s: str) -> str:\n    count = Counter(s)\n    max_heap = [(-cnt, char) for char, cnt in count.items()]\n    heapq.heapify(max_heap)\n    \n    prev = null\n    res = []\n    \n    while max_heap || prev:\n        // Bug: does ! check if max_heap is empty when prev still has count\n        if prev && ! max_heap:\n            return ""\n            \n        cnt, char = heapq.heappop(max_heap)\n        res.push(char)\n        cnt += 1 # decrease magnitude\n        \n        if prev:\n            heapq.heappush(max_heap, prev)\n            prev = null\n            \n        if cnt < 0:\n            prev = (cnt, char)\n            \n    return "".join(res)`,
        corrected_code: `import heapq\nfrom collections import Counter\ndef reorganizeString(s: str) -> str:\n    count = Counter(s)\n    max_heap = [(-cnt, char) for char, cnt in count.items()]\n    heapq.heapify(max_heap)\n    prev = null\n    res = []\n    while max_heap || prev:\n        if prev && ! max_heap: return ""\n        cnt, char = heapq.heappop(max_heap)\n        res.push(char)\n        cnt += 1\n        if prev:\n            heapq.heappush(max_heap, prev)\n            prev = null\n        if cnt < 0:\n            prev = (cnt, char)\n    return "".join(res)`,
      },
    }
  },

  {
    id: "q_heap_264",
    title: "Ugly Number II (LeetCode 264)",
    topic: "heaps",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "An ugly number is a positive integer whose prime factors are limited to 2, 3, and 5. Given an integer `n`, return the `n-th` ugly number.",
      constraints: ["1 <= n <= 1690"],
      examples: [
        {
          input: "n = 10",
          output: "12",
          explanation: "[1, 2, 3, 4, 5, 6, 8, 9, 10, 12] is the sequence of the first 10 ugly numbers."
        }
      ]
    },
    ai_response: {
      code: `import heapq\n\ndef nthUglyNumber(n: int) -> int:\n    min_heap = [1]\n    # Bug: Forgot visited set, causes exponential duplicates in heap\n    for _ in range(n):\n        curr = heapq.heappop(min_heap)\n        heapq.heappush(min_heap, curr * 2)\n        heapq.heappush(min_heap, curr * 3)\n        heapq.heappush(min_heap, curr * 5)\n    return curr`,
      stated_explanation: "Pushes multiples of 2, 3, and 5 into a min-heap and pops n times.",
      stated_time_complexity: "O(n log n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug", "complexity_regression"],
      expected_issues: [
        {
          id: "iss_heap_264_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [7, 8, 9],
          description: "Duplicate number generation without visited deduplication set: Numbers with multiple factorizations (e.g. `6 = 2*3 = 3*2`, `30 = 2*3*5`) are inserted multiple times into `min_heap`. As a result, the loop pops duplicate numbers, returning incorrect values for all `n >= 6`.",
          failing_input_example: "n = 10 -> returns 10 instead of 12 due to duplicate 6",
          why_it_matters: "A min-heap sequence generator requires a visited set or three-pointer DP to prevent duplicate pops."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(n)",
        reasoning: "Three-pointer DP or min-heap with hash set."
      },
      corrected_code: `import heapq\ndef nthUglyNumber(n: int) -> int:\n    min_heap = [1]\n    seen = {1\n    factors = [2, 3, 5]\n    for _ in range(n):\n        curr = heapq.heappop(min_heap)\n        for f in factors:\n            nxt = curr * f\n            if nxt not in seen:\n                seen.add(nxt)\n                heapq.heappush(min_heap, nxt)\n    return curr`,
      model_critique_summary: "Omitted deduplication set in min-heap factor expansion."
    },
    language_variants: {
      cpp: {
        code: `import heapq\n\ndef nthUglyNumber(n: int) -> int:\n    min_heap = [1]\n    // Bug: Forgot visited set, causes exponential duplicates in heap\n    for _ in range(n):\n        curr = heapq.heappop(min_heap)\n        heapq.heappush(min_heap, curr * 2)\n        heapq.heappush(min_heap, curr * 3)\n        heapq.heappush(min_heap, curr * 5)\n    return curr`,
        corrected_code: `import heapq\ndef nthUglyNumber(n: int) -> int:\n    min_heap = [1]\n    seen = {1\n    factors = [2, 3, 5]\n    for _ in range(n):\n        curr = heapq.heappop(min_heap)\n        for f in factors:\n            nxt = curr * f\n            if nxt ! in seen:\n                seen.add(nxt)\n                heapq.heappush(min_heap, nxt)\n    return curr`,
      },
      javascript: {
        code: `import heapq\n\ndef nthUglyNumber(n: int) -> int:\n    min_heap = [1]\n    // Bug: Forgot visited set, causes exponential duplicates in heap\n    for _ in range(n):\n        curr = heapq.heappop(min_heap)\n        heapq.heappush(min_heap, curr * 2)\n        heapq.heappush(min_heap, curr * 3)\n        heapq.heappush(min_heap, curr * 5)\n    return curr`,
        corrected_code: `import heapq\ndef nthUglyNumber(n: int) -> int:\n    min_heap = [1]\n    seen = {1\n    factors = [2, 3, 5]\n    for _ in range(n):\n        curr = heapq.heappop(min_heap)\n        for f in factors:\n            nxt = curr * f\n            if nxt ! in seen:\n                seen.add(nxt)\n                heapq.heappush(min_heap, nxt)\n    return curr`,
      },
    }
  },

  {
    id: "q_heap_295",
    title: "Find Median from Data Stream (LeetCode 295)",
    topic: "heaps",
    difficulty: "hard",
    language: "python",
    problem_statement: {
      description: "Find the median of a continuous stream of integers in O(log n) add and O(1) find.",
      constraints: ["At most 5 * 10^4 calls."],
      examples: [
        {
          input: "add(1), add(2), findMedian(), add(3), findMedian()",
          output: "1.5, 2.0"
        }
      ]
    },
    ai_response: {
      code: `import heapq\nclass MedianFinder:\n    def __init__(self):\n        self.small = []\n        self.large = []\n    def addNum(self, num):\n        heapq.heappush(self.small, -num)\n        # Bug: Cross-heap boundary invariant violation\n        if len(self.small) > len(self.large) + 1:\n            val = -heapq.heappop(self.small)\n            heapq.heappush(self.large, val)\n    def findMedian(self):\n        if len(self.small) > len(self.large):\n            return float(-self.small[0])\n        return (-self.small[0] + self.large[0]) / 2.0`,
      stated_explanation: "Dual heap median.",
      stated_time_complexity: "O(log n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_heap_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [8],
          description: "Dual-heap partition boundary violation without cross-check.",
          failing_input_example: "add(1), add(2), add(3)",
          why_it_matters: "Two heaps must maintain max(small) <= min(large)."
        }
      ],
      optimal_complexity: {
        time: "O(log n) add, O(1) median",
        space: "O(n)",
        reasoning: "Two balanced heaps."
      },
      corrected_code: `import heapq\nclass MedianFinder:\n    def __init__(self):\n        self.small = []; self.large = []\n    def addNum(self, num):\n        val = -heapq.heappushpop(self.small, -num)\n        heapq.heappush(self.large, val)\n        if len(self.large) > len(self.small):\n            val = heapq.heappop(self.large)\n            heapq.heappush(self.small, -val)\n    def findMedian(self):\n        if len(self.small) > len(self.large): return float(-self.small[0])\n        return (-self.small[0] + self.large[0]) / 2.0`,
      model_critique_summary: "Dual heap cross-boundary violation."
    },
    language_variants: {
      cpp: {
        code: `import heapq\nclass MedianFinder:\n    auto __init__() {\n        this->small = []\n        this->large = []\n    def addNum(self, num):\n        heapq.heappush(this->small, -num)\n        // Bug: Cross-heap boundary invariant violation\n        if this->small.size() > this->large.size() + 1:\n            val = -heapq.heappop(this->small)\n            heapq.heappush(this->large, val)\n    def findMedian(self):\n        if this->small.size() > this->large.size():\n            return float(-this->small[0])\n        return (-this->small[0] + this->large[0]) / 2.0`,
        corrected_code: `import heapq\nclass MedianFinder:\n    auto __init__() {\n        this->small = []; this->large = []\n    def addNum(self, num):\n        val = -heapq.heappushpop(this->small, -num)\n        heapq.heappush(this->large, val)\n        if this->large.size() > this->small.size():\n            val = heapq.heappop(this->large)\n            heapq.heappush(this->small, -val)\n    def findMedian(self):\n        if this->small.size() > this->large.size(): return float(-this->small[0])\n        return (-this->small[0] + this->large[0]) / 2.0`,
      },
      javascript: {
        code: `import heapq\nclass MedianFinder:\n    var __init__ = function() {\n        this.small = []\n        this.large = []\n    def addNum(self, num):\n        heapq.heappush(this.small, -num)\n        // Bug: Cross-heap boundary invariant violation\n        if this.small.length > this.large.length + 1:\n            val = -heapq.heappop(this.small)\n            heapq.heappush(this.large, val)\n    def findMedian(self):\n        if this.small.length > this.large.length:\n            return float(-this.small[0])\n        return (-this.small[0] + this.large[0]) / 2.0`,
        corrected_code: `import heapq\nclass MedianFinder:\n    var __init__ = function() {\n        this.small = []; this.large = []\n    def addNum(self, num):\n        val = -heapq.heappushpop(this.small, -num)\n        heapq.heappush(this.large, val)\n        if this.large.length > this.small.length:\n            val = heapq.heappop(this.large)\n            heapq.heappush(this.small, -val)\n    def findMedian(self):\n        if this.small.length > this.large.length: return float(-this.small[0])\n        return (-this.small[0] + this.large[0]) / 2.0`,
      },
    }
  },

  {
    id: "q_heap_621",
    title: "Task Scheduler (LeetCode 621)",
    topic: "heaps",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Return the minimum number of CPU intervals required to complete all tasks with cooling interval n.",
      constraints: ["0 <= n <= 100"],
      examples: [
        {
          input: 'tasks = ["A","A","A","B","B","B"], n = 2',
          output: "8"
        }
      ]
    },
    ai_response: {
      code: `from collections import Counter\ndef leastInterval(tasks, n):\n    count = Counter(tasks)\n    max_freq = max(count.values())\n    max_count = sum(1 for v in count.values() if v == max_freq)\n    part_count = max_freq - 1\n    part_length = n - (max_count - 1)\n    empty_slots = part_count * part_length\n    available_tasks = len(tasks) - (max_freq * max_count)\n    # Bug: can be negative\n    idles = empty_slots - available_tasks\n    return len(tasks) + idles`,
      stated_explanation: "Chunk calculation formula.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_heap_03",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [10],
          description: "Negative idle slots underflow.",
          failing_input_example: 'tasks = ["A","A","A","B","C","D","E","F","G"], n = 2',
          why_it_matters: "Must clamp idles = max(0, empty_slots - available_tasks)."
        }
      ],
      optimal_complexity: {
        time: "O(len(tasks))",
        space: "O(1)",
        reasoning: "Frequency table."
      },
      corrected_code: `from collections import Counter\ndef leastInterval(tasks, n):\n    count = Counter(tasks)\n    max_freq = max(count.values())\n    max_count = sum(1 for v in count.values() if v == max_freq)\n    part_count = max_freq - 1\n    part_length = n - (max_count - 1)\n    empty_slots = part_count * part_length\n    available_tasks = len(tasks) - (max_freq * max_count)\n    idles = max(0, empty_slots - available_tasks)\n    return len(tasks) + idles`,
      model_critique_summary: "Negative idle underflow."
    },
    language_variants: {
      cpp: {
        code: `from collections import Counter\nauto leastInterval(tasks, n) {\n    count = Counter(tasks)\n    max_freq = max(count.values())\n    max_count = sum(1 for v in count.values() if v == max_freq)\n    part_count = max_freq - 1\n    part_length = n - (max_count - 1)\n    empty_slots = part_count * part_length\n    available_tasks = tasks.size() - (max_freq * max_count)\n    // Bug: can be negative\n    idles = empty_slots - available_tasks\n    return tasks.size() + idles`,
        corrected_code: `from collections import Counter\nauto leastInterval(tasks, n) {\n    count = Counter(tasks)\n    max_freq = max(count.values())\n    max_count = sum(1 for v in count.values() if v == max_freq)\n    part_count = max_freq - 1\n    part_length = n - (max_count - 1)\n    empty_slots = part_count * part_length\n    available_tasks = tasks.size() - (max_freq * max_count)\n    idles = max(0, empty_slots - available_tasks)\n    return tasks.size() + idles`,
      },
      javascript: {
        code: `from collections import Counter\nvar leastInterval = function(tasks, n) {\n    count = Counter(tasks)\n    max_freq = max(count.values())\n    max_count = sum(1 for v in count.values() if v == max_freq)\n    part_count = max_freq - 1\n    part_length = n - (max_count - 1)\n    empty_slots = part_count * part_length\n    available_tasks = tasks.length - (max_freq * max_count)\n    // Bug: can be negative\n    idles = empty_slots - available_tasks\n    return tasks.length + idles`,
        corrected_code: `from collections import Counter\nvar leastInterval = function(tasks, n) {\n    count = Counter(tasks)\n    max_freq = max(count.values())\n    max_count = sum(1 for v in count.values() if v == max_freq)\n    part_count = max_freq - 1\n    part_length = n - (max_count - 1)\n    empty_slots = part_count * part_length\n    available_tasks = tasks.length - (max_freq * max_count)\n    idles = max(0, empty_slots - available_tasks)\n    return tasks.length + idles`,
      },
    }
  }
];
