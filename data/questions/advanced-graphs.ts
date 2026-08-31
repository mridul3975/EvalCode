import { QuestionItem } from "@/types/question";

export const ADVANCED_GRAPHS_QUESTIONS: QuestionItem[] = [
  {
    id: "q_adv_743",
    title: "Network Delay Time — Dijkstra's Algorithm (LeetCode 743)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "You are given a network of `n` nodes, labeled from 1 to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = (u_i, v_i, w_i)`. Return the minimum time it takes for all the `n` nodes to receive the signal from starting node `k`. If it is impossible, return `-1`.",
      constraints: ["1 <= k <= n <= 100", "1 <= times.length <= 6000", "1 <= u_i, v_i <= n", "0 <= w_i <= 100"],
      examples: [
        {
          input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
          output: "2"
        }
      ]
    },
    ai_response: {
      code: `import heapq\nfrom collections import defaultdict\n\ndef networkDelayTime(times, n, k):\n    adj = defaultdict(list)\n    for u, v, w in times:\n        adj[u].append((v, w))\n        \n    min_heap = [(0, k)]\n    distances = {}\n    \n    while min_heap:\n        w1, n1 = heapq.heappop(min_heap)\n        if n1 in distances:\n            continue\n        distances[n1] = w1\n        \n        for n2, w2 in adj[n1]:\n            if n2 not in distances:\n                heapq.heappush(min_heap, (w1 + w2, n2))\n                \n    return max(distances.values()) if len(distances) == n else -1`,
      stated_explanation: "Dijkstra's shortest path algorithm using a min-heap. Returns max distance among all reached nodes if all n nodes are reachable.",
      stated_time_complexity: "O(E log V)",
      stated_space_complexity: "O(V + E)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(E log V)",
        space: "O(V + E)",
        reasoning: "Classic Dijkstra with priority queue."
      },
      corrected_code: `import heapq\nfrom collections import defaultdict\ndef networkDelayTime(times, n, k):\n    adj = defaultdict(list)\n    for u, v, w in times: adj[u].append((v, w))\n    min_heap = [(0, k)]\n    distances = {\n    while min_heap:\n        w1, n1 = heapq.heappop(min_heap)\n        if n1 in distances: continue\n        distances[n1] = w1\n        for n2, w2 in adj[n1]:\n            if n2 not in distances:\n                heapq.heappush(min_heap, (w1 + w2, n2))\n    return max(distances.values()) if len(distances) == n else -1`,
      model_critique_summary: "Optimal, completely correct Dijkstra implementation."
    },
    language_variants: {
      cpp: {
        code: `import heapq\nfrom collections import defaultdict\n\nauto networkDelayTime(times, n, k) {\n    adj = defaultdict(list)\n    for u, v, w in times:\n        adj[u].push_back((v, w))\n        \n    min_heap = [(0, k)]\n    distances = {}\n    \n    while min_heap:\n        w1, n1 = heapq.heappop(min_heap)\n        if n1 in distances:\n            continue\n        distances[n1] = w1\n        \n        for n2, w2 in adj[n1]:\n            if n2 ! in distances:\n                heapq.heappush(min_heap, (w1 + w2, n2))\n                \n    return max(distances.values()) if distances.size() == n else -1`,
        corrected_code: `import heapq\nfrom collections import defaultdict\nauto networkDelayTime(times, n, k) {\n    adj = defaultdict(list)\n    for u, v, w in times: adj[u].push_back((v, w))\n    min_heap = [(0, k)]\n    distances = {\n    while min_heap:\n        w1, n1 = heapq.heappop(min_heap)\n        if n1 in distances: continue\n        distances[n1] = w1\n        for n2, w2 in adj[n1]:\n            if n2 ! in distances:\n                heapq.heappush(min_heap, (w1 + w2, n2))\n    return max(distances.values()) if distances.size() == n else -1`,
      },
      javascript: {
        code: `import heapq\nfrom collections import defaultdict\n\nvar networkDelayTime = function(times, n, k) {\n    adj = defaultdict(list)\n    for u, v, w in times:\n        adj[u].push((v, w))\n        \n    min_heap = [(0, k)]\n    distances = {}\n    \n    while min_heap:\n        w1, n1 = heapq.heappop(min_heap)\n        if n1 in distances:\n            continue\n        distances[n1] = w1\n        \n        for n2, w2 in adj[n1]:\n            if n2 ! in distances:\n                heapq.heappush(min_heap, (w1 + w2, n2))\n                \n    return max(distances.values()) if distances.length == n else -1`,
        corrected_code: `import heapq\nfrom collections import defaultdict\nvar networkDelayTime = function(times, n, k) {\n    adj = defaultdict(list)\n    for u, v, w in times: adj[u].push((v, w))\n    min_heap = [(0, k)]\n    distances = {\n    while min_heap:\n        w1, n1 = heapq.heappop(min_heap)\n        if n1 in distances: continue\n        distances[n1] = w1\n        for n2, w2 in adj[n1]:\n            if n2 ! in distances:\n                heapq.heappush(min_heap, (w1 + w2, n2))\n    return max(distances.values()) if distances.length == n else -1`,
      },
    }
  },

  {
    id: "q_adv_1584",
    title: "Min Cost to Connect All Points — Prim's Algorithm (LeetCode 1584)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "You are given an array `points` representing integer coordinates of some points on a 2D-plane. Return the minimum cost to make all points connected using Manhattan distance.",
      constraints: ["1 <= points.length <= 1000", "-10^6 <= x_i, y_i <= 10^6"],
      examples: [
        {
          input: "points = [[0,0],[2,2],[3,10],[5,2],[7,0]]",
          output: "20"
        }
      ]
    },
    ai_response: {
      code: `import heapq\n\ndef minCostConnectPoints(points):\n    n = len(points)\n    visited = set()\n    min_heap = [(0, 0)] # (cost, point_index)\n    total_cost = 0\n    \n    while len(visited) < n:\n        cost, u = heapq.heappop(min_heap)\n        if u in visited:\n            continue\n        visited.add(u)\n        total_cost += cost\n        \n        for v in range(n):\n            if v not in visited:\n                dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])\n                heapq.heappush(min_heap, (dist, v))\n                \n    return total_cost`,
      stated_explanation: "Prim's Minimum Spanning Tree algorithm using min-heap and Manhattan distance edge expansion.",
      stated_time_complexity: "O(n^2 log n)",
      stated_space_complexity: "O(n^2)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n^2)",
        space: "O(n)",
        reasoning: "Prim's MST algorithm."
      },
      corrected_code: `import heapq\ndef minCostConnectPoints(points):\n    n = len(points)\n    visited = set()\n    min_heap = [(0, 0)]\n    total_cost = 0\n    while len(visited) < n:\n        cost, u = heapq.heappop(min_heap)\n        if u in visited: continue\n        visited.add(u)\n        total_cost += cost\n        for v in range(n):\n            if v not in visited:\n                dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])\n                heapq.heappush(min_heap, (dist, v))\n    return total_cost`,
      model_critique_summary: "Optimal, completely correct Prim's MST implementation."
    },
    language_variants: {
      cpp: {
        code: `import heapq\n\nauto minCostConnectPoints(points) {\n    n = points.size()\n    visited = set()\n    min_heap = [(0, 0)] // (cost, point_index)\n    total_cost = 0\n    \n    while visited.size() < n:\n        cost, u = heapq.heappop(min_heap)\n        if u in visited:\n            continue\n        visited.add(u)\n        total_cost += cost\n        \n        for v in range(n):\n            if v ! in visited:\n                dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])\n                heapq.heappush(min_heap, (dist, v))\n                \n    return total_cost`,
        corrected_code: `import heapq\nauto minCostConnectPoints(points) {\n    n = points.size()\n    visited = set()\n    min_heap = [(0, 0)]\n    total_cost = 0\n    while visited.size() < n:\n        cost, u = heapq.heappop(min_heap)\n        if u in visited: continue\n        visited.add(u)\n        total_cost += cost\n        for v in range(n):\n            if v ! in visited:\n                dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])\n                heapq.heappush(min_heap, (dist, v))\n    return total_cost`,
      },
      javascript: {
        code: `import heapq\n\nvar minCostConnectPoints = function(points) {\n    n = points.length\n    visited = set()\n    min_heap = [(0, 0)] // (cost, point_index)\n    total_cost = 0\n    \n    while visited.length < n:\n        cost, u = heapq.heappop(min_heap)\n        if u in visited:\n            continue\n        visited.add(u)\n        total_cost += cost\n        \n        for v in range(n):\n            if v ! in visited:\n                dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])\n                heapq.heappush(min_heap, (dist, v))\n                \n    return total_cost`,
        corrected_code: `import heapq\nvar minCostConnectPoints = function(points) {\n    n = points.length\n    visited = set()\n    min_heap = [(0, 0)]\n    total_cost = 0\n    while visited.length < n:\n        cost, u = heapq.heappop(min_heap)\n        if u in visited: continue\n        visited.add(u)\n        total_cost += cost\n        for v in range(n):\n            if v ! in visited:\n                dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])\n                heapq.heappush(min_heap, (dist, v))\n    return total_cost`,
      },
    }
  },

  {
    id: "q_adv_684",
    title: "Redundant Connection — Union-Find (LeetCode 684)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Return an edge that can be removed so that the resulting graph is a tree of `n` nodes. If multiple answers exist, return the last edge in input.",
      constraints: ["n == edges.length", "3 <= n <= 1000"],
      examples: [
        {
          input: "edges = [[1,2],[1,3],[2,3]]",
          output: "[2,3]"
        }
      ]
    },
    ai_response: {
      code: `def findRedundantConnection(edges):\n    parent = [i for i in range(len(edges) + 1)]\n    \n    def find(n):\n        p = parent[n]\n        while p != parent[p]:\n            parent[p] = parent[parent[p]] # path compression\n            p = parent[p]\n        return p\n        \n    def union(n1, n2):\n        p1, p2 = find(n1), find(n2)\n        if p1 == p2:\n            return False # Cycle detected!\n        parent[p1] = p2\n        return True\n        \n    for u, v in edges:\n        if not union(u, v):\n            return [u, v]`,
      stated_explanation: "Disjoint Set Union (DSU) with path compression. Detects first edge connecting already-unified components.",
      stated_time_complexity: "O(n * alpha(n))",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n * alpha(n))",
        space: "O(n)",
        reasoning: "Union Find with path compression and rank."
      },
      corrected_code: `def findRedundantConnection(edges):\n    parent = [i for i in range(len(edges) + 1)]\n    def find(n):\n        p = parent[n]\n        while p != parent[p]:\n            parent[p] = parent[parent[p]]\n            p = parent[p]\n        return p\n    def union(n1, n2):\n        p1, p2 = find(n1), find(n2)\n        if p1 == p2: return False\n        parent[p1] = p2\n        return True\n    for u, v in edges:\n        if not union(u, v): return [u, v]`,
      model_critique_summary: "Optimal, completely correct Union-Find cycle detection."
    },
    language_variants: {
      cpp: {
        code: `auto findRedundantConnection(edges) {\n    parent = [i for i in range(edges.size() + 1)]\n    \n    def find(n):\n        p = parent[n]\n        while p != parent[p]:\n            parent[p] = parent[parent[p]] // path compression\n            p = parent[p]\n        return p\n        \n    def union(n1, n2):\n        p1, p2 = find(n1), find(n2)\n        if p1 == p2:\n            return false # Cycle detected!\n        parent[p1] = p2\n        return true\n        \n    for u, v in edges:\n        if ! union(u, v):\n            return [u, v]`,
        corrected_code: `auto findRedundantConnection(edges) {\n    parent = [i for i in range(edges.size() + 1)]\n    def find(n):\n        p = parent[n]\n        while p != parent[p]:\n            parent[p] = parent[parent[p]]\n            p = parent[p]\n        return p\n    def union(n1, n2):\n        p1, p2 = find(n1), find(n2)\n        if p1 == p2: return false\n        parent[p1] = p2\n        return true\n    for u, v in edges:\n        if ! union(u, v): return [u, v]`,
      },
      javascript: {
        code: `var findRedundantConnection = function(edges) {\n    parent = [i for i in range(edges.length + 1)]\n    \n    def find(n):\n        p = parent[n]\n        while p != parent[p]:\n            parent[p] = parent[parent[p]] // path compression\n            p = parent[p]\n        return p\n        \n    def union(n1, n2):\n        p1, p2 = find(n1), find(n2)\n        if p1 == p2:\n            return false # Cycle detected!\n        parent[p1] = p2\n        return true\n        \n    for u, v in edges:\n        if ! union(u, v):\n            return [u, v]`,
        corrected_code: `var findRedundantConnection = function(edges) {\n    parent = [i for i in range(edges.length + 1)]\n    def find(n):\n        p = parent[n]\n        while p != parent[p]:\n            parent[p] = parent[parent[p]]\n            p = parent[p]\n        return p\n    def union(n1, n2):\n        p1, p2 = find(n1), find(n2)\n        if p1 == p2: return false\n        parent[p1] = p2\n        return true\n    for u, v in edges:\n        if ! union(u, v): return [u, v]`,
      },
    }
  },

  {
    id: "q_adv_787",
    title: "Cheapest Flights Within K Stops — Bellman-Ford (LeetCode 787)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "There are `n` cities connected by some number of flights. Find the cheapest price from `src` to `dst` with at most `k` stops.",
      constraints: ["1 <= n <= 100", "0 <= flights.length <= (n * (n - 1) / 2)", "0 <= k <= n - 1"],
      examples: [
        {
          input: "n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1",
          output: "700"
        }
      ]
    },
    ai_response: {
      code: `def findCheapestPrice(n, flights, src, dst, k):\n    prices = [float('inf')] * n\n    prices[src] = 0\n    \n    # Bug: mutates prices in-place without snapshotting, allowing > 1 edge traversal per step\n    for _ in range(k + 1):\n        for u, v, w in flights:\n            if prices[u] == float('inf'):\n                continue\n            if prices[u] + w < prices[v]:\n                prices[v] = prices[u] + w\n                \n    return prices[dst] if prices[dst] != float('inf') else -1`,
      stated_explanation: "Runs Bellman-Ford for k + 1 iterations.",
      stated_time_complexity: "O(k * E)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_adv_787_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [10],
          description: "Mutating distances in-place during Bellman-Ford: Updates `prices[v]` directly without creating a `tmpPrices = prices.copy()` snapshot. A single iteration can cascade updates across multiple hops, violating the strict `k` stops restriction.",
          failing_input_example: "flights = [[0,1,100],[1,2,100],[2,3,100]], src = 0, dst = 3, k = 0 (reaches dst with 2 stops instead of returning -1)",
          why_it_matters: "K-step Bellman-Ford strictly requires snapshotting the previous iteration's distances."
        }
      ],
      optimal_complexity: {
        time: "O(k * E)",
        space: "O(n)",
        reasoning: "k + 1 relaxation passes with snapshot copy."
      },
      corrected_code: `def findCheapestPrice(n, flights, src, dst, k):\n    prices = [float('inf')] * n\n    prices[src] = 0\n    for _ in range(k + 1):\n        tmpPrices = prices.copy()\n        for u, v, w in flights:\n            if prices[u] == float('inf'): continue\n            if prices[u] + w < tmpPrices[v]:\n                tmpPrices[v] = prices[u] + w\n        prices = tmpPrices\n    return prices[dst] if prices[dst] != float('inf') else -1`,
      model_critique_summary: "Updated distances in-place violating k stops limit."
    },
    language_variants: {
      cpp: {
        code: `auto findCheapestPrice(n, flights, src, dst, k) {\n    prices = [float('inf')] * n\n    prices[src] = 0\n    \n    // Bug: mutates prices in-place without snapshotting, allowing > 1 edge traversal per step\n    for _ in range(k + 1):\n        for u, v, w in flights:\n            if prices[u] == float('inf'):\n                continue\n            if prices[u] + w < prices[v]:\n                prices[v] = prices[u] + w\n                \n    return prices[dst] if prices[dst] != float('inf') else -1`,
        corrected_code: `auto findCheapestPrice(n, flights, src, dst, k) {\n    prices = [float('inf')] * n\n    prices[src] = 0\n    for _ in range(k + 1):\n        tmpPrices = prices.copy()\n        for u, v, w in flights:\n            if prices[u] == float('inf'): continue\n            if prices[u] + w < tmpPrices[v]:\n                tmpPrices[v] = prices[u] + w\n        prices = tmpPrices\n    return prices[dst] if prices[dst] != float('inf') else -1`,
      },
      javascript: {
        code: `var findCheapestPrice = function(n, flights, src, dst, k) {\n    prices = [float('inf')] * n\n    prices[src] = 0\n    \n    // Bug: mutates prices in-place without snapshotting, allowing > 1 edge traversal per step\n    for _ in range(k + 1):\n        for u, v, w in flights:\n            if prices[u] == float('inf'):\n                continue\n            if prices[u] + w < prices[v]:\n                prices[v] = prices[u] + w\n                \n    return prices[dst] if prices[dst] != float('inf') else -1`,
        corrected_code: `var findCheapestPrice = function(n, flights, src, dst, k) {\n    prices = [float('inf')] * n\n    prices[src] = 0\n    for _ in range(k + 1):\n        tmpPrices = prices.copy()\n        for u, v, w in flights:\n            if prices[u] == float('inf'): continue\n            if prices[u] + w < tmpPrices[v]:\n                tmpPrices[v] = prices[u] + w\n        prices = tmpPrices\n    return prices[dst] if prices[dst] != float('inf') else -1`,
      },
    }
  }
];
