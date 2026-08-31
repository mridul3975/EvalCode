import { QuestionItem } from "@/types/question";

export const GRAPH_QUESTIONS: QuestionItem[] = [
  {
    id: "q_graph_scratch",
    title: "Graph Representation & BFS Traversal from Scratch (Python)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given `n` vertices and a list of undirected `edges`, construct an adjacency list and return the BFS traversal starting from node `0`.",
      constraints: ["1 <= n <= 1000", "0 <= edges.length <= 5000"],
      examples: [
        {
          input: "n = 4, edges = [[0,1],[0,2],[1,3]]",
          output: "[0, 1, 2, 3]"
        }
      ]
    },
    ai_response: {
      code: `from collections import deque, defaultdict\n\ndef bfsGraph(n, edges):\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n        \n    visited = set()\n    queue = deque([0])\n    res = []\n    \n    while queue:\n        # Bug: marks visited when popped from queue instead of when pushed!\n        node = queue.popleft()\n        visited.add(node)\n        res.append(node)\n        \n        for neighbor in adj[node]:\n            if neighbor not in visited:\n                queue.append(neighbor)\n                \n    return res`,
      stated_explanation: "Constructs adjacency list and performs BFS using deque.",
      stated_time_complexity: "O(V + E)",
      stated_space_complexity: "O(V + E)"
    },
    ground_truth: {
      verdict: "minor_issue",
      defect_type: "complexity_regression",
      error_categories: ["complexity_regression"],
      expected_issues: [
        {
          id: "iss_graph_bfs_01",
          severity: "major",
          dimension: "complexity",
          line_numbers: [14, 18],
          description: "Duplicate queue insertion complexity regression: Marking nodes as visited *after* popping from queue instead of *at the moment of queue enqueue* causes nodes with multiple in-neighbors to be pushed onto the queue exponentially many times.",
          failing_input_example: "Dense graph where nodes have many common neighbors.",
          why_it_matters: "In BFS, `visited.add(neighbor)` must occur when enqueuing to prevent redundant queue allocations and quadratic time blowup."
        }
      ],
      optimal_complexity: {
        time: "O(V + E)",
        space: "O(V + E)",
        reasoning: "Each node and edge visited exactly once."
      },
      corrected_code: `from collections import deque, defaultdict\ndef bfsGraph(n, edges):\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].append(v)\n        adj[v].append(u)\n    visited = {0\n    queue = deque([0])\n    res = []\n    while queue:\n        node = queue.popleft()\n        res.append(node)\n        for neighbor in adj[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return res`,
      model_critique_summary: "Marked visited on dequeue instead of enqueue."
    },
    language_variants: {
      cpp: {
        code: `from collections import deque, defaultdict\n\nauto bfsGraph(n, edges) {\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].push_back(v)\n        adj[v].push_back(u)\n        \n    visited = set()\n    queue = deque([0])\n    res = []\n    \n    while queue:\n        // Bug: marks visited when popped from queue instead of when pushed!\n        node = queue.popleft()\n        visited.add(node)\n        res.push_back(node)\n        \n        for neighbor in adj[node]:\n            if neighbor ! in visited:\n                queue.push_back(neighbor)\n                \n    return res`,
        corrected_code: `from collections import deque, defaultdict\nauto bfsGraph(n, edges) {\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].push_back(v)\n        adj[v].push_back(u)\n    visited = {0\n    queue = deque([0])\n    res = []\n    while queue:\n        node = queue.popleft()\n        res.push_back(node)\n        for neighbor in adj[node]:\n            if neighbor ! in visited:\n                visited.add(neighbor)\n                queue.push_back(neighbor)\n    return res`,
      },
      javascript: {
        code: `from collections import deque, defaultdict\n\nvar bfsGraph = function(n, edges) {\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].push(v)\n        adj[v].push(u)\n        \n    visited = set()\n    queue = deque([0])\n    res = []\n    \n    while queue:\n        // Bug: marks visited when popped from queue instead of when pushed!\n        node = queue.popleft()\n        visited.add(node)\n        res.push(node)\n        \n        for neighbor in adj[node]:\n            if neighbor ! in visited:\n                queue.push(neighbor)\n                \n    return res`,
        corrected_code: `from collections import deque, defaultdict\nvar bfsGraph = function(n, edges) {\n    adj = defaultdict(list)\n    for u, v in edges:\n        adj[u].push(v)\n        adj[v].push(u)\n    visited = {0\n    queue = deque([0])\n    res = []\n    while queue:\n        node = queue.popleft()\n        res.push(node)\n        for neighbor in adj[node]:\n            if neighbor ! in visited:\n                visited.add(neighbor)\n                queue.push(neighbor)\n    return res`,
      },
    }
  },

  {
    id: "q_graph_133",
    title: "Clone Graph (LeetCode 133)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
      constraints: ["0 <= Node Count <= 100", "1 <= Node.val <= 100"],
      examples: [
        {
          input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
          output: "[[2,4],[1,3],[2,4],[1,3]]"
        }
      ]
    },
    ai_response: {
      code: `class Node:\n    def __init__(self, val = 0, neighbors = None):\n        self.val = val\n        self.neighbors = neighbors if neighbors is not None else []\n\ndef cloneGraph(node):\n    if not node: return None\n    cloned = {}\n    def dfs(curr):\n        if curr in cloned:\n            return cloned[curr]\n        copy = Node(curr.val)\n        cloned[curr] = copy\n        for nxt in curr.neighbors:\n            copy.neighbors.append(dfs(nxt))\n        return copy\n    return dfs(node)`,
      stated_explanation: "Uses DFS and a hash map `cloned` mapping original nodes to new cloned nodes to handle cycles and deep copy all neighbors.",
      stated_time_complexity: "O(V + E)",
      stated_space_complexity: "O(V)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(V + E)",
        space: "O(V)",
        reasoning: "DFS with memoization table for visited nodes."
      },
      corrected_code: `def cloneGraph(node):\n    if not node: return None\n    cloned = {\n    def dfs(curr):\n        if curr in cloned: return cloned[curr]\n        copy = Node(curr.val)\n        cloned[curr] = copy\n        for nxt in curr.neighbors:\n            copy.neighbors.append(dfs(nxt))\n        return copy\n    return dfs(node)`,
      model_critique_summary: "Optimal, completely correct recursive graph cloning."
    },
    language_variants: {
      cpp: {
        code: `class Node:\n    auto __init__(val = 0, neighbors = nullptr) {\n        this->val = val\n        this->neighbors = neighbors if neighbors is ! nullptr else []\n\ndef cloneGraph(node):\n    if ! node: return nullptr\n    cloned = {}\n    def dfs(curr):\n        if curr in cloned:\n            return cloned[curr]\n        copy = Node(curr.val)\n        cloned[curr] = copy\n        for nxt in curr.neighbors:\n            copy.neighbors.push_back(dfs(nxt))\n        return copy\n    return dfs(node)`,
        corrected_code: `auto cloneGraph(node) {\n    if ! node: return nullptr\n    cloned = {\n    def dfs(curr):\n        if curr in cloned: return cloned[curr]\n        copy = Node(curr.val)\n        cloned[curr] = copy\n        for nxt in curr.neighbors:\n            copy.neighbors.push_back(dfs(nxt))\n        return copy\n    return dfs(node)`,
      },
      javascript: {
        code: `class Node:\n    var __init__ = function(val = 0, neighbors = null) {\n        this.val = val\n        this.neighbors = neighbors if neighbors is ! null else []\n\ndef cloneGraph(node):\n    if ! node: return null\n    cloned = {}\n    def dfs(curr):\n        if curr in cloned:\n            return cloned[curr]\n        copy = Node(curr.val)\n        cloned[curr] = copy\n        for nxt in curr.neighbors:\n            copy.neighbors.push(dfs(nxt))\n        return copy\n    return dfs(node)`,
        corrected_code: `var cloneGraph = function(node) {\n    if ! node: return null\n    cloned = {\n    def dfs(curr):\n        if curr in cloned: return cloned[curr]\n        copy = Node(curr.val)\n        cloned[curr] = copy\n        for nxt in curr.neighbors:\n            copy.neighbors.push(dfs(nxt))\n        return copy\n    return dfs(node)`,
      },
    }
  },

  {
    id: "q_graph_733",
    title: "Flood Fill (LeetCode 733)",
    topic: "graphs",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "An image is represented by an `m x n` integer grid `image`. Perform a flood fill starting from pixel `image[sr][sc]` with `color`.",
      constraints: ["1 <= m, n <= 50", "0 <= image[i][j], color < 65536"],
      examples: [
        {
          input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2",
          output: "[[2,2,2],[2,2,0],[2,0,1]]"
        }
      ]
    },
    ai_response: {
      code: `def floodFill(image, sr, sc, color):\n    orig_color = image[sr][sc]\n    # Bug: Infinite recursion if color == orig_color\n    def dfs(r, c):\n        if r < 0 or r >= len(image) or c < 0 or c >= len(image[0]):\n            return\n        if image[r][c] != orig_color:\n            return\n        image[r][c] = color\n        dfs(r + 1, c)\n        dfs(r - 1, c)\n        dfs(r, c + 1)\n        dfs(r, c - 1)\n    dfs(sr, sc)\n    return image`,
      stated_explanation: "DFS flood fill changing adjacent matching pixels to new color.",
      stated_time_complexity: "O(m * n)",
      stated_space_complexity: "O(m * n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "edge_case_blindness",
      error_categories: ["edge_case_blindness"],
      expected_issues: [
        {
          id: "iss_graph_733_01",
          severity: "critical",
          dimension: "edge_case",
          line_numbers: [3],
          description: "Infinite recursion when `color == orig_color`: Without the guard `if orig_color == color: return image`, `image[r][c] != orig_color` is never met because the pixel value never changes, causing maximum recursion depth exceeded crash.",
          failing_input_example: "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0",
          why_it_matters: "When the target color equals the starting color, recursion will loop indefinitely between adjacent cells."
        }
      ],
      optimal_complexity: {
        time: "O(m * n)",
        space: "O(m * n)",
        reasoning: "DFS touches each connected cell once."
      },
      corrected_code: `def floodFill(image, sr, sc, color):\n    orig_color = image[sr][sc]\n    if orig_color == color: return image\n    def dfs(r, c):\n        if r < 0 or r >= len(image) or c < 0 or c >= len(image[0]): return\n        if image[r][c] != orig_color: return\n        image[r][c] = color\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)\n    dfs(sr, sc)\n    return image`,
      model_critique_summary: "Missing color == orig_color guard causing recursion depth crash."
    },
    language_variants: {
      cpp: {
        code: `auto floodFill(image, sr, sc, color) {\n    orig_color = image[sr][sc]\n    // Bug: Infinite recursion if color == orig_color\n    def dfs(r, c):\n        if r < 0 || r >= image.size() || c < 0 || c >= image[0].size():\n            return\n        if image[r][c] != orig_color:\n            return\n        image[r][c] = color\n        dfs(r + 1, c)\n        dfs(r - 1, c)\n        dfs(r, c + 1)\n        dfs(r, c - 1)\n    dfs(sr, sc)\n    return image`,
        corrected_code: `auto floodFill(image, sr, sc, color) {\n    orig_color = image[sr][sc]\n    if orig_color == color: return image\n    def dfs(r, c):\n        if r < 0 || r >= image.size() || c < 0 || c >= image[0].size(): return\n        if image[r][c] != orig_color: return\n        image[r][c] = color\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)\n    dfs(sr, sc)\n    return image`,
      },
      javascript: {
        code: `var floodFill = function(image, sr, sc, color) {\n    orig_color = image[sr][sc]\n    // Bug: Infinite recursion if color == orig_color\n    def dfs(r, c):\n        if r < 0 || r >= image.length || c < 0 || c >= image[0].length:\n            return\n        if image[r][c] != orig_color:\n            return\n        image[r][c] = color\n        dfs(r + 1, c)\n        dfs(r - 1, c)\n        dfs(r, c + 1)\n        dfs(r, c - 1)\n    dfs(sr, sc)\n    return image`,
        corrected_code: `var floodFill = function(image, sr, sc, color) {\n    orig_color = image[sr][sc]\n    if orig_color == color: return image\n    def dfs(r, c):\n        if r < 0 || r >= image.length || c < 0 || c >= image[0].length: return\n        if image[r][c] != orig_color: return\n        image[r][c] = color\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)\n    dfs(sr, sc)\n    return image`,
      },
    }
  },

  {
    id: "q_graph_547",
    title: "Number of Provinces (LeetCode 547)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "There are `n` cities. Given an `n x n` matrix `isConnected` where `isConnected[i][j] = 1` if the `i-th` and `j-th` city are directly connected, return the total number of provinces (connected components).",
      constraints: ["1 <= n <= 200", "isConnected[i][i] == 1"],
      examples: [
        {
          input: "isConnected = [[1,1,0],[1,1,0],[0,0,1]]",
          output: "2"
        }
      ]
    },
    ai_response: {
      code: `def findCircleNum(isConnected):\n    n = len(isConnected)\n    visited = set()\n    provinces = 0\n    \n    def dfs(city):\n        for neighbor in range(n):\n            if isConnected[city][neighbor] == 1 and neighbor not in visited:\n                visited.add(neighbor)\n                dfs(neighbor)\n                \n    for i in range(n):\n        if i not in visited:\n            visited.add(i)\n            dfs(i)\n            provinces += 1\n            \n    return provinces`,
      stated_explanation: "Finds connected components using DFS. Increments province count for each unvisited node.",
      stated_time_complexity: "O(n^2)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n^2)",
        space: "O(n)",
        reasoning: "Matrix adjacency traversal."
      },
      corrected_code: `def findCircleNum(isConnected):\n    n = len(isConnected)\n    visited = set()\n    provinces = 0\n    def dfs(city):\n        for neighbor in range(n):\n            if isConnected[city][neighbor] == 1 and neighbor not in visited:\n                visited.add(neighbor)\n                dfs(neighbor)\n    for i in range(n):\n        if i not in visited:\n            visited.add(i)\n            dfs(i)\n            provinces += 1\n    return provinces`,
      model_critique_summary: "Optimal, completely correct connected components DFS."
    },
    language_variants: {
      cpp: {
        code: `auto findCircleNum(isConnected) {\n    n = isConnected.size()\n    visited = set()\n    provinces = 0\n    \n    def dfs(city):\n        for neighbor in range(n):\n            if isConnected[city][neighbor] == 1 && neighbor ! in visited:\n                visited.add(neighbor)\n                dfs(neighbor)\n                \n    for i in range(n):\n        if i ! in visited:\n            visited.add(i)\n            dfs(i)\n            provinces += 1\n            \n    return provinces`,
        corrected_code: `auto findCircleNum(isConnected) {\n    n = isConnected.size()\n    visited = set()\n    provinces = 0\n    def dfs(city):\n        for neighbor in range(n):\n            if isConnected[city][neighbor] == 1 && neighbor ! in visited:\n                visited.add(neighbor)\n                dfs(neighbor)\n    for i in range(n):\n        if i ! in visited:\n            visited.add(i)\n            dfs(i)\n            provinces += 1\n    return provinces`,
      },
      javascript: {
        code: `var findCircleNum = function(isConnected) {\n    n = isConnected.length\n    visited = set()\n    provinces = 0\n    \n    def dfs(city):\n        for neighbor in range(n):\n            if isConnected[city][neighbor] == 1 && neighbor ! in visited:\n                visited.add(neighbor)\n                dfs(neighbor)\n                \n    for i in range(n):\n        if i ! in visited:\n            visited.add(i)\n            dfs(i)\n            provinces += 1\n            \n    return provinces`,
        corrected_code: `var findCircleNum = function(isConnected) {\n    n = isConnected.length\n    visited = set()\n    provinces = 0\n    def dfs(city):\n        for neighbor in range(n):\n            if isConnected[city][neighbor] == 1 && neighbor ! in visited:\n                visited.add(neighbor)\n                dfs(neighbor)\n    for i in range(n):\n        if i ! in visited:\n            visited.add(i)\n            dfs(i)\n            provinces += 1\n    return provinces`,
      },
    }
  },

  {
    id: "q_graph_417",
    title: "Pacific Atlantic Water Flow (LeetCode 417)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Return a 2D list of grid coordinates `result` where `result[i] = [r_i, c_i]` denotes that rain water can flow from cell `(r_i, c_i)` to both the Pacific and Atlantic oceans.",
      constraints: ["1 <= m, n <= 200", "0 <= heights[r][c] <= 10^5"],
      examples: [
        {
          input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
          output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]"
        }
      ]
    },
    ai_response: {
      code: `def pacificAtlantic(heights):\n    if not heights: return []\n    ROWS, COLS = len(heights), len(heights[0])\n    pac, atl = set(), set()\n    \n    def dfs(r, c, visit, prev_height):\n        if (r, c) in visit or r < 0 or c < 0 or r == ROWS or c == COLS or heights[r][c] < prev_height:\n            return\n        visit.add((r, c))\n        dfs(r + 1, c, visit, heights[r][c])\n        dfs(r - 1, c, visit, heights[r][c])\n        dfs(r, c + 1, visit, heights[r][c])\n        dfs(r, c - 1, visit, heights[r][c])\n        \n    for c in range(COLS):\n        dfs(0, c, pac, heights[0][c])\n        dfs(ROWS - 1, c, atl, heights[ROWS - 1][c])\n        \n    for r in range(ROWS):\n        dfs(r, 0, pac, heights[r][0])\n        dfs(r, COLS - 1, atl, heights[r][COLS - 1])\n        \n    return list(pac.intersection(atl))`,
      stated_explanation: "Flows backwards from ocean borders inland. Cells reachable by both DFS runs form the intersection.",
      stated_time_complexity: "O(m * n)",
      stated_space_complexity: "O(m * n)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(m * n)",
        space: "O(m * n)",
        reasoning: "Reverse ocean boundary DFS."
      },
      corrected_code: `def pacificAtlantic(heights):\n    if not heights: return []\n    ROWS, COLS = len(heights), len(heights[0])\n    pac, atl = set(), set()\n    def dfs(r, c, visit, prev_height):\n        if (r, c) in visit or r < 0 or c < 0 or r == ROWS or c == COLS or heights[r][c] < prev_height:\n            return\n        visit.add((r, c))\n        dfs(r + 1, c, visit, heights[r][c]); dfs(r - 1, c, visit, heights[r][c])\n        dfs(r, c + 1, visit, heights[r][c]); dfs(r, c - 1, visit, heights[r][c])\n    for c in range(COLS):\n        dfs(0, c, pac, heights[0][c]); dfs(ROWS - 1, c, atl, heights[ROWS - 1][c])\n    for r in range(ROWS):\n        dfs(r, 0, pac, heights[r][0]); dfs(r, COLS - 1, atl, heights[r][COLS - 1])\n    return list(pac.intersection(atl))`,
      model_critique_summary: "Optimal, completely correct reverse boundary DFS."
    },
    language_variants: {
      cpp: {
        code: `auto pacificAtlantic(heights) {\n    if ! heights: return []\n    ROWS, COLS = heights.size(), heights[0].size()\n    pac, atl = set(), set()\n    \n    def dfs(r, c, visit, prev_height):\n        if (r, c) in visit || r < 0 || c < 0 || r == ROWS || c == COLS || heights[r][c] < prev_height:\n            return\n        visit.add((r, c))\n        dfs(r + 1, c, visit, heights[r][c])\n        dfs(r - 1, c, visit, heights[r][c])\n        dfs(r, c + 1, visit, heights[r][c])\n        dfs(r, c - 1, visit, heights[r][c])\n        \n    for c in range(COLS):\n        dfs(0, c, pac, heights[0][c])\n        dfs(ROWS - 1, c, atl, heights[ROWS - 1][c])\n        \n    for r in range(ROWS):\n        dfs(r, 0, pac, heights[r][0])\n        dfs(r, COLS - 1, atl, heights[r][COLS - 1])\n        \n    return list(pac.intersection(atl))`,
        corrected_code: `auto pacificAtlantic(heights) {\n    if ! heights: return []\n    ROWS, COLS = heights.size(), heights[0].size()\n    pac, atl = set(), set()\n    def dfs(r, c, visit, prev_height):\n        if (r, c) in visit || r < 0 || c < 0 || r == ROWS || c == COLS || heights[r][c] < prev_height:\n            return\n        visit.add((r, c))\n        dfs(r + 1, c, visit, heights[r][c]); dfs(r - 1, c, visit, heights[r][c])\n        dfs(r, c + 1, visit, heights[r][c]); dfs(r, c - 1, visit, heights[r][c])\n    for c in range(COLS):\n        dfs(0, c, pac, heights[0][c]); dfs(ROWS - 1, c, atl, heights[ROWS - 1][c])\n    for r in range(ROWS):\n        dfs(r, 0, pac, heights[r][0]); dfs(r, COLS - 1, atl, heights[r][COLS - 1])\n    return list(pac.intersection(atl))`,
      },
      javascript: {
        code: `var pacificAtlantic = function(heights) {\n    if ! heights: return []\n    ROWS, COLS = heights.length, heights[0].length\n    pac, atl = set(), set()\n    \n    def dfs(r, c, visit, prev_height):\n        if (r, c) in visit || r < 0 || c < 0 || r == ROWS || c == COLS || heights[r][c] < prev_height:\n            return\n        visit.add((r, c))\n        dfs(r + 1, c, visit, heights[r][c])\n        dfs(r - 1, c, visit, heights[r][c])\n        dfs(r, c + 1, visit, heights[r][c])\n        dfs(r, c - 1, visit, heights[r][c])\n        \n    for c in range(COLS):\n        dfs(0, c, pac, heights[0][c])\n        dfs(ROWS - 1, c, atl, heights[ROWS - 1][c])\n        \n    for r in range(ROWS):\n        dfs(r, 0, pac, heights[r][0])\n        dfs(r, COLS - 1, atl, heights[r][COLS - 1])\n        \n    return list(pac.intersection(atl))`,
        corrected_code: `var pacificAtlantic = function(heights) {\n    if ! heights: return []\n    ROWS, COLS = heights.length, heights[0].length\n    pac, atl = set(), set()\n    def dfs(r, c, visit, prev_height):\n        if (r, c) in visit || r < 0 || c < 0 || r == ROWS || c == COLS || heights[r][c] < prev_height:\n            return\n        visit.add((r, c))\n        dfs(r + 1, c, visit, heights[r][c]); dfs(r - 1, c, visit, heights[r][c])\n        dfs(r, c + 1, visit, heights[r][c]); dfs(r, c - 1, visit, heights[r][c])\n    for c in range(COLS):\n        dfs(0, c, pac, heights[0][c]); dfs(ROWS - 1, c, atl, heights[ROWS - 1][c])\n    for r in range(ROWS):\n        dfs(r, 0, pac, heights[r][0]); dfs(r, COLS - 1, atl, heights[r][COLS - 1])\n    return list(pac.intersection(atl))`,
      },
    }
  },

  {
    id: "q_graph_210",
    title: "Course Schedule II (LeetCode 210)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Return the ordering of courses you should take to finish all courses. If impossible, return an empty array.",
      constraints: ["1 <= numCourses <= 2000"],
      examples: [
        {
          input: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]",
          output: "[0,2,1,3]"
        }
      ]
    },
    ai_response: {
      code: `from collections import deque, defaultdict\ndef findOrder(numCourses, prerequisites):\n    adj = defaultdict(list)\n    indegree = [0] * numCourses\n    for dest, src in prerequisites:\n        adj[src].append(dest)\n        indegree[dest] += 1\n    q = deque([i for i in range(numCourses) if indegree[i] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.append(node)\n        for nxt in adj[node]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0: q.append(nxt)\n    return order if len(order) == numCourses else []`,
      stated_explanation: "Kahn's topological sort.",
      stated_time_complexity: "O(V + E)",
      stated_space_complexity: "O(V + E)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(V + E)",
        space: "O(V + E)",
        reasoning: "Kahn's algorithm."
      },
      corrected_code: `def findOrder(numCourses, prerequisites):\n    adj = defaultdict(list)\n    indegree = [0] * numCourses\n    for dest, src in prerequisites:\n        adj[src].append(dest)\n        indegree[dest] += 1\n    q = deque([i for i in range(numCourses) if indegree[i] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.append(node)\n        for nxt in adj[node]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0: q.append(nxt)\n    return order if len(order) == numCourses else []`,
      model_critique_summary: "Optimal, completely correct Kahn's topological sort."
    },
    language_variants: {
      cpp: {
        code: `from collections import deque, defaultdict\nauto findOrder(numCourses, prerequisites) {\n    adj = defaultdict(list)\n    indegree = [0] * numCourses\n    for dest, src in prerequisites:\n        adj[src].push_back(dest)\n        indegree[dest] += 1\n    q = deque([i for i in range(numCourses) if indegree[i] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.push_back(node)\n        for nxt in adj[node]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0: q.push_back(nxt)\n    return order if order.size() == numCourses else []`,
        corrected_code: `auto findOrder(numCourses, prerequisites) {\n    adj = defaultdict(list)\n    indegree = [0] * numCourses\n    for dest, src in prerequisites:\n        adj[src].push_back(dest)\n        indegree[dest] += 1\n    q = deque([i for i in range(numCourses) if indegree[i] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.push_back(node)\n        for nxt in adj[node]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0: q.push_back(nxt)\n    return order if order.size() == numCourses else []`,
      },
      javascript: {
        code: `from collections import deque, defaultdict\nvar findOrder = function(numCourses, prerequisites) {\n    adj = defaultdict(list)\n    indegree = [0] * numCourses\n    for dest, src in prerequisites:\n        adj[src].push(dest)\n        indegree[dest] += 1\n    q = deque([i for i in range(numCourses) if indegree[i] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.push(node)\n        for nxt in adj[node]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0: q.push(nxt)\n    return order if order.length == numCourses else []`,
        corrected_code: `var findOrder = function(numCourses, prerequisites) {\n    adj = defaultdict(list)\n    indegree = [0] * numCourses\n    for dest, src in prerequisites:\n        adj[src].push(dest)\n        indegree[dest] += 1\n    q = deque([i for i in range(numCourses) if indegree[i] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.push(node)\n        for nxt in adj[node]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0: q.push(nxt)\n    return order if order.length == numCourses else []`,
      },
    }
  },

  {
    id: "q_graph_200",
    title: "Number of Islands (LeetCode 200)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Count connected components of 1s in a grid.",
      constraints: ["1 <= m, n <= 300"],
      examples: [
        {
          input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
          output: "2"
        }
      ]
    },
    ai_response: {
      code: `def numIslands(grid):\n    if not grid: return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    def dfs(r, c):\n        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1': return\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                dfs(r, c)\n                count += 1\n    return count`,
      stated_explanation: "DFS flood fill sinking visited islands.",
      stated_time_complexity: "O(m * n)",
      stated_space_complexity: "O(m * n)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(m * n)",
        space: "O(m * n)",
        reasoning: "DFS flood fill."
      },
      corrected_code: `def numIslands(grid):\n    if not grid: return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    def dfs(r, c):\n        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1': return\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                dfs(r, c)\n                count += 1\n    return count`,
      model_critique_summary: "Optimal, completely correct DFS flood fill."
    },
    language_variants: {
      cpp: {
        code: `auto numIslands(grid) {\n    if ! grid: return 0\n    rows, cols = grid.size(), grid[0].size()\n    count = 0\n    def dfs(r, c):\n        if r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1': return\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                dfs(r, c)\n                count += 1\n    return count`,
        corrected_code: `auto numIslands(grid) {\n    if ! grid: return 0\n    rows, cols = grid.size(), grid[0].size()\n    count = 0\n    def dfs(r, c):\n        if r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1': return\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                dfs(r, c)\n                count += 1\n    return count`,
      },
      javascript: {
        code: `var numIslands = function(grid) {\n    if ! grid: return 0\n    rows, cols = grid.length, grid[0].length\n    count = 0\n    def dfs(r, c):\n        if r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1': return\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                dfs(r, c)\n                count += 1\n    return count`,
        corrected_code: `var numIslands = function(grid) {\n    if ! grid: return 0\n    rows, cols = grid.length, grid[0].length\n    count = 0\n    def dfs(r, c):\n        if r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1': return\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                dfs(r, c)\n                count += 1\n    return count`,
      },
    }
  },

  {
    id: "q_graph_207",
    title: "Course Schedule (LeetCode 207)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Determine if all courses can be finished.",
      constraints: ["1 <= numCourses <= 2000"],
      examples: [
        {
          input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
          output: "false"
        }
      ]
    },
    ai_response: {
      code: `def canFinish(numCourses, prerequisites):\n    preMap = {i: [] for i in range(numCourses)}\n    for crs, pre in prerequisites:\n        preMap[crs].append(pre)\n    visited = set()\n    def dfs(crs):\n        if crs in visited: return False\n        if preMap[crs] == []: return True\n        visited.add(crs)\n        for pre in preMap[crs]:\n            if not dfs(pre): return False\n        # Bug: Forgot visited.remove(crs) backtracking step\n        preMap[crs] = []\n        return True\n    for crs in range(numCourses):\n        if not dfs(crs): return False\n    return True`,
      stated_explanation: "DFS cycle detection.",
      stated_time_complexity: "O(V + E)",
      stated_space_complexity: "O(V + E)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_graph_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [11],
          description: "Missing visited.remove(crs) cleanup in DAG traversal.",
          failing_input_example: "prerequisites = [[1,0],[2,0],[3,1],[3,2]]",
          why_it_matters: "Diamond DAG dependencies falsely flagged as cycles."
        }
      ],
      optimal_complexity: {
        time: "O(V + E)",
        space: "O(V + E)",
        reasoning: "Cycle detection."
      },
      corrected_code: `def canFinish(numCourses, prerequisites):\n    preMap = {i: [] for i in range(numCourses)\n    for crs, pre in prerequisites: preMap[crs].append(pre)\n    visited = set()\n    def dfs(crs):\n        if crs in visited: return False\n        if preMap[crs] == []: return True\n        visited.add(crs)\n        for pre in preMap[crs]:\n            if not dfs(pre): return False\n        visited.remove(crs)\n        preMap[crs] = []\n        return True\n    for crs in range(numCourses):\n        if not dfs(crs): return False\n    return True`,
      model_critique_summary: "Omitted visited cleanup in DFS cycle detection."
    },
    language_variants: {
      cpp: {
        code: `auto canFinish(numCourses, prerequisites) {\n    preMap = {i: [] for i in range(numCourses)}\n    for crs, pre in prerequisites:\n        preMap[crs].push_back(pre)\n    visited = set()\n    def dfs(crs):\n        if crs in visited: return false\n        if preMap[crs] == []: return true\n        visited.add(crs)\n        for pre in preMap[crs]:\n            if ! dfs(pre): return false\n        // Bug: Forgot visited.remove(crs) backtracking step\n        preMap[crs] = []\n        return true\n    for crs in range(numCourses):\n        if ! dfs(crs): return false\n    return true`,
        corrected_code: `auto canFinish(numCourses, prerequisites) {\n    preMap = {i: [] for i in range(numCourses)\n    for crs, pre in prerequisites: preMap[crs].push_back(pre)\n    visited = set()\n    def dfs(crs):\n        if crs in visited: return false\n        if preMap[crs] == []: return true\n        visited.add(crs)\n        for pre in preMap[crs]:\n            if ! dfs(pre): return false\n        visited.remove(crs)\n        preMap[crs] = []\n        return true\n    for crs in range(numCourses):\n        if ! dfs(crs): return false\n    return true`,
      },
      javascript: {
        code: `var canFinish = function(numCourses, prerequisites) {\n    preMap = {i: [] for i in range(numCourses)}\n    for crs, pre in prerequisites:\n        preMap[crs].push(pre)\n    visited = set()\n    def dfs(crs):\n        if crs in visited: return false\n        if preMap[crs] == []: return true\n        visited.add(crs)\n        for pre in preMap[crs]:\n            if ! dfs(pre): return false\n        // Bug: Forgot visited.remove(crs) backtracking step\n        preMap[crs] = []\n        return true\n    for crs in range(numCourses):\n        if ! dfs(crs): return false\n    return true`,
        corrected_code: `var canFinish = function(numCourses, prerequisites) {\n    preMap = {i: [] for i in range(numCourses)\n    for crs, pre in prerequisites: preMap[crs].push(pre)\n    visited = set()\n    def dfs(crs):\n        if crs in visited: return false\n        if preMap[crs] == []: return true\n        visited.add(crs)\n        for pre in preMap[crs]:\n            if ! dfs(pre): return false\n        visited.remove(crs)\n        preMap[crs] = []\n        return true\n    for crs in range(numCourses):\n        if ! dfs(crs): return false\n    return true`,
      },
    }
  },

  {
    id: "q_graph_994",
    title: "Rotting Oranges (LeetCode 994)",
    topic: "graphs",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Return minimum minutes until no fresh oranges remain.",
      constraints: ["1 <= m, n <= 10"],
      examples: [
        {
          input: "grid = [[2,1,1],[1,1,0],[0,1,1]]",
          output: "4"
        }
      ]
    },
    ai_response: {
      code: `from collections import deque\ndef orangesRotting(grid):\n    q = deque()\n    time, fresh = 0, 0\n    ROWS, COLS = len(grid), len(grid[0])\n    for r in range(ROWS):\n        for c in range(COLS):\n            if grid[r][c] == 1: fresh += 1\n            if grid[r][c] == 2: q.append((r, c))\n    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]\n    while q and fresh > 0:\n        for i in range(len(q)):\n            r, c = q.popleft()\n            for dr, dc in directions:\n                row, col = r + dr, c + dc\n                if row < 0 or row == ROWS or col < 0 or col == COLS or grid[row][col] != 1: continue\n                grid[row][col] = 2\n                q.append((row, col))\n                fresh -= 1\n        time += 1\n    return time if fresh == 0 else -1`,
      stated_explanation: "Multi-source BFS.",
      stated_time_complexity: "O(m * n)",
      stated_space_complexity: "O(m * n)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(m * n)",
        space: "O(m * n)",
        reasoning: "Multi-source BFS."
      },
      corrected_code: `def orangesRotting(grid):\n    q = deque()\n    time, fresh = 0, 0\n    ROWS, COLS = len(grid), len(grid[0])\n    for r in range(ROWS):\n        for c in range(COLS):\n            if grid[r][c] == 1: fresh += 1\n            if grid[r][c] == 2: q.append((r, c))\n    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]\n    while q and fresh > 0:\n        for i in range(len(q)):\n            r, c = q.popleft()\n            for dr, dc in directions:\n                row, col = r + dr, c + dc\n                if row < 0 or row == ROWS or col < 0 or col == COLS or grid[row][col] != 1: continue\n                grid[row][col] = 2\n                q.append((row, col))\n                fresh -= 1\n        time += 1\n    return time if fresh == 0 else -1`,
      model_critique_summary: "Optimal multi-source BFS."
    },
    language_variants: {
      cpp: {
        code: `from collections import deque\nauto orangesRotting(grid) {\n    q = deque()\n    time, fresh = 0, 0\n    ROWS, COLS = grid.size(), grid[0].size()\n    for r in range(ROWS):\n        for c in range(COLS):\n            if grid[r][c] == 1: fresh += 1\n            if grid[r][c] == 2: q.push_back((r, c))\n    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]\n    while q && fresh > 0:\n        for i in range(q.size()):\n            r, c = q.popleft()\n            for dr, dc in directions:\n                row, col = r + dr, c + dc\n                if row < 0 || row == ROWS || col < 0 || col == COLS || grid[row][col] != 1: continue\n                grid[row][col] = 2\n                q.push_back((row, col))\n                fresh -= 1\n        time += 1\n    return time if fresh == 0 else -1`,
        corrected_code: `auto orangesRotting(grid) {\n    q = deque()\n    time, fresh = 0, 0\n    ROWS, COLS = grid.size(), grid[0].size()\n    for r in range(ROWS):\n        for c in range(COLS):\n            if grid[r][c] == 1: fresh += 1\n            if grid[r][c] == 2: q.push_back((r, c))\n    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]\n    while q && fresh > 0:\n        for i in range(q.size()):\n            r, c = q.popleft()\n            for dr, dc in directions:\n                row, col = r + dr, c + dc\n                if row < 0 || row == ROWS || col < 0 || col == COLS || grid[row][col] != 1: continue\n                grid[row][col] = 2\n                q.push_back((row, col))\n                fresh -= 1\n        time += 1\n    return time if fresh == 0 else -1`,
      },
      javascript: {
        code: `from collections import deque\nvar orangesRotting = function(grid) {\n    q = deque()\n    time, fresh = 0, 0\n    ROWS, COLS = grid.length, grid[0].length\n    for r in range(ROWS):\n        for c in range(COLS):\n            if grid[r][c] == 1: fresh += 1\n            if grid[r][c] == 2: q.push((r, c))\n    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]\n    while q && fresh > 0:\n        for i in range(q.length):\n            r, c = q.popleft()\n            for dr, dc in directions:\n                row, col = r + dr, c + dc\n                if row < 0 || row == ROWS || col < 0 || col == COLS || grid[row][col] != 1: continue\n                grid[row][col] = 2\n                q.push((row, col))\n                fresh -= 1\n        time += 1\n    return time if fresh == 0 else -1`,
        corrected_code: `var orangesRotting = function(grid) {\n    q = deque()\n    time, fresh = 0, 0\n    ROWS, COLS = grid.length, grid[0].length\n    for r in range(ROWS):\n        for c in range(COLS):\n            if grid[r][c] == 1: fresh += 1\n            if grid[r][c] == 2: q.push((r, c))\n    directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]\n    while q && fresh > 0:\n        for i in range(q.length):\n            r, c = q.popleft()\n            for dr, dc in directions:\n                row, col = r + dr, c + dc\n                if row < 0 || row == ROWS || col < 0 || col == COLS || grid[row][col] != 1: continue\n                grid[row][col] = 2\n                q.push((row, col))\n                fresh -= 1\n        time += 1\n    return time if fresh == 0 else -1`,
      },
    }
  }
];
