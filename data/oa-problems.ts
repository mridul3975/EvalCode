import { OAProblem, OACompanyTrack } from "@/types/oa";

export const OA_PROBLEMS: OAProblem[] = [
  {
    id: "oa_citadel_orderbook",
    title: "Order Book Volume at Price Limits",
    companyProfile: "Citadel",
    difficulty: "Hard",
    topic: "Hash Map & Heaps / Interval Scheduling",
    tags: ["High-Frequency Trading", "Streaming", "Heaps", "Hash Tables", "Citadel Quant"],
    description: `### Real-Time Trading Engine Context
In high-frequency equity and options trading at **Citadel Execution Services**, an ultra-low-latency matching engine ingests a chronological stream of limit order operations: \`[timestamp, order_id, side, price, volume]\`.

Each operation represents either a **NEW** order insertion, an order **CANCEL**, or an **EXECUTE** fill:
* A BUY order (\`side = 'B'\`) or SELL order (\`side = 'S'\`) is placed at a specific limit price.
* If multiple orders arrive at the exact same limit price, they form a price level where total available depth is the sum of active order quantities.

### Problem Requirement
You must implement a high-performance function \`compute_depth_window(orders, k, window_ms)\` that:
1. Maintains the order book state over a rolling temporal window of \`window_ms\` milliseconds based on each order's timestamp.
2. At the conclusion of the event stream, outputs the **Top $k$ deepest price levels** for both BUY and SELL sides, sorted by available volume in descending order (breaking ties by price priority: higher price for BUY, lower price for SELL).

### Input Format
* \`orders\`: List of tuples/arrays: \`[timestamp (int), order_id (str), action (str: "ADD"|"CANCEL"), side (str: "B"|"S"), price (float), volume (int)]\`
* \`k\`: Integer, number of top price levels requested per side.
* \`window_ms\`: Integer, duration of the active window ending at \`max(timestamp)\`. Orders with \`timestamp < max_timestamp - window_ms\` expire.

### Output Format
* Return a dictionary/object with keys \`"buy_depth"\` and \`"sell_depth"\`, where each is a list of \`[price, total_volume]\` pairs up to $k$ entries.`,
    constraints: [
      "1 <= len(orders) <= 100,000",
      "1 <= timestamp <= 10^9 (strictly non-decreasing timestamps)",
      "volume > 0",
      "1 <= k <= 100",
      "window_ms >= 100",
      "Time complexity must be O(N log K) or better to satisfy Citadel low-latency SLAs",
    ],
    examples: [
      {
        input: `orders = [
  [100, "ord1", "ADD", "B", 150.50, 200],
  [150, "ord2", "ADD", "B", 150.50, 300],
  [200, "ord3", "ADD", "S", 151.00, 400],
  [300, "ord4", "CANCEL", "B", 150.50, 100]
], k = 1, window_ms = 500`,
        output: `{"buy_depth": [[150.5, 400]], "sell_depth": [[151.0, 400]]}`,
        explanation: "At time 300, ord1 (200) + ord2 (300) - cancel (100) = 400 at price 150.50. Sell side has 400 at 151.00.",
      },
      {
        input: `orders = [
  [10, "o1", "ADD", "B", 100.0, 50],
  [1000, "o2", "ADD", "B", 102.0, 80]
], k = 2, window_ms = 500`,
        output: `{"buy_depth": [[102.0, 80]], "sell_depth": []}`,
        explanation: "o1 at t=10 expired because 1000 - 500 = 500 > 10. Only o2 remains.",
      },
    ],
    functionName: "compute_depth_window",
    starterCode: {
      python: `from typing import List, Dict, Any

def compute_depth_window(orders: List[List[Any]], k: int, window_ms: int) -> Dict[str, List[List[float]]]:
    """
    Citadel Quantitative Engineering Assessment:
    Compute Top-K Order Depth for Buy & Sell within rolling window.
    
    orders format: [timestamp, order_id, action, side, price, volume]
    """
    # Write your solution below
    buy_depth = []
    sell_depth = []
    
    return {"buy_depth": buy_depth, "sell_depth": sell_depth}
`,
      typescript: `interface DepthResult {
  buy_depth: [number, number][];
  sell_depth: [number, number][];
}

function compute_depth_window(
  orders: [number, string, "ADD" | "CANCEL", "B" | "S", number, number][],
  k: number,
  window_ms: number
): DepthResult {
  // Write your TypeScript solution below
  return {
    buy_depth: [],
    sell_depth: []
  };
}
`,
      cpp: `#include <vector>
#include <string>
#include <map>
#include <tuple>

struct DepthResult {
    std::vector<std::pair<double, int>> buy_depth;
    std::vector<std::pair<double, int>> sell_depth;
};

DepthResult compute_depth_window(
    const std::vector<std::tuple<long long, std::string, std::string, std::string, double, int>>& orders,
    int k,
    int window_ms
) {
    DepthResult res;
    // Write your C++ solution below
    return res;
}
`,
    },
    testCases: [
      {
        id: "tc_visible_1",
        description: "Standard Order Aggregation & Cancellation",
        input: `orders = [
  [100, "ord1", "ADD", "B", 150.5, 200],
  [150, "ord2", "ADD", "B", 150.5, 300],
  [200, "ord3", "ADD", "S", 151.0, 400],
  [300, "ord4", "CANCEL", "B", 150.5, 100]
], k = 1, window_ms = 500`,
        rawInputArgs: [
          [
            [100, "ord1", "ADD", "B", 150.5, 200],
            [150, "ord2", "ADD", "B", 150.5, 300],
            [200, "ord3", "ADD", "S", 151.0, 400],
            [300, "ord4", "CANCEL", "B", 150.5, 100],
          ],
          1,
          500,
        ],
        expected: { buy_depth: [[150.5, 400]], sell_depth: [[151.0, 400]] },
        isHidden: false,
      },
      {
        id: "tc_visible_2",
        description: "Window Expiration of Stale Orders",
        input: `orders = [
  [10, "o1", "ADD", "B", 100.0, 50],
  [1000, "o2", "ADD", "B", 102.0, 80]
], k = 2, window_ms = 500`,
        rawInputArgs: [
          [
            [10, "o1", "ADD", "B", 100.0, 50],
            [1000, "o2", "ADD", "B", 102.0, 80],
          ],
          2,
          500,
        ],
        expected: { buy_depth: [[102.0, 80]], sell_depth: [] },
        isHidden: false,
      },
      {
        id: "tc_visible_3",
        description: "Multiple Price Levels Sorted by Volume Priority",
        input: `orders = [
  [100, "b1", "ADD", "B", 10.0, 100],
  [100, "b2", "ADD", "B", 11.0, 500],
  [100, "b3", "ADD", "B", 12.0, 300]
], k = 2, window_ms = 1000`,
        rawInputArgs: [
          [
            [100, "b1", "ADD", "B", 10.0, 100],
            [100, "b2", "ADD", "B", 11.0, 500],
            [100, "b3", "ADD", "B", 12.0, 300],
          ],
          2,
          1000,
        ],
        expected: { buy_depth: [[11.0, 500], [12.0, 300]], sell_depth: [] },
        isHidden: false,
      },
      {
        id: "tc_hidden_1",
        description: "Hidden Edge Case: Complete Cancellation to Zero Volume",
        input: `[Hidden Edge Case Suite: Zero Depth Filtering]`,
        rawInputArgs: [
          [
            [100, "s1", "ADD", "S", 200.0, 50],
            [200, "s2", "CANCEL", "S", 200.0, 50],
          ],
          2,
          1000,
        ],
        expected: { buy_depth: [], sell_depth: [] },
        isHidden: true,
      },
      {
        id: "tc_hidden_2",
        description: "Hidden Edge Case: Empty Order Stream",
        input: `[Hidden Edge Case Suite: Empty Stream Handling]`,
        rawInputArgs: [[], 3, 1000],
        expected: { buy_depth: [], sell_depth: [] },
        isHidden: true,
      },
      {
        id: "tc_hidden_3",
        description: "Hidden Edge Case: Simultaneous Same-Millisecond Multi-Add & Cancel",
        input: `[Hidden Edge Case Suite: Concurrency Bursts]`,
        rawInputArgs: [
          [
            [500, "o1", "ADD", "B", 50.0, 100],
            [500, "o2", "ADD", "B", 50.0, 250],
            [500, "o3", "ADD", "S", 55.0, 150],
            [500, "o4", "CANCEL", "B", 50.0, 50],
          ],
          1,
          200,
        ],
        expected: { buy_depth: [[50.0, 300]], sell_depth: [[55.0, 150]] },
        isHidden: true,
      },
      {
        id: "tc_hidden_4",
        description: "Hidden Edge Case: Boundary Window Expiry (Exact Timestamp Match)",
        input: `[Hidden Edge Case Suite: Strict Inclusive/Exclusive Window Interval]`,
        rawInputArgs: [
          [
            [100, "b1", "ADD", "B", 10.0, 100],
            [600, "b2", "ADD", "B", 20.0, 200],
          ],
          2,
          500,
        ],
        expected: { buy_depth: [[20.0, 200], [10.0, 100]], sell_depth: [] },
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(N log K)",
      space: "O(P) where P is distinct active price levels",
      reasoning: "Filter expired orders with two-pointer/deque in O(N). Hash map aggregates volume by price. Min-heap of size K selects top depth in O(P log K).",
    },
  },

  {
    id: "oa_google_ratelimit",
    title: "Sliding Window Maximum Rate Limiter",
    companyProfile: "Google",
    difficulty: "Medium",
    topic: "Sliding Window / Monotonic Deque",
    tags: ["Google Infrastructure", "Distributed Systems", "Sliding Window", "Deque", "Concurrency"],
    description: `### Google Cloud Systems Architecture
At **Google Cloud API Gateway**, incoming request traffic is metered per customer tenant using a sliding-window rate limiter. Rather than fixed-bucket resets, Google employs a precise sub-millisecond sliding window to protect downstream microservices from burst amplification attacks.

### Problem Requirement
Given a chronological array of request arrival timestamps \`timestamps\` (in microseconds), a window capacity \`limit\`, and a duration \`window_us\`, determine:
1. For every request, whether it is **ACCEPTED** (\`True\`) or **THROTTLED** (\`False\`).
2. An accepted request counts towards the rate limiter limit for the subsequent \`window_us\` microseconds.
3. Throttled requests are rejected immediately and **do not consume capacity**.

Return a boolean array \`results\` corresponding to each request in \`timestamps\`.`,
    constraints: [
      "1 <= len(timestamps) <= 200,000",
      "0 <= timestamps[i] <= 10^12",
      "timestamps is sorted in non-decreasing order",
      "1 <= limit <= 50,000",
      "1 <= window_us <= 10^9",
      "Amortized O(1) per request time complexity required to pass production throughput gates",
    ],
    examples: [
      {
        input: `timestamps = [100, 200, 300, 400, 500], limit = 3, window_us = 300`,
        output: `[true, true, true, false, true]`,
        explanation: "t=100, 200, 300 accepted (3 in window). At t=400, window is [100..400] -> 3 active accepted requests, so t=400 is THROTTLED. At t=500, t=100 has expired (500 - 300 = 200), only t=200, 300 active, so t=500 accepted.",
      },
    ],
    functionName: "rate_limiter",
    starterCode: {
      python: `from typing import List

def rate_limiter(timestamps: List[int], limit: int, window_us: int) -> List[bool]:
    """
    Google Cloud Traffic Infrastructure:
    Determine rate limit status for each incoming request timestamp.
    """
    # Write your solution below
    return []
`,
      typescript: `function rate_limiter(
  timestamps: number[],
  limit: number,
  window_us: number
): boolean[] {
  // Write your TypeScript solution below
  return [];
}
`,
      cpp: `#include <vector>
#include <deque>

std::vector<bool> rate_limiter(
    const std::vector<long long>& timestamps,
    int limit,
    long long window_us
) {
    std::vector<bool> result;
    // Write your C++ solution below
    return result;
}
`,
    },
    testCases: [
      {
        id: "tc_visible_1",
        description: "Standard sliding window throttling",
        input: `timestamps = [100, 200, 300, 400, 500], limit = 3, window_us = 300`,
        rawInputArgs: [[100, 200, 300, 400, 500], 3, 300],
        expected: [true, true, true, false, true],
        isHidden: false,
      },
      {
        id: "tc_visible_2",
        description: "Burst at identical timestamp",
        input: `timestamps = [10, 10, 10, 10], limit = 2, window_us = 100`,
        rawInputArgs: [[10, 10, 10, 10], 2, 100],
        expected: [true, true, false, false],
        isHidden: false,
      },
      {
        id: "tc_hidden_1",
        description: "Hidden Edge Case: Single request capacity",
        input: `[Hidden Suite: Limit=1 boundary]`,
        rawInputArgs: [[10, 20, 110, 120, 250], 1, 100],
        expected: [true, false, true, false, true],
        isHidden: true,
      },
      {
        id: "tc_hidden_2",
        description: "Hidden Edge Case: Zero throttles across spacious requests",
        input: `[Hidden Suite: Large timestamp gaps]`,
        rawInputArgs: [[1000, 5000, 10000, 50000], 2, 500],
        expected: [true, true, true, true],
        isHidden: true,
      },
      {
        id: "tc_hidden_3",
        description: "Hidden Edge Case: Massive burst recovery",
        input: `[Hidden Suite: 10 requests burst with recovery]`,
        rawInputArgs: [[100, 101, 102, 103, 104, 200, 201, 300, 301, 302], 3, 100],
        expected: [true, true, true, false, false, true, true, true, true, true],
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(N)",
      space: "O(limit)",
      reasoning: "Monotonic Queue / Deque storing accepted timestamps. Each accepted timestamp is pushed once and popped at most once when expired.",
    },
  },

  {
    id: "oa_zurich_arbitrage",
    title: "Foreign Exchange Triangular Arbitrage",
    companyProfile: "Fintech",
    difficulty: "Hard",
    topic: "Graph Algorithms / Bellman-Ford / Negative Cycles",
    tags: ["FinTech", "Quantitative Arbitrage", "Graph Theory", "Negative Cycles", "Currency Exchange"],
    description: `### Global FX Trading & Quantitative Execution
At leading Zurich quantitative trading desks, currency pairs (e.g., EUR/USD, USD/CHF, CHF/EUR) trade across electronic communication networks (ECNs). A risk-free profit opportunity called **triangular arbitrage** exists when a sequence of currency conversions yields more capital than the starting amount after accounting for exchange bid-ask spreads.

### Mathematical Formulation
Given an exchange rate table where rate \`R[A][B]\` represents units of currency \`B\` received per unit of \`A\`:
A cycle of currencies $C_1 \to C_2 \to \dots \to C_k \to C_1$ is an arbitrage opportunity if:
$$\prod_{i=1}^{k} R[C_i][C_{i+1}] > 1.0$$
Taking the negative natural logarithm converts this into finding a **negative weight cycle**:
$$\sum_{i=1}^{k} -\ln(R[C_i][C_{i+1}]) < 0$$

### Problem Requirement
Implement \`detect_max_arbitrage(currencies, rates, max_hops)\` that:
1. Returns the maximum multiplication factor attainable starting from any currency and returning to the same currency in at most \`max_hops\` transactions.
2. If no profitable cycle exists ($> 1.0$), return \`1.0\`.
3. Round the final factor to 4 decimal places.`,
    constraints: [
      "2 <= len(currencies) <= 50",
      "rates is an N x N matrix of positive floats",
      "rates[i][i] = 1.0",
      "2 <= max_hops <= 6",
      "O(V * E * max_hops) or dynamic programming on DAG/cycle required",
    ],
    examples: [
      {
        input: `currencies = ["USD", "EUR", "GBP"], rates = [[1.0, 0.85, 0.75], [1.18, 1.0, 0.88], [1.34, 1.14, 1.0]], max_hops = 3`,
        output: `1.0069`,
        explanation: "USD -> EUR -> GBP -> USD yields 0.85 * 0.88 * 1.34 = 1.0023. USD -> GBP -> EUR -> USD yields 0.75 * 1.14 * 1.18 = 1.0089.",
      },
    ],
    functionName: "detect_max_arbitrage",
    starterCode: {
      python: `from typing import List

def detect_max_arbitrage(currencies: List[str], rates: List[List[float]], max_hops: int) -> float:
    """
    Zurich FinTech Quantitative Screening:
    Detect maximum arbitrage multiplier within max_hops conversions.
    """
    # Write your solution below
    return 1.0
`,
      typescript: `function detect_max_arbitrage(
  currencies: string[],
  rates: number[][],
  max_hops: number
): number {
  // Write your TypeScript solution below
  return 1.0;
}
`,
      cpp: `#include <vector>
#include <string>
#include <cmath>
#include <algorithm>

double detect_max_arbitrage(
    const std::vector<std::string>& currencies,
    const std::vector<std::vector<double>>& rates,
    int max_hops
) {
    // Write your C++ solution below
    return 1.0;
}
`,
    },
    testCases: [
      {
        id: "tc_visible_1",
        description: "Classic 3-currency triangular arbitrage",
        input: `currencies = ["USD", "EUR", "GBP"], rates = [[1.0, 0.9, 0.7], [1.12, 1.0, 0.8], [1.45, 1.26, 1.0]], max_hops = 3`,
        rawInputArgs: [
          ["USD", "EUR", "GBP"],
          [
            [1.0, 0.9, 0.7],
            [1.12, 1.0, 0.8],
            [1.45, 1.26, 1.0],
          ],
          3,
        ],
        expected: 1.044,
        isHidden: false,
      },
      {
        id: "tc_visible_2",
        description: "No arbitrage available (Efficient Market)",
        input: `currencies = ["USD", "EUR"], rates = [[1.0, 0.8], [1.25, 1.0]], max_hops = 2`,
        rawInputArgs: [
          ["USD", "EUR"],
          [
            [1.0, 0.8],
            [1.25, 1.0],
          ],
          2,
        ],
        expected: 1.0,
        isHidden: false,
      },
      {
        id: "tc_hidden_1",
        description: "Hidden Edge Case: 4-hop chain superiority",
        input: `[Hidden Suite: 4-Hop Currency Network]`,
        rawInputArgs: [
          ["A", "B", "C", "D"],
          [
            [1.0, 2.0, 0.5, 0.25],
            [0.5, 1.0, 3.0, 0.5],
            [2.0, 0.33, 1.0, 2.0],
            [4.0, 2.0, 0.5, 1.0],
          ],
          4,
        ],
        expected: 24.0,
        isHidden: true,
      },
      {
        id: "tc_hidden_2",
        description: "Hidden Edge Case: Heavy frictional fee (lossy rates)",
        input: `[Hidden Suite: High Slippage Penalty]`,
        rawInputArgs: [
          ["USD", "JPY", "CHF"],
          [
            [1.0, 100.0, 0.7],
            [0.008, 1.0, 0.006],
            [1.1, 120.0, 1.0],
          ],
          3,
        ],
        expected: 1.0,
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(K * V^2)",
      space: "O(V)",
      reasoning: "Bellman-Ford variant / DP where DP[hop][v] represents maximum multiplier starting from source v.",
    },
  },

  {
    id: "oa_meta_bridge",
    title: "Bounded-Hop Social Network Bridges",
    companyProfile: "Meta",
    difficulty: "Medium",
    topic: "Graphs / Tarjan's Bridge Finding & BFS",
    tags: ["Meta Infrastructure", "Graph Theory", "Bridges", "Tarjan", "Network Resilience"],
    description: `### Meta Global Graph Infrastructure
At **Meta Infrastructure (TAO/Social Graph)**, maintaining graph connectivity is vital to message routing and feed consistency. A critical vulnerability occurs when the failure of a single edge disconnects user subclusters.

### Problem Requirement
You are given an undirected social network graph with \`n\` servers (nodes \`0\` to \`n-1\`) and an edge list \`connections\`.
A **critical bridge** is defined as an edge whose removal strictly increases the number of connected components in the graph.

Additionally, each server has a latency weight. You must return all critical bridges sorted lexicographically:
* Each bridge must be represented as \`[u, v]\` where \`u < v\`.
* The overall list of bridges must be sorted primarily by \`u\` ascending, then by \`v\` ascending.`,
    constraints: [
      "2 <= n <= 100,000",
      "n - 1 <= len(connections) <= 100,000",
      "0 <= u, v < n",
      "No duplicate edges or self-loops",
      "Graph is connected",
      "Linear O(V + E) Tarjan DFS required",
    ],
    examples: [
      {
        input: `n = 4, connections = [[0, 1], [1, 2], [2, 0], [1, 3]]`,
        output: `[[1, 3]]`,
        explanation: "Edges (0,1), (1,2), (2,0) form a cycle. Edge (1,3) is the only bridge connecting node 3.",
      },
    ],
    functionName: "critical_bridges",
    starterCode: {
      python: `from typing import List

def critical_bridges(n: int, connections: List[List[int]]) -> List[List[int]]:
    """
    Meta Systems & Infrastructure Assessment:
    Find all critical bridges in an undirected network graph using Tarjan's algorithm.
    """
    # Write your solution below
    return []
`,
      typescript: `function critical_bridges(
  n: number,
  connections: [number, number][]
): [number, number][] {
  // Write your TypeScript solution below
  return [];
}
`,
      cpp: `#include <vector>
#include <algorithm>

std::vector<std::vector<int>> critical_bridges(
    int n,
    const std::vector<std::vector<int>>& connections
) {
    std::vector<std::vector<int>> bridges;
    // Write your C++ solution below
    return bridges;
}
`,
    },
    testCases: [
      {
        id: "tc_visible_1",
        description: "Standard Triangle with Tail Bridge",
        input: `n = 4, connections = [[0, 1], [1, 2], [2, 0], [1, 3]]`,
        rawInputArgs: [4, [[0, 1], [1, 2], [2, 0], [1, 3]]],
        expected: [[1, 3]],
        isHidden: false,
      },
      {
        id: "tc_visible_2",
        description: "Pure Tree Graph (All edges are bridges)",
        input: `n = 3, connections = [[0, 1], [1, 2]]`,
        rawInputArgs: [3, [[0, 1], [1, 2]]],
        expected: [[0, 1], [1, 2]],
        isHidden: false,
      },
      {
        id: "tc_hidden_1",
        description: "Hidden Edge Case: Pure Ring/Cycle (Zero bridges)",
        input: `[Hidden Suite: 5-Node Cycle]`,
        rawInputArgs: [5, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]]],
        expected: [],
        isHidden: true,
      },
      {
        id: "tc_hidden_2",
        description: "Hidden Edge Case: Barbell Graph (Two cliques connected by one edge)",
        input: `[Hidden Suite: Barbell Architecture]`,
        rawInputArgs: [
          6,
          [
            [0, 1], [1, 2], [2, 0],
            [3, 4], [4, 5], [5, 3],
            [2, 3],
          ],
        ],
        expected: [[2, 3]],
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(V + E)",
      space: "O(V + E)",
      reasoning: "Tarjan's bridge-finding algorithm using discovery time and lowest reachable ancestor in single DFS traversal.",
    },
  },

  {
    id: "oa_twosigma_median",
    title: "Dynamic Risk-Weighted Median Filter",
    companyProfile: "Two Sigma",
    difficulty: "Medium",
    topic: "Streaming Data & Dual Heaps",
    tags: ["Two Sigma", "Quant Research", "Streaming", "Heaps", "Statistics"],
    description: `### Quantitative Modeling & Alpha Signals
At **Two Sigma**, statistical alpha research requires computing continuous running medians of market tick data to filter high-frequency noise without distortion from outlier spikes.

### Problem Requirement
Design a streaming algorithm \`running_medians(stream)\` that receives a sequence of numeric ticks and computes the median after every received element:
* If the number of processed elements is odd, the median is the center value.
* If the number of processed elements is even, the median is the arithmetic mean of the two middle values rounded to 2 decimal places.

Return the array of running medians.`,
    constraints: [
      "1 <= len(stream) <= 100,000",
      "-10^9 <= stream[i] <= 10^9",
      "O(log N) per incoming element via dual heaps (Max-Heap + Min-Heap)",
    ],
    examples: [
      {
        input: `stream = [2, 1, 5, 7, 2, 0, 5]`,
        output: `[2.0, 1.5, 2.0, 3.5, 2.0, 2.0, 2.0]`,
        explanation: "1st: [2] -> 2.0. 2nd: [1,2] -> 1.5. 3rd: [1,2,5] -> 2.0. 4th: [1,2,5,7] -> 3.5, etc.",
      },
    ],
    functionName: "running_medians",
    starterCode: {
      python: `from typing import List

def running_medians(stream: List[float]) -> List[float]:
    """
    Two Sigma Alpha Research Assessment:
    Compute running medians using dual balanced heaps.
    """
    # Write your solution below
    return []
`,
      typescript: `function running_medians(stream: number[]): number[] {
  // Write your TypeScript solution below
  return [];
}
`,
      cpp: `#include <vector>
#include <queue>

std::vector<double> running_medians(const std::vector<double>& stream) {
    std::vector<double> result;
    // Write your C++ solution below
    return result;
}
`,
    },
    testCases: [
      {
        id: "tc_visible_1",
        description: "Alternating odd and even lengths",
        input: `stream = [2, 1, 5, 7, 2, 0, 5]`,
        rawInputArgs: [[2, 1, 5, 7, 2, 0, 5]],
        expected: [2.0, 1.5, 2.0, 3.5, 2.0, 2.0, 2.0],
        isHidden: false,
      },
      {
        id: "tc_visible_2",
        description: "Monotonically increasing stream",
        input: `stream = [10, 20, 30, 40]`,
        rawInputArgs: [[10, 20, 30, 40]],
        expected: [10.0, 15.0, 20.0, 25.0],
        isHidden: false,
      },
      {
        id: "tc_hidden_1",
        description: "Hidden Edge Case: Single element",
        input: `[Hidden Suite: Length 1]`,
        rawInputArgs: [[42]],
        expected: [42.0],
        isHidden: true,
      },
      {
        id: "tc_hidden_2",
        description: "Hidden Edge Case: Negative values with zero balance",
        input: `[Hidden Suite: Signed Float Boundaries]`,
        rawInputArgs: [[-5, -10, 0, 5, 10]],
        expected: [-5.0, -7.5, -5.0, 0.0, 0.0],
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(N log N)",
      space: "O(N)",
      reasoning: "Two balanced heaps (max-heap for smaller half, min-heap for larger half). Balance maintained in O(log N) per tick.",
    },
  },

  {
    id: "oa_citadel_ringbuffer",
    title: "Lock-Free Ring Buffer",
    companyProfile: "Citadel",
    difficulty: "Medium",
    topic: "Concurrency & Circular Buffers",
    tags: ["Citadel", "Low-Latency", "Ring Buffer", "Arrays", "Concurrency"],
    description: `### High-Frequency Message Bus Context
In ultra-low-latency market infrastructure at **Citadel Securities**, cross-thread IPC (Inter-Process Communication) utilizes fixed-size circular ring buffers to pass market ticks between network card ring drivers and alpha strategy threads without lock contention or allocation overhead.

### Problem Requirement
Implement a simulation function \`simulate_ring_buffer(capacity, operations)\` that manages a FIFO circular ring buffer of maximum capacity \`capacity\`:
* \`["PUSH", val]\`: Inserts \`val\` at the tail. If the buffer is full, the push fails and returns \`-1\`. Otherwise returns \`1\`.
* \`["POP"]\`: Dequeues and returns the element at the head. If the buffer is empty, returns \`-1\`.
* \`["PEEK"]\`: Returns the element at the head without removing it. If the buffer is empty, returns \`-1\`.
* \`["SIZE"]\`: Returns the current number of elements in the buffer.

Return the array of outputs generated by each operation in chronological order.`,
    constraints: [
      "1 <= capacity <= 100,000",
      "1 <= len(operations) <= 100,000",
      "val is an integer between 0 and 10^9",
      "All operations must execute in O(1) time complexity.",
    ],
    examples: [
      {
        input: `capacity = 2, operations = [["PUSH", 10], ["PUSH", 20], ["PUSH", 30], ["PEEK"], ["POP"], ["POP"], ["POP"]]`,
        output: `[1, 1, -1, 10, 10, 20, -1]`,
        explanation: "Pushes 10 and 20 (success). Third push fails (-1) because capacity is 2. Peek sees 10. Pops 10, then 20. Third pop fails (-1) because buffer is empty.",
      },
    ],
    functionName: "simulate_ring_buffer",
    starterCode: {
      python: `from typing import List, Any

def simulate_ring_buffer(capacity: int, operations: List[List[Any]]) -> List[int]:
    """
    Citadel Execution Services:
    Circular Ring Buffer Simulation for Low-Latency Queueing.
    Operations: ["PUSH", val], ["POP"], ["PEEK"], ["SIZE"]
    """
    results = []
    # Write your O(1) ring buffer logic below
    return results
`,
      typescript: `function simulate_ring_buffer(capacity: number, operations: [string, number?][]): number[] {
  // Write your TypeScript solution below
  const results: number[] = [];
  return results;
}
`,
      cpp: `#include <vector>
#include <string>

std::vector<int> simulate_ring_buffer(int capacity, const std::vector<std::pair<std::string, int>>& operations) {
    std::vector<int> results;
    // Write your C++ solution below
    return results;
}
`,
    },
    testCases: [
      {
        id: "tc_visible_1",
        description: "Standard Push, Peek, and Pop with capacity boundary",
        input: `capacity = 2, operations = [["PUSH", 10], ["PUSH", 20], ["PUSH", 30], ["PEEK"], ["POP"], ["POP"], ["POP"]]`,
        rawInputArgs: [
          2,
          [["PUSH", 10], ["PUSH", 20], ["PUSH", 30], ["PEEK"], ["POP"], ["POP"], ["POP"]],
        ],
        expected: [1, 1, -1, 10, 10, 20, -1],
        isHidden: false,
      },
      {
        id: "tc_visible_2",
        description: "Wrap-around circular index verification",
        input: `capacity = 3, operations = [["PUSH", 1], ["PUSH", 2], ["POP"], ["PUSH", 3], ["PUSH", 4], ["SIZE"], ["POP"], ["POP"]]`,
        rawInputArgs: [
          3,
          [["PUSH", 1], ["PUSH", 2], ["POP"], ["PUSH", 3], ["PUSH", 4], ["SIZE"], ["POP"], ["POP"]],
        ],
        expected: [1, 1, 1, 1, 1, 3, 2, 3],
        isHidden: false,
      },
      {
        id: "tc_hidden_1",
        description: "Hidden Edge Case: Empty buffer pop and peek barrage",
        input: `[Hidden Suite: Consecutive Empty Query Invariants]`,
        rawInputArgs: [
          5,
          [["POP"], ["PEEK"], ["SIZE"], ["PUSH", 99], ["PEEK"], ["POP"], ["POP"]],
        ],
        expected: [-1, -1, 0, 1, 99, 99, -1],
        isHidden: true,
      },
      {
        id: "tc_hidden_2",
        description: "Hidden Edge Case: Repeated saturation and full draining cycle",
        input: `[Hidden Suite: Multiple Saturation Cycles]`,
        rawInputArgs: [
          1,
          [["PUSH", 5], ["PUSH", 6], ["POP"], ["PUSH", 7], ["POP"], ["POP"]],
        ],
        expected: [1, -1, 5, 1, 7, -1],
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(1) per operation",
      space: "O(C) where C is buffer capacity",
      reasoning: "Fixed-size circular array with head, tail, and count pointers wrapped modulo capacity.",
    },
  },
  {
    id: "oa_stripe_fraud",
    title: "Rule-Driven Transaction Fraud Detection",
    companyProfile: "Stripe",
    difficulty: "Medium",
    topic: "Rules Engine & Real-Time Classification",
    tags: ["Stripe Core", "FinTech", "Rules Engine", "Hash Maps"],
    description: `### Financial Fraud Shield Context
At **Stripe Radar**, payment operations streams are evaluated against an active registry of merchant and compliance risk rules in sub-millisecond response windows.

### Problem Requirement
Process a finite chronological sequence of operations:
* \`["UPSERT", ruleId, "AMOUNT_AT_LEAST", value]\`: Inserts or replaces a rule flagging transactions where \`amount >= value\`.
* \`["UPSERT", ruleId, "COUNTRY_IS", value]\`: Inserts or replaces a rule flagging transactions where \`country == value\`.
* \`["UPSERT", ruleId, "MERCHANT_IS", value]\`: Inserts or replaces a rule flagging transactions where \`merchant == value\`.
* \`["DELETE", ruleId]\`: Removes the rule with given ID. Deleting a non-existent ID is a no-op.
* \`["EVAL", amount, country, merchant]\`: Evaluates the transaction against all currently active rules.

A transaction is **fraudulent** (\`true\`) if *at least one* active rule matches. Otherwise, it is allowed (\`false\`). Return a list of booleans corresponding to each \`EVAL\` operation in chronological order.`,
    constraints: [
      "1 <= operations.length <= 200,000",
      "At least one EVAL operation exists",
      "Amounts are non-negative integers up to 10^9",
      "Time complexity must be O(R + E * active_rules) or O(1) evaluation lookup",
    ],
    examples: [
      {
        input: `operations = [
  ["UPSERT", "r1", "AMOUNT_AT_LEAST", "1000"],
  ["UPSERT", "r2", "COUNTRY_IS", "RU"],
  ["EVAL", "900", "US", "books"],
  ["EVAL", "1200", "US", "books"],
  ["EVAL", "20", "RU", "coffee"]
]`,
        output: `[false, true, true]`,
        explanation: "Transaction 1 matches neither rule. Transaction 2 exceeds $1000. Transaction 3 originates from RU.",
      },
      {
        input: `operations = [
  ["UPSERT", "risk", "AMOUNT_AT_LEAST", "100"],
  ["EVAL", "100", "US", "safe"],
  ["UPSERT", "risk", "MERCHANT_IS", "risky"],
  ["EVAL", "100", "US", "safe"],
  ["EVAL", "1", "US", "risky"],
  ["DELETE", "risk"],
  ["EVAL", "1", "US", "risky"]
]`,
        output: `[true, false, true, false]`,
        explanation: "Reusing ID 'risk' overwrites the rule. Deletion leaves no active rules for the final EVAL.",
      },
    ],
    functionName: "classifyTransactions",
    starterCode: {
      python: `from typing import List

def classifyTransactions(operations: List[List[str]]) -> List[bool]:
    """
    Stripe Radar Assessment:
    Evaluate transaction operations stream against dynamic rule state.
    """
    results = []
    # Write your solution below
    return results
`,
      typescript: `function classifyTransactions(operations: string[][]): boolean[] {
  const results: boolean[] = [];
  // Write your solution below
  return results;
}
`,
      cpp: `#include <vector>
#include <string>

std::vector<bool> classifyTransactions(const std::vector<std::vector<std::string>>& operations) {
    std::vector<bool> results;
    // Write your solution below
    return results;
}
`,
    },
    testCases: [
      {
        id: "stripe_tc_1",
        description: "Standard upsert and mixed EVAL",
        input: `operations = [["UPSERT","r1","AMOUNT_AT_LEAST","1000"],["UPSERT","r2","COUNTRY_IS","RU"],["EVAL","900","US","books"],["EVAL","1200","US","books"],["EVAL","20","RU","coffee"]]`,
        rawInputArgs: [[
          ["UPSERT", "r1", "AMOUNT_AT_LEAST", "1000"],
          ["UPSERT", "r2", "COUNTRY_IS", "RU"],
          ["EVAL", "900", "US", "books"],
          ["EVAL", "1200", "US", "books"],
          ["EVAL", "20", "RU", "coffee"],
        ]],
        expected: [false, true, true],
      },
      {
        id: "stripe_tc_2",
        description: "Rule overwrite and deletion lifecycle",
        input: `operations = [["UPSERT","risk","AMOUNT_AT_LEAST","100"],["EVAL","100","US","safe"],["UPSERT","risk","MERCHANT_IS","risky"],["EVAL","100","US","safe"],["EVAL","1","US","risky"],["DELETE","risk"],["EVAL","1","US","risky"]]`,
        rawInputArgs: [[
          ["UPSERT", "risk", "AMOUNT_AT_LEAST", "100"],
          ["EVAL", "100", "US", "safe"],
          ["UPSERT", "risk", "MERCHANT_IS", "risky"],
          ["EVAL", "100", "US", "safe"],
          ["EVAL", "1", "US", "risky"],
          ["DELETE", "risk"],
          ["EVAL", "1", "US", "risky"],
        ]],
        expected: [true, false, true, false],
      },
      {
        id: "stripe_tc_hidden",
        description: "Unknown delete tolerance & multi-eval baseline",
        input: `[Hidden Suite: Unknown rule deletion & zero amount eval]`,
        rawInputArgs: [[
          ["EVAL", "0", "US", "outlet"],
          ["UPSERT", "c", "COUNTRY_IS", "CA"],
          ["UPSERT", "m", "MERCHANT_IS", "outlet"],
          ["EVAL", "0", "US", "outlet"],
          ["EVAL", "0", "CA", "shop"],
          ["DELETE", "missing"],
          ["DELETE", "m"],
          ["EVAL", "0", "US", "outlet"],
        ]],
        expected: [false, true, true, false],
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(N) total processing time",
      space: "O(R) where R is unique active rules",
      reasoning: "Hash table indexed by ruleId with bucketed attribute matching.",
    },
  },
  {
    id: "oa_stripe_splittender",
    title: "Split Tender Transactions",
    companyProfile: "Stripe",
    difficulty: "Hard",
    topic: "Greedy Priority & Payment Settlement",
    tags: ["Financial Ledger", "Greedy", "State Machine", "Stripe Core"],
    description: `### Multi-Instrument Settlement Context
In global checkout, buyers often fund purchases across multiple instruments (e.g. gift cards, rewards points, credit cards).

### Problem Requirement
Given a target integer charge \`total_amount\` and an ordered list of available payment instruments \`instruments\`:
Each instrument is represented as an object: \`{"id": str, "balance": int}\`.

Instruments must be depleted in strict priority order (first in array to last).
* If the sum of all available balances is strictly less than \`total_amount\`, return an empty list \`[]\` (cannot complete charge).
* Otherwise, return a list of charge objects: \`[{"id": str, "charged": int}]\` reflecting how much was deducted from each instrument used. Only include instruments that were charged at least 1 unit.`,
    constraints: [
      "total_amount >= 1",
      "1 <= len(instruments) <= 1,000",
      "Each instrument balance >= 0",
    ],
    examples: [
      {
        input: `total_amount = 150, instruments = [{"id": "gift_card", "balance": 100}, {"id": "credit_card", "balance": 200}]`,
        output: `[{"id": "gift_card", "charged": 100}, {"id": "credit_card", "charged": 50}]`,
        explanation: "100 taken from gift card, remaining 50 charged to credit card.",
      },
    ],
    functionName: "splitTender",
    starterCode: {
      python: `from typing import List, Dict, Any

def splitTender(total_amount: int, instruments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Stripe Multi-Instrument Settlement:
    Greedily allocate total_amount across instruments in priority order.
    """
    # Write your solution below
    return []
`,
      typescript: `interface Instrument {
  id: string;
  balance: number;
}

interface ChargeAllocation {
  id: string;
  charged: number;
}

function splitTender(total_amount: number, instruments: Instrument[]): ChargeAllocation[] {
  // Write your solution below
  return [];
}
`,
      cpp: `#include <vector>
#include <string>

struct Instrument {
    std::string id;
    int balance;
};

struct ChargeAllocation {
    std::string id;
    int charged;
};

std::vector<ChargeAllocation> splitTender(int total_amount, const std::vector<Instrument>& instruments) {
    // Write your solution below
    return {};
}
`,
    },
    testCases: [
      {
        id: "stripe_st_1",
        description: "Multi-instrument full and partial depletion",
        input: `total_amount = 150, instruments = [{"id": "gift_card", "balance": 100}, {"id": "credit_card", "balance": 200}]`,
        rawInputArgs: [
          150,
          [{ id: "gift_card", balance: 100 }, { id: "credit_card", balance: 200 }],
        ],
        expected: [
          { id: "gift_card", charged: 100 },
          { id: "credit_card", charged: 50 },
        ],
      },
      {
        id: "stripe_st_2",
        description: "Insufficient total balance returns empty array",
        input: `total_amount = 300, instruments = [{"id": "store_credit", "balance": 50}]`,
        rawInputArgs: [
          300,
          [{ id: "store_credit", balance: 50 }],
        ],
        expected: [],
      },
      {
        id: "stripe_st_hidden",
        description: "Exact sum multi-source split",
        input: `[Hidden Suite: Exact multi-instrument exhaustion]`,
        rawInputArgs: [
          80,
          [{ id: "promo", balance: 50 }, { id: "debit", balance: 30 }],
        ],
        expected: [
          { id: "promo", charged: 50 },
          { id: "debit", charged: 30 },
        ],
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(K) where K is instrument count",
      space: "O(K) allocation response",
      reasoning: "Single forward pass greedily allocating min(balance, remaining).",
    },
  },
  {
    id: "oa_amazon_lru",
    title: "LRU Query Result Cache",
    companyProfile: "Amazon",
    difficulty: "Medium",
    topic: "LRU Cache & Time-Series Eviction",
    tags: ["Amazon AWS", "Doubly Linked List", "Caching", "System Performance"],
    description: `### High-Throughput Search Cache Context
At **Amazon AWS Search**, search result aggregations are cached in low-latency memory to reduce downstream Aurora / DynamoDB query volume.

### Problem Requirement
Implement an LRU cache with integer \`capacity\` responding to operations:
* \`["PUT", key, val]\`: Inserts or updates the value for \`key\`. If the number of keys exceeds \`capacity\`, evict the least recently used key.
* \`["GET", key]\`: Returns the value of \`key\` if present, or \`-1\` if not found. Accessing a key refreshes its recency.

Return an array containing the outputs of all \`GET\` operations.`,
    constraints: [
      "1 <= capacity <= 3,000",
      "1 <= operations.length <= 50,000",
      "All keys and values are non-empty strings/ints",
    ],
    examples: [
      {
        input: `capacity = 2, operations = [["PUT", "q1", 10], ["PUT", "q2", 20], ["GET", "q1"], ["PUT", "q3", 30], ["GET", "q2"], ["GET", "q3"]]`,
        output: `[10, -1, 30]`,
        explanation: "q1 is read (making q2 least recent). q3 evicts q2. GET q2 returns -1, GET q3 returns 30.",
      },
    ],
    functionName: "processQueries",
    starterCode: {
      python: `from typing import List, Any

def processQueries(capacity: int, operations: List[List[Any]]) -> List[int]:
    """
    Amazon AWS LRU Cache Assessment:
    Process sequence of PUT and GET operations under fixed LRU capacity.
    """
    # Write your solution below
    return []
`,
      typescript: `function processQueries(capacity: number, operations: any[][]): number[] {
  // Write your solution below
  return [];
}
`,
      cpp: `#include <vector>
#include <string>

std::vector<int> processQueries(int capacity, const std::vector<std::vector<std::string>>& operations) {
    // Write your solution below
    return {};
}
`,
    },
    testCases: [
      {
        id: "amz_lru_1",
        description: "Standard eviction and recency update",
        input: `capacity = 2, operations = [["PUT", "q1", 10], ["PUT", "q2", 20], ["GET", "q1"], ["PUT", "q3", 30], ["GET", "q2"], ["GET", "q3"]]`,
        rawInputArgs: [
          2,
          [["PUT", "q1", 10], ["PUT", "q2", 20], ["GET", "q1"], ["PUT", "q3", 30], ["GET", "q2"], ["GET", "q3"]],
        ],
        expected: [10, -1, 30],
      },
      {
        id: "amz_lru_2",
        description: "Single capacity rapid turnover",
        input: `capacity = 1, operations = [["PUT", "a", 1], ["GET", "a"], ["PUT", "b", 2], ["GET", "a"]]`,
        rawInputArgs: [
          1,
          [["PUT", "a", 1], ["GET", "a"], ["PUT", "b", 2], ["GET", "a"]],
        ],
        expected: [1, -1],
      },
      {
        id: "amz_lru_hidden",
        description: "Multi-element cache capacity 3",
        input: `[Hidden Suite: Capacity 3 operations]`,
        rawInputArgs: [
          3,
          [["PUT", "x", 100], ["PUT", "y", 200], ["PUT", "z", 300], ["GET", "x"], ["PUT", "w", 400], ["GET", "y"]],
        ],
        expected: [100, -1],
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(1) average per operation",
      space: "O(C) where C is capacity",
      reasoning: "Doubly linked list paired with hash table for O(1) recency eviction.",
    },
  },
  {
    id: "oa_amazon_courseorder",
    title: "Service Deployment Dependency Order",
    companyProfile: "Amazon",
    difficulty: "Medium",
    topic: "Topological Sort & Cycle Detection",
    tags: ["Amazon AWS", "Graph Theory", "Topological Sort", "Kahn's Algorithm"],
    description: `### AWS Microservices Deployment Pipeline
In continuous deployment at **AWS ECS**, microservices have strict boot dependencies. If Service B depends on Service A, Service A must be fully initialized before Service B starts.

### Problem Requirement
Given \`numServices\` (labeled from \`0\` to \`numServices - 1\`) and an array of prerequisite pairs \`dependencies\` where \`dependencies[i] = [b, a]\` indicates that service \`a\` must be booted before service \`b\`:
* Return a valid deployment sequence that satisfies all boot dependencies.
* If a deadlock cycle exists making deployment impossible, return an empty array \`[]\`.`,
    constraints: [
      "1 <= numServices <= 2,000",
      "0 <= dependencies.length <= numServices * (numServices - 1) / 2",
      "All dependency pairs are distinct",
    ],
    examples: [
      {
        input: `numServices = 4, dependencies = [[1, 0], [2, 0], [3, 1], [3, 2]]`,
        output: `[0, 1, 2, 3]`,
        explanation: "0 has no dependencies. 1 and 2 need 0. 3 needs both 1 and 2. [0, 2, 1, 3] is also valid.",
      },
      {
        input: `numServices = 2, dependencies = [[1, 0], [0, 1]]`,
        output: `[]`,
        explanation: "Circular deadlock between service 0 and service 1.",
      },
    ],
    functionName: "findDeploymentOrder",
    starterCode: {
      python: `from typing import List

def findDeploymentOrder(numServices: int, dependencies: List[List[int]]) -> List[int]:
    """
    AWS Deployment Order Assessment:
    Topologically sort service dependencies using Kahn's algorithm.
    """
    # Write your solution below
    return []
`,
      typescript: `function findDeploymentOrder(numServices: number, dependencies: number[][]): number[] {
  // Write your solution below
  return [];
}
`,
      cpp: `#include <vector>

std::vector<int> findDeploymentOrder(int numServices, const std::vector<std::vector<int>>& dependencies) {
    // Write your solution below
    return {};
}
`,
    },
    testCases: [
      {
        id: "amz_dep_1",
        description: "Valid diamond dependency graph",
        input: `numServices = 4, dependencies = [[1, 0], [2, 0], [3, 1], [3, 2]]`,
        rawInputArgs: [
          4,
          [[1, 0], [2, 0], [3, 1], [3, 2]],
        ],
        expected: [0, 1, 2, 3],
      },
      {
        id: "amz_dep_2",
        description: "Circular deadlock between 2 services",
        input: `numServices = 2, dependencies = [[1, 0], [0, 1]]`,
        rawInputArgs: [
          2,
          [[1, 0], [0, 1]],
        ],
        expected: [],
      },
      {
        id: "amz_dep_hidden",
        description: "Linear 3-node dependency chain",
        input: `[Hidden Suite: Linear chain]`,
        rawInputArgs: [
          3,
          [[1, 0], [2, 1]],
        ],
        expected: [0, 1, 2],
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(V + E)",
      space: "O(V + E)",
      reasoning: "Kahn's BFS in-degree topological sort.",
    },
  },
  {
    id: "oa_anthropic_profiling",
    title: "Consecutive Stack Sample Trace Events",
    companyProfile: "Anthropic",
    difficulty: "Hard",
    topic: "Call Stack Reconstruction & Interval Traces",
    tags: ["AI Profiling", "Stack Machine", "Trace Events", "Anthropic Systems"],
    description: `### Model Training Telemetry Context
At **Anthropic**, kernel telemetry captures discrete call stack snapshots during distributed model training. To visualize GPU kernels in Google Chrome / Perfetto Tracing, these periodic snapshots must be translated into continuous duration events.

### Problem Requirement
You are given a chronological list of \`samples\` where each sample is an object:
\`{"ts": int, "stack": string[]}\`
* \`ts\`: Timestamp of the periodic sample.
* \`stack\`: Call stack from root to top frame (e.g. \`["main", "attention_forward", "flash_attn"]\`).

Generate the ordered sequence of Chrome Trace events:
* \`["B", ts, functionName]\`: Begin event when a function enters the stack.
* \`["E", ts, functionName]\`: End event when a function exits the stack.
When functions exit, they exit top-to-bottom. When functions enter, they enter bottom-to-top.`,
    constraints: [
      "1 <= samples.length <= 10,000",
      "Timestamps are strictly increasing",
      "0 <= stack.length <= 50",
    ],
    examples: [
      {
        input: `samples = [
  {"ts": 10, "stack": ["main", "foo"]},
  {"ts": 20, "stack": ["main", "bar"]},
  {"ts": 30, "stack": ["main"]}
]`,
        output: `[["B", 10, "main"], ["B", 10, "foo"], ["E", 20, "foo"], ["B", 20, "bar"], ["E", 30, "bar"], ["E", 30, "main"]]`,
        explanation: "At t=10, main and foo begin. At t=20, foo ends and bar begins. At t=30, bar ends and execution completes.",
      },
    ],
    functionName: "convertStackSamplesToTraceEvents",
    starterCode: {
      python: `from typing import List, Dict, Any

def convertStackSamplesToTraceEvents(samples: List[Dict[str, Any]]) -> List[List[Any]]:
    """
    Anthropic Profiling Engine:
    Reconstruct function lifecycle Begin/End events from sampled stacks.
    """
    events = []
    # Write your solution below
    return events
`,
      typescript: `function convertStackSamplesToTraceEvents(samples: { ts: number; stack: string[] }[]): any[][] {
  const events: any[][] = [];
  // Write your solution below
  return events;
}
`,
      cpp: `#include <vector>
#include <string>

struct Sample {
    int ts;
    std::vector<std::string> stack;
};

std::vector<std::vector<std::string>> convertStackSamplesToTraceEvents(const std::vector<Sample>& samples) {
    // Write your solution below
    return {};
}
`,
    },
    testCases: [
      {
        id: "anthropic_trace_1",
        description: "Reconstruction of stack frame switches",
        input: `samples = [{"ts": 10, "stack": ["main", "foo"]}, {"ts": 20, "stack": ["main", "bar"]}, {"ts": 30, "stack": ["main"]}]`,
        rawInputArgs: [[
          { ts: 10, stack: ["main", "foo"] },
          { ts: 20, stack: ["main", "bar"] },
          { ts: 30, stack: ["main"] },
        ]],
        expected: [
          ["B", 10, "main"],
          ["B", 10, "foo"],
          ["E", 20, "foo"],
          ["B", 20, "bar"],
          ["E", 30, "bar"],
          ["E", 30, "main"],
        ],
      },
      {
        id: "anthropic_trace_2",
        description: "Simple single-function lifetime",
        input: `samples = [{"ts": 5, "stack": ["init"]}, {"ts": 15, "stack": []}]`,
        rawInputArgs: [[
          { ts: 5, stack: ["init"] },
          { ts: 15, stack: [] },
        ]],
        expected: [
          ["B", 5, "init"],
          ["E", 15, "init"],
        ],
      },
    ],
    optimalComplexity: {
      time: "O(S * D) where S is sample count and D is max stack depth",
      space: "O(D) auxiliary stack state",
      reasoning: "Compare common prefix between consecutive stacks to emit exit and entry transitions.",
    },
  },
  {
    id: "oa_openai_infection",
    title: "Sparse Plant Infection Simulation",
    companyProfile: "OpenAI",
    difficulty: "Hard",
    topic: "Multi-Source BFS & Coordinate Expansion",
    tags: ["Frontier AI", "BFS", "Coordinate Compression", "Simulation"],
    description: `### Bio-Simulation Context
In reinforcement learning benchmarks for physical systems at **OpenAI**, models simulate pathogen containment across large botanical agricultural grids.

### Problem Requirement
Given initial coordinates of infected plants \`initial_plants\` as a list of \`[x, y]\` integer pairs on an infinite 2D plane:
Every time unit ($T = 1, 2, \\dots$), infection spreads from every currently infected plant to its 4 orthogonal neighbors \`(x+1, y), (x-1, y), (x, y+1), (x, y-1)\`.

Calculate the total number of unique infected plants after \`time_limit\` elapsed time steps.`,
    constraints: [
      "1 <= len(initial_plants) <= 1,000",
      "-10^6 <= x, y <= 10^6",
      "0 <= time_limit <= 50",
    ],
    examples: [
      {
        input: `initial_plants = [[0, 0]], time_limit = 1`,
        output: `5`,
        explanation: "At T=0: (0,0). At T=1: (0,0) plus (1,0), (-1,0), (0,1), (0,-1) = 5 plants.",
      },
    ],
    functionName: "simulateInfection",
    starterCode: {
      python: `from typing import List

def simulateInfection(initial_plants: List[List[int]], time_limit: int) -> int:
    """
    OpenAI Multi-Agent Simulation:
    Compute total infected grid coordinates after time_limit iterations.
    """
    # Write your solution below
    return 0
`,
      typescript: `function simulateInfection(initial_plants: number[][], time_limit: number): number {
  // Write your solution below
  return 0;
}
`,
      cpp: `#include <vector>

int simulateInfection(const std::vector<std::vector<int>>& initial_plants, int time_limit) {
    // Write your solution below
    return 0;
}
`,
    },
    testCases: [
      {
        id: "openai_inf_1",
        description: "Single seed radius 1 expansion",
        input: `initial_plants = [[0, 0]], time_limit = 1`,
        rawInputArgs: [
          [[0, 0]],
          1,
        ],
        expected: 5,
      },
      {
        id: "openai_inf_2",
        description: "Zero elapsed time base case",
        input: `initial_plants = [[0, 0], [1, 0]], time_limit = 0`,
        rawInputArgs: [
          [[0, 0], [1, 0]],
          0,
        ],
        expected: 2,
      },
      {
        id: "openai_inf_hidden",
        description: "Single seed radius 2 expansion",
        input: `[Hidden Suite: Radius 2 expansion]`,
        rawInputArgs: [
          [[0, 0]],
          2,
        ],
        expected: 13,
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(K * T^2) or BFS queue bounded by frontier",
      space: "O(K * T^2) visited coordinates set",
      reasoning: "Multi-source level-order BFS tracking visited set on 2D coordinates.",
    },
  },
  {
    id: "oa_waymo_obstacle",
    title: "Obstacle-Aware Return to Origin",
    companyProfile: "Waymo",
    difficulty: "Medium",
    topic: "Trajectory Kinematics & Collision Checks",
    tags: ["Waymo Robotics", "Trajectory Simulation", "Autonomous Vehicles", "Geometry"],
    description: `### Autonomous Navigation Safe Return Context
At **Waymo Driver**, an autonomous vehicle in a depot follows a programmed testing path consisting of cardinal movements (\`'U'\`, \`'D'\`, \`'L'\`, \`'R'\`).

### Problem Requirement
The vehicle starts at coordinate \`(0, 0)\` at time step 0.
You are given a command string \`moves\` and a list of obstacle coordinates \`obstacles\` (\`[x, y]\`).
* In each step, the vehicle executes the move:
  - \`'U'\`: \`y += 1\`
  - \`'D'\`: \`y -= 1\`
  - \`'L'\`: \`x -= 1\`
  - \`'R'\`: \`x += 1\`
* If the vehicle steps on ANY obstacle coordinate at any point along the path, it halts and reports \`false\`.
* If it completes all moves without collision and finishes exactly at the origin \`(0, 0)\`, return \`true\`. Otherwise return \`false\`.`,
    constraints: [
      "1 <= moves.length <= 50,000",
      "moves contains only 'U', 'D', 'L', 'R'",
      "0 <= obstacles.length <= 10,000",
      "Origin (0,0) will never contain an obstacle",
    ],
    examples: [
      {
        input: `moves = "UDLR", obstacles = [[5, 5]]`,
        output: `true`,
        explanation: "Vehicle moves (0,0)->(0,1)->(0,0)->(-1,0)->(0,0). Never hits obstacle, returns to (0,0).",
      },
      {
        input: `moves = "UURRDDLL", obstacles = [[1, 1]]`,
        output: `false`,
        explanation: "Vehicle passes through (1,1) during its perimeter loop and encounters an obstacle.",
      },
    ],
    functionName: "canReturnToOrigin",
    starterCode: {
      python: `from typing import List

def canReturnToOrigin(moves: str, obstacles: List[List[int]]) -> bool:
    """
    Waymo Trajectory Simulation:
    Verify vehicle executes path without collision and terminates at origin (0,0).
    """
    # Write your solution below
    return False
`,
      typescript: `function canReturnToOrigin(moves: string, obstacles: number[][]): boolean {
  // Write your solution below
  return false;
}
`,
      cpp: `#include <string>
#include <vector>

bool canReturnToOrigin(const std::string& moves, const std::vector<std::vector<int>>& obstacles) {
    // Write your solution below
    return false;
}
`,
    },
    testCases: [
      {
        id: "waymo_rt_1",
        description: "Clear path returning to origin",
        input: `moves = "UDLR", obstacles = [[5, 5]]`,
        rawInputArgs: [
          "UDLR",
          [[5, 5]],
        ],
        expected: true,
      },
      {
        id: "waymo_rt_2",
        description: "Path intersects obstacle",
        input: `moves = "UURRDDLL", obstacles = [[1, 1]]`,
        rawInputArgs: [
          "UURRDDLL",
          [[1, 1]],
        ],
        expected: false,
      },
      {
        id: "waymo_rt_hidden",
        description: "Path does not return to origin",
        input: `[Hidden Suite: Open-ended trajectory]`,
        rawInputArgs: [
          "UUU",
          [],
        ],
        expected: false,
        isHidden: true,
      },
    ],
    optimalComplexity: {
      time: "O(M + O) where M is moves length and O is obstacles count",
      space: "O(O) obstacle coordinate hash set",
      reasoning: "Store obstacles in a set for O(1) collision checks at each step.",
    },
  },
];

// Presets matching HackerRank, CodeSignal, and Karat multi-question specifications
export const OA_TRACKS: OACompanyTrack[] = [
  {
    id: "stripe-payments-swe",
    companyProfile: "Stripe",
    title: "Stripe Core Engineering Assessment",
    subtitle: "Real-Time Fraud Rules & Multi-Instrument Settlement",
    description: "Evaluated against Stripe Core Systems hiring bar. Implements streaming transaction risk filters and greedy multi-instrument ledger settlement.",
    totalTimeSeconds: 4500, // 75 minutes
    problemIds: ["oa_stripe_fraud", "oa_stripe_splittender"],
    problemWeights: {
      oa_stripe_fraud: 50,
      oa_stripe_splittender: 50,
    },
    tags: ["Stripe Radar", "Ledger Accounting", "Rule Engine", "Fintech"],
  },
  {
    id: "amazon-aws-systems",
    companyProfile: "Amazon",
    title: "Amazon AWS Cloud Platform",
    subtitle: "Query Result Caching & Service Dependency Scheduling",
    description: "Screening modeled after AWS SDE II infrastructure evaluations. Focuses on low-latency LRU eviction and cycle-free topological service boot orders.",
    totalTimeSeconds: 4200, // 70 minutes
    problemIds: ["oa_amazon_lru", "oa_amazon_courseorder"],
    problemWeights: {
      oa_amazon_lru: 50,
      oa_amazon_courseorder: 50,
    },
    tags: ["AWS SDE", "LRU Cache", "Topological Sort", "Distributed Systems"],
  },
  {
    id: "frontier-ai-anthropic-openai",
    companyProfile: "Anthropic",
    title: "Frontier AI Systems (Anthropic & OpenAI)",
    subtitle: "Kernel Profiling & Large-Scale Coordinate Simulation",
    description: "Evaluated against Frontier AI research engineering benchmarks. Reconstructs trace intervals from discrete stack telemetry and simulates sparse spatial automata.",
    totalTimeSeconds: 4800, // 80 minutes
    problemIds: ["oa_anthropic_profiling", "oa_openai_infection"],
    problemWeights: {
      oa_anthropic_profiling: 55,
      oa_openai_infection: 45,
    },
    tags: ["Frontier AI", "Trace Profiler", "BFS", "Perfetto Events"],
  },
  {
    id: "waymo-robotics-planning",
    companyProfile: "Waymo",
    title: "Waymo Autonomous Systems",
    subtitle: "Trajectory Kinematics & Sliding Window Throttling",
    description: "Screening modeled after Waymo Driver autonomy standards. Tests collision-free kinematic return paths and high-throughput sliding window rate limiting.",
    totalTimeSeconds: 4500, // 75 minutes
    problemIds: ["oa_waymo_obstacle", "oa_google_ratelimit"],
    problemWeights: {
      oa_waymo_obstacle: 50,
      oa_google_ratelimit: 50,
    },
    tags: ["Waymo Driver", "Robotics", "Collision Checks", "Kinematics"],
  },
  {
    id: "citadel-quant-swe",
    companyProfile: "Citadel",
    title: "Citadel Quantitative SWE",
    subtitle: "Low-Latency Systems & High-Frequency Streaming Depth",
    description: "Multi-problem assessment evaluated against Citadel Execution Services hiring criteria. Problems span microsecond rate limiting, lock-free IPC ring buffers, and streaming order book depth aggregation.",
    totalTimeSeconds: 4500, // 75 minutes
    problemIds: ["oa_google_ratelimit", "oa_citadel_ringbuffer", "oa_citadel_orderbook"],
    problemWeights: {
      oa_google_ratelimit: 25,
      oa_citadel_ringbuffer: 35,
      oa_citadel_orderbook: 40,
    },
    tags: ["High-Frequency Trading", "C++ / Python", "Streaming", "Concurrency"],
  },
  {
    id: "google-core-screener",
    companyProfile: "Google",
    title: "Google Core Screener",
    subtitle: "Distributed Infrastructure & Network Resilience",
    description: "Evaluates production-grade distributed algorithms under Google Cloud SLAs. Features sliding-window traffic shaping and graph bridge identification under strict asymptotic boundaries.",
    totalTimeSeconds: 4500, // 75 minutes
    problemIds: ["oa_google_ratelimit", "oa_meta_bridge"],
    problemWeights: {
      oa_google_ratelimit: 45,
      oa_meta_bridge: 55,
    },
    tags: ["Google Cloud", "Distributed Systems", "Graph Algorithms"],
  },
  {
    id: "zurich-fintech-hf",
    companyProfile: "Fintech",
    title: "Zurich Quant & FinTech",
    subtitle: "Alpha Signals, FX Arbitrage & Price Limits",
    description: "Tier-1 Quantitative Desk screening focusing on streaming data filters, high-throughput order book depth, and negative-weight arbitrage graph cycles.",
    totalTimeSeconds: 4800, // 80 minutes
    problemIds: ["oa_twosigma_median", "oa_citadel_orderbook", "oa_fintech_arbitrage"],
    problemWeights: {
      oa_twosigma_median: 30,
      oa_citadel_orderbook: 35,
      oa_fintech_arbitrage: 35,
    },
    tags: ["Arbitrage", "Running Medians", "Market Microstructure"],
  },
  {
    id: "meta-infra-screening",
    companyProfile: "Meta",
    title: "Meta Infrastructure OA",
    subtitle: "Global Scale Topologies & Fault Tolerance",
    description: "Engineering assessment testing resilient topology algorithms and ingress throttling used across Meta datacenter backbones.",
    totalTimeSeconds: 4200, // 70 minutes
    problemIds: ["oa_google_ratelimit", "oa_meta_bridge"],
    problemWeights: {
      oa_google_ratelimit: 40,
      oa_meta_bridge: 60,
    },
    tags: ["Graph Theory", "Tarjan Bridges", "Traffic Metering"],
  },
  {
    id: "twosigma-alpha-quant",
    companyProfile: "Two Sigma",
    title: "Two Sigma Alpha Research",
    subtitle: "Dual-Heap Streaming & Continuous Order Books",
    description: "Assessment designed for quantitative researchers and alpha modelers analyzing live tick feeds without statistical skew.",
    totalTimeSeconds: 4500, // 75 minutes
    problemIds: ["oa_twosigma_median", "oa_citadel_orderbook"],
    problemWeights: {
      oa_twosigma_median: 40,
      oa_citadel_orderbook: 60,
    },
    tags: ["Dual Heaps", "Alpha Modeling", "Rolling Windows"],
  },
];

