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
];

// Presets matching HackerRank, CodeSignal, and Karat multi-question specifications
export const OA_TRACKS: OACompanyTrack[] = [
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

