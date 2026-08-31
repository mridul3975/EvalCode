import { QuestionItem } from "@/types/question";

export const TREE_QUESTIONS: QuestionItem[] = [
  {
    id: "q_tree_trav_scratch",
    title: "Binary Tree 4 Traversals from Scratch (Python)",
    topic: "trees",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Implement preorder, inorder, postorder, and level-order traversals for a binary tree from scratch.",
      constraints: ["0 <= Node Count <= 1000"],
      examples: [
        {
          input: "root = [1, null, 2, 3]",
          output: "preorder: [1,2,3], inorder: [1,3,2], postorder: [3,2,1], levelorder: [[1],[2],[3]]"
        }
      ]
    },
    ai_response: {
      code: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef postorder(root):\n    res = []\n    def dfs(node):\n        if not node: return\n        dfs(node.left)\n        dfs(node.right)\n        res.append(node.val)\n    dfs(root)\n    return res`,
      stated_explanation: "Standard postorder traversal.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "Visits each node once."
      },
      corrected_code: `def postorder(root):\n    res = []\n    def dfs(node):\n        if not node: return\n        dfs(node.left)\n        dfs(node.right)\n        res.append(node.val)\n    dfs(root)\n    return res`,
      model_critique_summary: "Optimal and correct postorder DFS."
    },
    language_variants: {
      cpp: {
        code: `class TreeNode:\n    auto __init__(val=0, left=nullptr, right=nullptr) {\n        this->val = val\n        this->left = left\n        this->right = right\n\ndef postorder(root):\n    res = []\n    def dfs(node):\n        if ! node: return\n        dfs(node.left)\n        dfs(node.right)\n        res.push_back(node.val)\n    dfs(root)\n    return res`,
        corrected_code: `auto postorder(root) {\n    res = []\n    def dfs(node):\n        if ! node: return\n        dfs(node.left)\n        dfs(node.right)\n        res.push_back(node.val)\n    dfs(root)\n    return res`,
      },
      javascript: {
        code: `class TreeNode:\n    var __init__ = function(val=0, left=null, right=null) {\n        this.val = val\n        this.left = left\n        this.right = right\n\ndef postorder(root):\n    res = []\n    def dfs(node):\n        if ! node: return\n        dfs(node.left)\n        dfs(node.right)\n        res.push(node.val)\n    dfs(root)\n    return res`,
        corrected_code: `var postorder = function(root) {\n    res = []\n    def dfs(node):\n        if ! node: return\n        dfs(node.left)\n        dfs(node.right)\n        res.push(node.val)\n    dfs(root)\n    return res`,
      },
    }
  },

  {
    id: "q_tree_094",
    title: "Binary Tree Inorder Traversal Iterative (LeetCode 94)",
    topic: "trees",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Given the `root` of a binary tree, return the inorder traversal of its nodes' values iteratively using a stack.",
      constraints: ["0 <= Node Count <= 100"],
      examples: [
        {
          input: "root = [1,null,2,3]",
          output: "[1,3,2]"
        }
      ]
    },
    ai_response: {
      code: `def inorderTraversal(root):\n    res = []\n    stack = []\n    curr = root\n    while curr or stack:\n        while curr:\n            stack.append(curr)\n            curr = curr.left\n        curr = stack.pop()\n        res.append(curr.val)\n        # Bug: re-assigns curr = curr.left instead of curr = curr.right causing infinite left subtree loop\n        curr = curr.left\n    return res`,
      stated_explanation: "Iteratively traverses in-order using explicit call stack.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_tree_94_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [10],
          description: "Inverted child traversal step: `curr = curr.left` after popping triggers an infinite loop reprocessing already visited left subtrees. Must advance to the right child `curr = curr.right`.",
          failing_input_example: "root = [1, 2, 3]",
          why_it_matters: "Inorder traversal order is Left -> Root -> Right."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "Each node is pushed and popped exactly once."
      },
      corrected_code: `def inorderTraversal(root):\n    res = []\n    stack = []\n    curr = root\n    while curr or stack:\n        while curr:\n            stack.append(curr)\n            curr = curr.left\n        curr = stack.pop()\n        res.append(curr.val)\n        curr = curr.right\n    return res`,
      model_critique_summary: "Assigned curr = curr.left instead of curr = curr.right."
    },
    language_variants: {
      cpp: {
        code: `auto inorderTraversal(root) {\n    res = []\n    stack = []\n    curr = root\n    while curr || stack:\n        while curr:\n            stack.push_back(curr)\n            curr = curr.left\n        curr = stack.pop_back()\n        res.push_back(curr.val)\n        // Bug: re-assigns curr = curr.left instead of curr = curr.right causing infinite left subtree loop\n        curr = curr.left\n    return res`,
        corrected_code: `auto inorderTraversal(root) {\n    res = []\n    stack = []\n    curr = root\n    while curr || stack:\n        while curr:\n            stack.push_back(curr)\n            curr = curr.left\n        curr = stack.pop_back()\n        res.push_back(curr.val)\n        curr = curr.right\n    return res`,
      },
      javascript: {
        code: `var inorderTraversal = function(root) {\n    res = []\n    stack = []\n    curr = root\n    while curr || stack:\n        while curr:\n            stack.push(curr)\n            curr = curr.left\n        curr = stack.pop()\n        res.push(curr.val)\n        // Bug: re-assigns curr = curr.left instead of curr = curr.right causing infinite left subtree loop\n        curr = curr.left\n    return res`,
        corrected_code: `var inorderTraversal = function(root) {\n    res = []\n    stack = []\n    curr = root\n    while curr || stack:\n        while curr:\n            stack.push(curr)\n            curr = curr.left\n        curr = stack.pop()\n        res.push(curr.val)\n        curr = curr.right\n    return res`,
      },
    }
  },

  {
    id: "q_tree_102",
    title: "Binary Tree Level Order Traversal (LeetCode 102)",
    topic: "trees",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
      constraints: ["0 <= Node Count <= 2000"],
      examples: [
        {
          input: "root = [3,9,20,null,null,15,7]",
          output: "[[3],[9,20],[15,7]]"
        }
      ]
    },
    ai_response: {
      code: `from collections import deque\n\ndef levelOrder(root):\n    if not root: return []\n    res = []\n    q = deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res`,
      stated_explanation: "BFS level-by-level using deque.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n)",
        space: "O(n)",
        reasoning: "BFS queue processing."
      },
      corrected_code: `from collections import deque\ndef levelOrder(root):\n    if not root: return []\n    res, q = [], deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res`,
      model_critique_summary: "Optimal, completely correct level order BFS."
    },
    language_variants: {
      cpp: {
        code: `from collections import deque\n\nauto levelOrder(root) {\n    if ! root: return []\n    res = []\n    q = deque([root])\n    while q:\n        level = []\n        for _ in range(q.size()):\n            node = q.popleft()\n            level.push_back(node.val)\n            if node.left: q.push_back(node.left)\n            if node.right: q.push_back(node.right)\n        res.push_back(level)\n    return res`,
        corrected_code: `from collections import deque\nauto levelOrder(root) {\n    if ! root: return []\n    res, q = [], deque([root])\n    while q:\n        level = []\n        for _ in range(q.size()):\n            node = q.popleft()\n            level.push_back(node.val)\n            if node.left: q.push_back(node.left)\n            if node.right: q.push_back(node.right)\n        res.push_back(level)\n    return res`,
      },
      javascript: {
        code: `from collections import deque\n\nvar levelOrder = function(root) {\n    if ! root: return []\n    res = []\n    q = deque([root])\n    while q:\n        level = []\n        for _ in range(q.length):\n            node = q.popleft()\n            level.push(node.val)\n            if node.left: q.push(node.left)\n            if node.right: q.push(node.right)\n        res.push(level)\n    return res`,
        corrected_code: `from collections import deque\nvar levelOrder = function(root) {\n    if ! root: return []\n    res, q = [], deque([root])\n    while q:\n        level = []\n        for _ in range(q.length):\n            node = q.popleft()\n            level.push(node.val)\n            if node.left: q.push(node.left)\n            if node.right: q.push(node.right)\n        res.push(level)\n    return res`,
      },
    }
  },

  {
    id: "q_tree_104",
    title: "Maximum Depth of Binary Tree (LeetCode 104)",
    topic: "trees",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Given the root of a binary tree, return its maximum depth.",
      constraints: ["0 <= Node Count <= 10^4"],
      examples: [
        {
          input: "root = [3,9,20,null,null,15,7]",
          output: "3"
        }
      ]
    },
    ai_response: {
      code: `def maxDepth(root):\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
      stated_explanation: "Recursively computes 1 + max of subtree depths.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "Single post-order DFS."
      },
      corrected_code: `def maxDepth(root):\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
      model_critique_summary: "Optimal, clean recursive depth calculation."
    },
    language_variants: {
      cpp: {
        code: `auto maxDepth(root) {\n    if ! root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
        corrected_code: `auto maxDepth(root) {\n    if ! root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
      },
      javascript: {
        code: `var maxDepth = function(root) {\n    if ! root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
        corrected_code: `var maxDepth = function(root) {\n    if ! root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
      },
    }
  },

  {
    id: "q_tree_226",
    title: "Invert Binary Tree (LeetCode 226)",
    topic: "trees",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Given the root of a binary tree, invert the tree, and return its root.",
      constraints: ["0 <= Node Count <= 100"],
      examples: [
        {
          input: "root = [4,2,7,1,3,6,9]",
          output: "[4,7,2,9,6,3,1]"
        }
      ]
    },
    ai_response: {
      code: `def invertTree(root):\n    if not root: return None\n    # Bug: inverts left subtree, reassigns root.left, then recursively inverts the newly assigned left subtree again!\n    root.left = invertTree(root.right)\n    root.right = invertTree(root.left)\n    return root`,
      stated_explanation: "Recursively swaps left and right subtrees.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_tree_226_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [4, 5],
          description: "Overwritten child reference before recursion: `root.left` is overwritten with `invertTree(root.right)` before calling `invertTree(root.left)`, causing the original left subtree to be lost and the right subtree to be inverted twice.",
          failing_input_example: "root = [2, 1, 3] -> returns [2, 3, 3]",
          why_it_matters: "Simultaneous swap `root.left, root.right = invertTree(root.right), invertTree(root.left)` or temporary variable is required."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "Visits each node once."
      },
      corrected_code: `def invertTree(root):\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root`,
      model_critique_summary: "Overwrote root.left prior to recursing on it."
    },
    language_variants: {
      cpp: {
        code: `auto invertTree(root) {\n    if ! root: return nullptr\n    // Bug: inverts left subtree, reassigns root.left, then recursively inverts the newly assigned left subtree again!\n    root.left = invertTree(root.right)\n    root.right = invertTree(root.left)\n    return root`,
        corrected_code: `auto invertTree(root) {\n    if ! root: return nullptr\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root`,
      },
      javascript: {
        code: `var invertTree = function(root) {\n    if ! root: return null\n    // Bug: inverts left subtree, reassigns root.left, then recursively inverts the newly assigned left subtree again!\n    root.left = invertTree(root.right)\n    root.right = invertTree(root.left)\n    return root`,
        corrected_code: `var invertTree = function(root) {\n    if ! root: return null\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root`,
      },
    }
  },

  {
    id: "q_tree_543",
    title: "Diameter of Binary Tree (LeetCode 543)",
    topic: "trees",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes.",
      constraints: ["1 <= Node Count <= 10^4"],
      examples: [
        {
          input: "root = [1,2,3,4,5]",
          output: "3",
          explanation: "3 is the length of the path [4,2,1,3] or [5,2,1,3]."
        }
      ]
    },
    ai_response: {
      code: `def diameterOfBinaryTree(root):\n    diameter = 0\n    def dfs(node):\n        nonlocal diameter\n        if not node: return 0\n        left = dfs(node.left)\n        right = dfs(node.right)\n        # Bug: assigns diameter directly instead of max(diameter, ...)\n        diameter = left + right\n        return 1 + max(left, right)\n    dfs(root)\n    return diameter`,
      stated_explanation: "Computes subtree heights and tracks diameter.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_tree_543_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [8],
          description: "Overwriting global maximum: `diameter = left + right` overwrites the diameter with the last visited node's local sum instead of taking `diameter = max(diameter, left + right)`.",
          failing_input_example: "Deep unbalanced tree where max diameter occurs in a lower subtree.",
          why_it_matters: "Global tree properties must be accumulated using max()."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "Single post-order DFS."
      },
      corrected_code: `def diameterOfBinaryTree(root):\n    diameter = 0\n    def dfs(node):\n        nonlocal diameter\n        if not node: return 0\n        left = dfs(node.left)\n        right = dfs(node.right)\n        diameter = max(diameter, left + right)\n        return 1 + max(left, right)\n    dfs(root)\n    return diameter`,
      model_critique_summary: "Overwrote diameter without max()."
    },
    language_variants: {
      cpp: {
        code: `auto diameterOfBinaryTree(root) {\n    diameter = 0\n    def dfs(node):\n        nonlocal diameter\n        if ! node: return 0\n        left = dfs(node.left)\n        right = dfs(node.right)\n        // Bug: assigns diameter directly instead of max(diameter, ...)\n        diameter = left + right\n        return 1 + max(left, right)\n    dfs(root)\n    return diameter`,
        corrected_code: `auto diameterOfBinaryTree(root) {\n    diameter = 0\n    def dfs(node):\n        nonlocal diameter\n        if ! node: return 0\n        left = dfs(node.left)\n        right = dfs(node.right)\n        diameter = max(diameter, left + right)\n        return 1 + max(left, right)\n    dfs(root)\n    return diameter`,
      },
      javascript: {
        code: `var diameterOfBinaryTree = function(root) {\n    diameter = 0\n    def dfs(node):\n        nonlocal diameter\n        if ! node: return 0\n        left = dfs(node.left)\n        right = dfs(node.right)\n        // Bug: assigns diameter directly instead of max(diameter, ...)\n        diameter = left + right\n        return 1 + max(left, right)\n    dfs(root)\n    return diameter`,
        corrected_code: `var diameterOfBinaryTree = function(root) {\n    diameter = 0\n    def dfs(node):\n        nonlocal diameter\n        if ! node: return 0\n        left = dfs(node.left)\n        right = dfs(node.right)\n        diameter = max(diameter, left + right)\n        return 1 + max(left, right)\n    dfs(root)\n    return diameter`,
      },
    }
  },

  {
    id: "q_tree_101",
    title: "Symmetric Tree (LeetCode 101)",
    topic: "trees",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
      constraints: ["1 <= Node Count <= 1000"],
      examples: [
        {
          input: "root = [1,2,2,3,4,4,3]",
          output: "true"
        }
      ]
    },
    ai_response: {
      code: `def isSymmetric(root):\n    if not root: return True\n    def isMirror(t1, t2):\n        if not t1 and not t2: return True\n        if not t1 or not t2: return False\n        return (t1.val == t2.val) and isMirror(t1.left, t2.right) and isMirror(t1.right, t2.left)\n    return isMirror(root.left, root.right)`,
      stated_explanation: "Recursively checks mirror symmetry comparing outer and inner children.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "Single DFS comparing mirror subtrees."
      },
      corrected_code: `def isSymmetric(root):\n    if not root: return True\n    def isMirror(t1, t2):\n        if not t1 and not t2: return True\n        if not t1 or not t2: return False\n        return (t1.val == t2.val) and isMirror(t1.left, t2.right) and isMirror(t1.right, t2.left)\n    return isMirror(root.left, root.right)`,
      model_critique_summary: "Optimal, completely correct recursive mirror comparison."
    },
    language_variants: {
      cpp: {
        code: `auto isSymmetric(root) {\n    if ! root: return true\n    def isMirror(t1, t2):\n        if ! t1 && ! t2: return true\n        if ! t1 || ! t2: return false\n        return (t1.val == t2.val) && isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left)\n    return isMirror(root.left, root.right)`,
        corrected_code: `auto isSymmetric(root) {\n    if ! root: return true\n    def isMirror(t1, t2):\n        if ! t1 && ! t2: return true\n        if ! t1 || ! t2: return false\n        return (t1.val == t2.val) && isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left)\n    return isMirror(root.left, root.right)`,
      },
      javascript: {
        code: `var isSymmetric = function(root) {\n    if ! root: return true\n    def isMirror(t1, t2):\n        if ! t1 && ! t2: return true\n        if ! t1 || ! t2: return false\n        return (t1.val == t2.val) && isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left)\n    return isMirror(root.left, root.right)`,
        corrected_code: `var isSymmetric = function(root) {\n    if ! root: return true\n    def isMirror(t1, t2):\n        if ! t1 && ! t2: return true\n        if ! t1 || ! t2: return false\n        return (t1.val == t2.val) && isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left)\n    return isMirror(root.left, root.right)`,
      },
    }
  },

  {
    id: "q_tree_199",
    title: "Binary Tree Right Side View (LeetCode 199)",
    topic: "trees",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.",
      constraints: ["0 <= Node Count <= 100"],
      examples: [
        {
          input: "root = [1,2,3,null,5,null,4]",
          output: "[1,3,4]"
        }
      ]
    },
    ai_response: {
      code: `def rightSideView(root):\n    res = []\n    def dfs(node, depth):\n        if not node: return\n        if depth == len(res):\n            res.append(node.val)\n        # Visit right child first so first node seen at each level is rightmost\n        dfs(node.right, depth + 1)\n        dfs(node.left, depth + 1)\n    dfs(root, 0)\n    return res`,
      stated_explanation: "Preorder DFS visiting right subtree first. Appends node when reaching a new depth level.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "DFS right-first traversal."
      },
      corrected_code: `def rightSideView(root):\n    res = []\n    def dfs(node, depth):\n        if not node: return\n        if depth == len(res):\n            res.append(node.val)\n        dfs(node.right, depth + 1)\n        dfs(node.left, depth + 1)\n    dfs(root, 0)\n    return res`,
      model_critique_summary: "Optimal, completely correct right-first DFS."
    },
    language_variants: {
      cpp: {
        code: `auto rightSideView(root) {\n    res = []\n    def dfs(node, depth):\n        if ! node: return\n        if depth == res.size():\n            res.push_back(node.val)\n        // Visit right child first so first node seen at each level is rightmost\n        dfs(node.right, depth + 1)\n        dfs(node.left, depth + 1)\n    dfs(root, 0)\n    return res`,
        corrected_code: `auto rightSideView(root) {\n    res = []\n    def dfs(node, depth):\n        if ! node: return\n        if depth == res.size():\n            res.push_back(node.val)\n        dfs(node.right, depth + 1)\n        dfs(node.left, depth + 1)\n    dfs(root, 0)\n    return res`,
      },
      javascript: {
        code: `var rightSideView = function(root) {\n    res = []\n    def dfs(node, depth):\n        if ! node: return\n        if depth == res.length:\n            res.push(node.val)\n        // Visit right child first so first node seen at each level is rightmost\n        dfs(node.right, depth + 1)\n        dfs(node.left, depth + 1)\n    dfs(root, 0)\n    return res`,
        corrected_code: `var rightSideView = function(root) {\n    res = []\n    def dfs(node, depth):\n        if ! node: return\n        if depth == res.length:\n            res.push(node.val)\n        dfs(node.right, depth + 1)\n        dfs(node.left, depth + 1)\n    dfs(root, 0)\n    return res`,
      },
    }
  },

  {
    id: "q_tree_098",
    title: "Validate Binary Search Tree (LeetCode 98)",
    topic: "trees",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
      constraints: ["1 <= Node Count <= 10^4"],
      examples: [
        {
          input: "root = [2,1,3]",
          output: "true"
        }
      ]
    },
    ai_response: {
      code: `def isValidBST(root):\n    if not root: return True\n    # Bug: Local parent-child check only\n    if root.left and root.left.val >= root.val: return False\n    if root.right and root.right.val <= root.val: return False\n    return isValidBST(root.left) and isValidBST(root.right)`,
      stated_explanation: "Local child checks.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_tree_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [4],
          description: "Local vs Global bound flaw in BST validation.",
          failing_input_example: "root = [5, 4, 6, null, null, 3, 7]",
          why_it_matters: "All right subtree nodes must exceed root."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "Pass min/max interval."
      },
      corrected_code: `def isValidBST(root):\n    def validate(node, low=float('-inf'), high=float('inf')):\n        if not node: return True\n        if not (low < node.val < high): return False\n        return validate(node.left, low, node.val) and validate(node.right, node.val, high)\n    return validate(root)`,
      model_critique_summary: "Local parent-child check flaw."
    },
    language_variants: {
      cpp: {
        code: `auto isValidBST(root) {\n    if ! root: return true\n    // Bug: Local parent-child check only\n    if root.left && root.left.val >= root.val: return false\n    if root.right && root.right.val <= root.val: return false\n    return isValidBST(root.left) && isValidBST(root.right)`,
        corrected_code: `auto isValidBST(root) {\n    def validate(node, low=float('-inf'), high=float('inf')):\n        if ! node: return true\n        if ! (low < node.val < high): return false\n        return validate(node.left, low, node.val) && validate(node.right, node.val, high)\n    return validate(root)`,
      },
      javascript: {
        code: `var isValidBST = function(root) {\n    if ! root: return true\n    // Bug: Local parent-child check only\n    if root.left && root.left.val >= root.val: return false\n    if root.right && root.right.val <= root.val: return false\n    return isValidBST(root.left) && isValidBST(root.right)`,
        corrected_code: `var isValidBST = function(root) {\n    def validate(node, low=float('-inf'), high=float('inf')):\n        if ! node: return true\n        if ! (low < node.val < high): return false\n        return validate(node.left, low, node.val) && validate(node.right, node.val, high)\n    return validate(root)`,
      },
    }
  },

  {
    id: "q_tree_230",
    title: "Kth Smallest Element in a BST (LeetCode 230)",
    topic: "trees",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given the root of a binary search tree and an integer `k`, return the `k-th` smallest value (1-indexed) of all the values of the nodes in the tree.",
      constraints: ["1 <= k <= Node Count <= 10^4"],
      examples: [
        {
          input: "root = [3,1,4,null,2], k = 1",
          output: "1"
        }
      ]
    },
    ai_response: {
      code: `def kthSmallest(root, k):\n    stack = []\n    curr = root\n    while curr or stack:\n        while curr:\n            stack.append(curr)\n            curr = curr.left\n        curr = stack.pop()\n        k -= 1\n        if k == 0:\n            return curr.val\n        curr = curr.right`,
      stated_explanation: "Iterative inorder traversal stopping exactly after k popped elements.",
      stated_time_complexity: "O(H + k)",
      stated_space_complexity: "O(H)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(H + k)",
        space: "O(H)",
        reasoning: "Inorder traversal stops early at k-th element."
      },
      corrected_code: `def kthSmallest(root, k):\n    stack = []\n    curr = root\n    while curr or stack:\n        while curr:\n            stack.append(curr)\n            curr = curr.left\n        curr = stack.pop()\n        k -= 1\n        if k == 0:\n            return curr.val\n        curr = curr.right`,
      model_critique_summary: "Optimal, completely correct iterative inorder early termination."
    },
    language_variants: {
      cpp: {
        code: `auto kthSmallest(root, k) {\n    stack = []\n    curr = root\n    while curr || stack:\n        while curr:\n            stack.push_back(curr)\n            curr = curr.left\n        curr = stack.pop_back()\n        k -= 1\n        if k == 0:\n            return curr.val\n        curr = curr.right`,
        corrected_code: `auto kthSmallest(root, k) {\n    stack = []\n    curr = root\n    while curr || stack:\n        while curr:\n            stack.push_back(curr)\n            curr = curr.left\n        curr = stack.pop_back()\n        k -= 1\n        if k == 0:\n            return curr.val\n        curr = curr.right`,
      },
      javascript: {
        code: `var kthSmallest = function(root, k) {\n    stack = []\n    curr = root\n    while curr || stack:\n        while curr:\n            stack.push(curr)\n            curr = curr.left\n        curr = stack.pop()\n        k -= 1\n        if k == 0:\n            return curr.val\n        curr = curr.right`,
        corrected_code: `var kthSmallest = function(root, k) {\n    stack = []\n    curr = root\n    while curr || stack:\n        while curr:\n            stack.push(curr)\n            curr = curr.left\n        curr = stack.pop()\n        k -= 1\n        if k == 0:\n            return curr.val\n        curr = curr.right`,
      },
    }
  },

  {
    id: "q_tree_297",
    title: "Serialize and Deserialize Binary Tree (LeetCode 297)",
    topic: "trees",
    difficulty: "hard",
    language: "python",
    problem_statement: {
      description: "Design an algorithm to serialize and deserialize a binary tree. Serialization is converting a tree to a string, and deserialization is reconstructing the tree from the string.",
      constraints: ["0 <= Node Count <= 10^4", "-1000 <= Node.val <= 1000"],
      examples: [
        {
          input: "root = [1,2,3,null,null,4,5]",
          output: "[1,2,3,null,null,4,5]"
        }
      ]
    },
    ai_response: {
      code: `class Codec:\n    def serialize(self, root):\n        vals = []\n        def dfs(node):\n            if not node:\n                vals.append("N")\n                return\n            vals.append(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return ",".join(vals)\n\n    def deserialize(self, data):\n        vals = data.split(",")\n        self.i = 0\n        def dfs():\n            if vals[self.i] == "N":\n                self.i += 1\n                return None\n            node = TreeNode(int(vals[self.i]))\n            self.i += 1\n            node.left = dfs()\n            node.right = dfs()\n            return node\n        return dfs()`,
      stated_explanation: "Preorder DFS encoding with 'N' null sentinels.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n)",
        space: "O(n)",
        reasoning: "Linear scan preorder serialization and pointer reconstruction."
      },
      corrected_code: `class Codec:\n    def serialize(self, root):\n        vals = []\n        def dfs(node):\n            if not node:\n                vals.append("N")\n                return\n            vals.append(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return ",".join(vals)\n    def deserialize(self, data):\n        vals = data.split(",")\n        self.i = 0\n        def dfs():\n            if vals[self.i] == "N":\n                self.i += 1\n                return None\n            node = TreeNode(int(vals[self.i]))\n            self.i += 1\n            node.left = dfs()\n            node.right = dfs()\n            return node\n        return dfs()`,
      model_critique_summary: "Optimal, completely correct preorder tree serialization."
    },
    language_variants: {
      cpp: {
        code: `class Codec:\n    auto serialize(root) {\n        vals = []\n        def dfs(node):\n            if ! node:\n                vals.push_back("N")\n                return\n            vals.push_back(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return ",".join(vals)\n\n    def deserialize(self, data):\n        vals = data.split(",")\n        this->i = 0\n        def dfs():\n            if vals[this->i] == "N":\n                this->i += 1\n                return nullptr\n            node = TreeNode(int(vals[this->i]))\n            this->i += 1\n            node.left = dfs()\n            node.right = dfs()\n            return node\n        return dfs()`,
        corrected_code: `class Codec:\n    auto serialize(root) {\n        vals = []\n        def dfs(node):\n            if ! node:\n                vals.push_back("N")\n                return\n            vals.push_back(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return ",".join(vals)\n    def deserialize(self, data):\n        vals = data.split(",")\n        this->i = 0\n        def dfs():\n            if vals[this->i] == "N":\n                this->i += 1\n                return nullptr\n            node = TreeNode(int(vals[this->i]))\n            this->i += 1\n            node.left = dfs()\n            node.right = dfs()\n            return node\n        return dfs()`,
      },
      javascript: {
        code: `class Codec:\n    var serialize = function(root) {\n        vals = []\n        def dfs(node):\n            if ! node:\n                vals.push("N")\n                return\n            vals.push(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return ",".join(vals)\n\n    def deserialize(self, data):\n        vals = data.split(",")\n        this.i = 0\n        def dfs():\n            if vals[this.i] == "N":\n                this.i += 1\n                return null\n            node = TreeNode(int(vals[this.i]))\n            this.i += 1\n            node.left = dfs()\n            node.right = dfs()\n            return node\n        return dfs()`,
        corrected_code: `class Codec:\n    var serialize = function(root) {\n        vals = []\n        def dfs(node):\n            if ! node:\n                vals.push("N")\n                return\n            vals.push(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return ",".join(vals)\n    def deserialize(self, data):\n        vals = data.split(",")\n        this.i = 0\n        def dfs():\n            if vals[this.i] == "N":\n                this.i += 1\n                return null\n            node = TreeNode(int(vals[this.i]))\n            this.i += 1\n            node.left = dfs()\n            node.right = dfs()\n            return node\n        return dfs()`,
      },
    }
  },

  {
    id: "q_tree_124",
    title: "Binary Tree Maximum Path Sum (LeetCode 124)",
    topic: "trees",
    difficulty: "hard",
    language: "python",
    problem_statement: {
      description: "Return the maximum path sum of any non-empty path in a binary tree.",
      constraints: ["1 <= Node Count <= 3 * 10^4"],
      examples: [
        {
          input: "root = [-10,9,20,null,null,15,7]",
          output: "42"
        }
      ]
    },
    ai_response: {
      code: `def maxPathSum(root):\n    max_sum = float('-inf')\n    def get_gain(node):\n        nonlocal max_sum\n        if not node: return 0\n        # Bug: Unclamped negative gains\n        left_gain = get_gain(node.left)\n        right_gain = get_gain(node.right)\n        price_newpath = node.val + left_gain + right_gain\n        max_sum = max(max_sum, price_newpath)\n        return node.val + max(left_gain, right_gain)\n    get_gain(root)\n    return max_sum`,
      stated_explanation: "Recursively computes branch gain.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_tree_02",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [6],
          description: "Unclamped negative child branch gains decrease total path sum.",
          failing_input_example: "root = [2, -1]",
          why_it_matters: "Negative subtrees should be clamped with max(0, gain)."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "Post-order DFS."
      },
      corrected_code: `def maxPathSum(root):\n    max_sum = float('-inf')\n    def get_gain(node):\n        nonlocal max_sum\n        if not node: return 0\n        left_gain = max(get_gain(node.left), 0)\n        right_gain = max(get_gain(node.right), 0)\n        max_sum = max(max_sum, node.val + left_gain + right_gain)\n        return node.val + max(left_gain, right_gain)\n    get_gain(root)\n    return max_sum`,
      model_critique_summary: "Unclamped negative branch gains."
    },
    language_variants: {
      cpp: {
        code: `auto maxPathSum(root) {\n    max_sum = float('-inf')\n    def get_gain(node):\n        nonlocal max_sum\n        if ! node: return 0\n        // Bug: Unclamped negative gains\n        left_gain = get_gain(node.left)\n        right_gain = get_gain(node.right)\n        price_newpath = node.val + left_gain + right_gain\n        max_sum = max(max_sum, price_newpath)\n        return node.val + max(left_gain, right_gain)\n    get_gain(root)\n    return max_sum`,
        corrected_code: `auto maxPathSum(root) {\n    max_sum = float('-inf')\n    def get_gain(node):\n        nonlocal max_sum\n        if ! node: return 0\n        left_gain = max(get_gain(node.left), 0)\n        right_gain = max(get_gain(node.right), 0)\n        max_sum = max(max_sum, node.val + left_gain + right_gain)\n        return node.val + max(left_gain, right_gain)\n    get_gain(root)\n    return max_sum`,
      },
      javascript: {
        code: `var maxPathSum = function(root) {\n    max_sum = float('-inf')\n    def get_gain(node):\n        nonlocal max_sum\n        if ! node: return 0\n        // Bug: Unclamped negative gains\n        left_gain = get_gain(node.left)\n        right_gain = get_gain(node.right)\n        price_newpath = node.val + left_gain + right_gain\n        max_sum = max(max_sum, price_newpath)\n        return node.val + max(left_gain, right_gain)\n    get_gain(root)\n    return max_sum`,
        corrected_code: `var maxPathSum = function(root) {\n    max_sum = float('-inf')\n    def get_gain(node):\n        nonlocal max_sum\n        if ! node: return 0\n        left_gain = max(get_gain(node.left), 0)\n        right_gain = max(get_gain(node.right), 0)\n        max_sum = max(max_sum, node.val + left_gain + right_gain)\n        return node.val + max(left_gain, right_gain)\n    get_gain(root)\n    return max_sum`,
      },
    }
  },

  {
    id: "q_tree_236",
    title: "Lowest Common Ancestor of a Binary Tree (LeetCode 236)",
    topic: "trees",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Find the lowest common ancestor of two nodes in a binary tree.",
      constraints: ["2 <= Node Count <= 10^5"],
      examples: [
        {
          input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
          output: "3"
        }
      ]
    },
    ai_response: {
      code: `def lowestCommonAncestor(root, p, q):\n    if not root or root == p or root == q:\n        return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left and right: return root\n    return left if left else right`,
      stated_explanation: "Post-order LCA recursion.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "Post-order DFS."
      },
      corrected_code: `def lowestCommonAncestor(root, p, q):\n    if not root or root == p or root == q: return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left and right: return root\n    return left if left else right`,
      model_critique_summary: "Optimal, completely correct recursive LCA."
    },
    language_variants: {
      cpp: {
        code: `auto lowestCommonAncestor(root, p, q) {\n    if ! root || root == p || root == q:\n        return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left && right: return root\n    return left if left else right`,
        corrected_code: `auto lowestCommonAncestor(root, p, q) {\n    if ! root || root == p || root == q: return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left && right: return root\n    return left if left else right`,
      },
      javascript: {
        code: `var lowestCommonAncestor = function(root, p, q) {\n    if ! root || root == p || root == q:\n        return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left && right: return root\n    return left if left else right`,
        corrected_code: `var lowestCommonAncestor = function(root, p, q) {\n    if ! root || root == p || root == q: return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left && right: return root\n    return left if left else right`,
      },
    }
  },

  {
    id: "q_tree_110",
    title: "Balanced Binary Tree (LeetCode 110)",
    topic: "trees",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Determine if a binary tree is height-balanced.",
      constraints: ["0 <= Node Count <= 5000"],
      examples: [
        {
          input: "root = [3,9,20,null,null,15,7]",
          output: "true"
        }
      ]
    },
    ai_response: {
      code: `def isBalanced(root):\n    def get_height(node):\n        if not node: return 0\n        return 1 + max(get_height(node.left), get_height(node.right))\n    if not root: return True\n    # Bug: O(N^2) height recalculation\n    left_h = get_height(root.left)\n    right_h = get_height(root.right)\n    return abs(left_h - right_h) <= 1 and isBalanced(root.left) and isBalanced(root.right)`,
      stated_explanation: "Checks height balance top-down in O(N) time.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(h)"
    },
    ground_truth: {
      verdict: "minor_issue",
      defect_type: "complexity_regression",
      error_categories: ["complexity_regression", "deceptive_explanation"],
      expected_issues: [
        {
          id: "iss_tree_04",
          severity: "major",
          dimension: "complexity",
          line_numbers: [6],
          description: "Top-down O(N^2) height recalculation regression.",
          failing_input_example: "Skewed tree of 5,000 nodes.",
          why_it_matters: "Height should be calculated bottom-up in O(N)."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(h)",
        reasoning: "Bottom-up DFS."
      },
      corrected_code: `def isBalanced(root):\n    def check(node):\n        if not node: return 0\n        l = check(node.left)\n        if l == -1: return -1\n        r = check(node.right)\n        if r == -1: return -1\n        if abs(l - r) > 1: return -1\n        return 1 + max(l, r)\n    return check(root) != -1`,
      model_critique_summary: "Top-down O(N^2) complexity regression."
    },
    language_variants: {
      cpp: {
        code: `auto isBalanced(root) {\n    def get_height(node):\n        if ! node: return 0\n        return 1 + max(get_height(node.left), get_height(node.right))\n    if ! root: return true\n    // Bug: O(N^2) height recalculation\n    left_h = get_height(root.left)\n    right_h = get_height(root.right)\n    return abs(left_h - right_h) <= 1 && isBalanced(root.left) && isBalanced(root.right)`,
        corrected_code: `auto isBalanced(root) {\n    def check(node):\n        if ! node: return 0\n        l = check(node.left)\n        if l == -1: return -1\n        r = check(node.right)\n        if r == -1: return -1\n        if abs(l - r) > 1: return -1\n        return 1 + max(l, r)\n    return check(root) != -1`,
      },
      javascript: {
        code: `var isBalanced = function(root) {\n    def get_height(node):\n        if ! node: return 0\n        return 1 + max(get_height(node.left), get_height(node.right))\n    if ! root: return true\n    // Bug: O(N^2) height recalculation\n    left_h = get_height(root.left)\n    right_h = get_height(root.right)\n    return abs(left_h - right_h) <= 1 && isBalanced(root.left) && isBalanced(root.right)`,
        corrected_code: `var isBalanced = function(root) {\n    def check(node):\n        if ! node: return 0\n        l = check(node.left)\n        if l == -1: return -1\n        r = check(node.right)\n        if r == -1: return -1\n        if abs(l - r) > 1: return -1\n        return 1 + max(l, r)\n    return check(root) != -1`,
      },
    }
  }
];
