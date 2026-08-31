import { QuestionItem } from "@/types/question";

export const STACKS_QUEUES_QUESTIONS: QuestionItem[] = [
  {
    id: "q_stk_001",
    title: "Implement Stack using Array (Python / C++)",
    topic: "stacks_queues",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Implement a LIFO stack using a fixed-size or dynamic array from scratch supporting `push`, `pop`, `peek`, `is_empty`, and `size`.",
      constraints: ["Operations must operate in O(1) amortized time.", "Pop or peek on empty stack should raise IndexError or return None."],
      examples: [
        {
          input: "push(10), push(20), pop(), peek()",
          output: "20, 10"
        }
      ]
    },
    ai_response: {
      code: `class ArrayStack:\n    def __init__(self, capacity=100):\n        self.capacity = capacity\n        self.arr = [None] * capacity\n        self.top = 0 # Bug: points to next available slot, but pop accesses self.top directly without decrementing first\n        \n    def push(self, x):\n        if self.top >= self.capacity:\n            raise OverflowError("Stack Full")\n        self.arr[self.top] = x\n        self.top += 1\n        \n    def pop(self):\n        if self.is_empty():\n            raise IndexError("Stack Empty")\n        val = self.arr[self.top] # Bug: reading uninitialized / out of bounds slot\n        self.top -= 1\n        return val\n        \n    def peek(self):\n        return self.arr[self.top - 1] if not self.is_empty() else None\n        \n    def is_empty(self):\n        return self.top == 0`,
      stated_explanation: "Implements stack with fixed array and top pointer. All push/pop operations run in O(1) time.",
      stated_time_complexity: "O(1) all ops",
      stated_space_complexity: "O(capacity)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_stk_arr_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [14],
          description: "Top pointer off-by-one in pop(): `self.top` points to the next free slot; reading `self.arr[self.top]` reads `None` (or raises IndexError if full) instead of decrementing first `self.top -= 1; return self.arr[self.top]`.",
          failing_input_example: "stack.push(5); stack.pop() -> returns None instead of 5",
          why_it_matters: "Top index off-by-one errors in custom stack implementations cause invalid data reads on every pop operation."
        }
      ],
      optimal_complexity: {
        time: "O(1) for all ops",
        space: "O(capacity)",
        reasoning: "Constant time array slot indexing."
      },
      corrected_code: `class ArrayStack:\n    def __init__(self, capacity=100):\n        self.capacity = capacity\n        self.arr = [None] * capacity\n        self.top = 0\n        \n    def push(self, x):\n        if self.top >= self.capacity:\n            raise OverflowError("Stack Full")\n        self.arr[self.top] = x\n        self.top += 1\n        \n    def pop(self):\n        if self.is_empty():\n            raise IndexError("Stack Empty")\n        self.top -= 1\n        return self.arr[self.top]\n        \n    def peek(self):\n        return self.arr[self.top - 1] if not self.is_empty() else None\n        \n    def is_empty(self):\n        return self.top == 0`,
      model_critique_summary: "Accessed self.arr[self.top] before decrementing top in array stack pop."
    },
    language_variants: {
      cpp: {
        code: `class ArrayStack:\n    auto __init__(capacity=100) {\n        this->capacity = capacity\n        this->arr = [nullptr] * capacity\n        this->top = 0 // Bug: points to next available slot, but pop accesses this->top directly without decrementing first\n        \n    def push(self, x):\n        if this->top >= this->capacity:\n            raise OverflowError("Stack Full")\n        this->arr[this->top] = x\n        this->top += 1\n        \n    def pop(self):\n        if this->is_empty():\n            raise IndexError("Stack Empty")\n        val = this->arr[this->top] # Bug: reading uninitialized / out of bounds slot\n        this->top -= 1\n        return val\n        \n    def peek(self):\n        return this->arr[this->top - 1] if ! this->is_empty() else nullptr\n        \n    def is_empty(self):\n        return this->top == 0`,
        corrected_code: `class ArrayStack:\n    auto __init__(capacity=100) {\n        this->capacity = capacity\n        this->arr = [nullptr] * capacity\n        this->top = 0\n        \n    def push(self, x):\n        if this->top >= this->capacity:\n            raise OverflowError("Stack Full")\n        this->arr[this->top] = x\n        this->top += 1\n        \n    def pop(self):\n        if this->is_empty():\n            raise IndexError("Stack Empty")\n        this->top -= 1\n        return this->arr[this->top]\n        \n    def peek(self):\n        return this->arr[this->top - 1] if ! this->is_empty() else nullptr\n        \n    def is_empty(self):\n        return this->top == 0`,
      },
      javascript: {
        code: `class ArrayStack:\n    var __init__ = function(capacity=100) {\n        this.capacity = capacity\n        this.arr = [null] * capacity\n        this.top = 0 // Bug: points to next available slot, but pop accesses this.top directly without decrementing first\n        \n    def push(self, x):\n        if this.top >= this.capacity:\n            raise OverflowError("Stack Full")\n        this.arr[this.top] = x\n        this.top += 1\n        \n    def pop(self):\n        if this.is_empty():\n            raise IndexError("Stack Empty")\n        val = this.arr[this.top] # Bug: reading uninitialized / out of bounds slot\n        this.top -= 1\n        return val\n        \n    def peek(self):\n        return this.arr[this.top - 1] if ! this.is_empty() else null\n        \n    def is_empty(self):\n        return this.top == 0`,
        corrected_code: `class ArrayStack:\n    var __init__ = function(capacity=100) {\n        this.capacity = capacity\n        this.arr = [null] * capacity\n        this.top = 0\n        \n    def push(self, x):\n        if this.top >= this.capacity:\n            raise OverflowError("Stack Full")\n        this.arr[this.top] = x\n        this.top += 1\n        \n    def pop(self):\n        if this.is_empty():\n            raise IndexError("Stack Empty")\n        this.top -= 1\n        return this.arr[this.top]\n        \n    def peek(self):\n        return this.arr[this.top - 1] if ! this.is_empty() else null\n        \n    def is_empty(self):\n        return this.top == 0`,
      },
    }
  },

  {
    id: "q_stk_002",
    title: "Implement Stack using Linked List (C++)",
    topic: "stacks_queues",
    difficulty: "easy",
    language: "cpp",
    problem_statement: {
      description: "Implement a LIFO Stack using a singly linked list supporting push, pop, top, and isEmpty with zero memory leaks.",
      constraints: ["All operations must be O(1) time.", "Deallocate popped nodes to avoid memory leaks."],
      examples: [
        {
          input: "push(1), push(2), pop()",
          output: "2"
        }
      ]
    },
    ai_response: {
      code: `struct Node {\n    int val;\n    Node* next;\n    Node(int x) : val(x), next(nullptr) {}\n};\n\nclass LinkedListStack {\nprivate:\n    Node* head;\npublic:\n    LinkedListStack() : head(nullptr) {}\n    \n    void push(int x) {\n        Node* newNode = new Node(x);\n        newNode->next = head;\n        head = newNode;\n    }\n    \n    int pop() {\n        if (!head) throw std::runtime_error("Empty Stack");\n        int val = head->val;\n        head = head->next; // Bug: Memory leak, fails to delete old head node!\n        return val;\n    }\n    \n    int top() {\n        if (!head) throw std::runtime_error("Empty Stack");\n        return head->val;\n    }\n    \n    bool isEmpty() {\n        return head == nullptr;\n    }\n};`,
      stated_explanation: "Inserts and removes nodes from the front of a linked list in O(1) time.",
      stated_time_complexity: "O(1) all ops",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "minor_issue",
      defect_type: "pointer_bug",
      error_categories: ["pointer_bug"],
      expected_issues: [
        {
          id: "iss_stk_ll_01",
          severity: "major",
          dimension: "correctness",
          line_numbers: [19],
          description: "C++ Memory Leak in pop(): Reassigns `head = head->next` without calling `delete temp` on the orphaned node, leaking heap memory on every pop operation.",
          failing_input_example: "Repeated pushes and pops leak heap memory indefinitely.",
          why_it_matters: "In manual memory management languages like C++, unreferenced heap nodes cause severe memory fragmentation and leaks."
        }
      ],
      optimal_complexity: {
        time: "O(1) all ops",
        space: "O(n)",
        reasoning: "Pointer manipulation at the head of list."
      },
      corrected_code: `int pop() {\n    if (!head) throw std::runtime_error("Empty Stack");\n    Node* temp = head;\n    int val = head->val;\n    head = head->next;\n    delete temp;\n    return val;\n`,
      model_critique_summary: "Memory leak on popped linked list nodes in C++ stack."
    },
    language_variants: {
      cpp: {
        code: `struct Node {\n    int val;\n    Node* next;\n    Node(int x) : val(x), next(nullptr) {}\n};\n\nclass LinkedListStack {\nprivate:\n    Node* head;\npublic:\n    LinkedListStack() : head(nullptr) {}\n    \n    void push(int x) {\n        Node* newNode = new Node(x);\n        newNode->next = head;\n        head = newNode;\n    }\n    \n    int pop_back() {\n        if (!head) throw std::runtime_error("Empty Stack");\n        int val = head->val;\n        head = head->next; // Bug: Memory leak, fails to delete old head node!\n        return val;\n    }\n    \n    int top() {\n        if (!head) throw std::runtime_error("Empty Stack");\n        return head->val;\n    }\n    \n    bool isEmpty() {\n        return head == nullptr;\n    }\n};`,
        corrected_code: `int pop_back() {\n    if (!head) throw std::runtime_error("Empty Stack");\n    Node* temp = head;\n    int val = head->val;\n    head = head->next;\n    delete temp;\n    return val;\n`,
      },
      javascript: {
        code: `struct Node {\n    int val;\n    Node* next;\n    Node(int x) : val(x), next(nullptr) {}\n};\n\nclass LinkedListStack {\nprivate:\n    Node* head;\npublic:\n    LinkedListStack() : head(nullptr) {}\n    \n    void push(int x) {\n        Node* newNode = new Node(x);\n        newNode->next = head;\n        head = newNode;\n    }\n    \n    int pop() {\n        if (!head) throw std::runtime_error("Empty Stack");\n        int val = head->val;\n        head = head->next; // Bug: Memory leak, fails to delete old head node!\n        return val;\n    }\n    \n    int top() {\n        if (!head) throw std::runtime_error("Empty Stack");\n        return head->val;\n    }\n    \n    bool isEmpty() {\n        return head == nullptr;\n    }\n};`,
        corrected_code: `int pop() {\n    if (!head) throw std::runtime_error("Empty Stack");\n    Node* temp = head;\n    int val = head->val;\n    head = head->next;\n    delete temp;\n    return val;\n`,
      },
    }
  },

  {
    id: "q_stk_003",
    title: "Valid Parentheses (LeetCode 20)",
    topic: "stacks_queues",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Given a string `s` containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      constraints: ["1 <= s.length <= 10^4"],
      examples: [
        {
          input: 's = "()[]{}"',
          output: "true"
        },
        {
          input: 's = "]"',
          output: "false"
        }
      ]
    },
    ai_response: {
      code: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() # Bug: Does not check if stack is empty before popping\n            if top != mapping[char]:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0`,
      stated_explanation: "Pushes opening brackets and pops matching closing brackets.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "edge_case_blindness",
      error_categories: ["edge_case_blindness"],
      expected_issues: [
        {
          id: "iss_stk_01",
          severity: "critical",
          dimension: "edge_case",
          line_numbers: [6],
          description: "IndexError on empty stack: When `s` begins with a closing bracket, `stack.pop()` raises `IndexError: pop from empty list`.",
          failing_input_example: 's = "]"',
          why_it_matters: "Popping an empty stack without checking `if not stack` causes runtime crashes."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(n)",
        reasoning: "Linear scan."
      },
      corrected_code: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["\n    for char in s:\n        if char in mapping:\n            if not stack or stack.pop() != mapping[char]:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0`,
      model_critique_summary: "Empty stack pop crash on leading closing brackets."
    },
    language_variants: {
      cpp: {
        code: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop_back() // Bug: Does ! check if stack is empty before popping\n            if top != mapping[char]:\n                return false\n        else:\n            stack.push_back(char)\n    return stack.size() == 0`,
        corrected_code: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["\n    for char in s:\n        if char in mapping:\n            if ! stack || stack.pop_back() != mapping[char]:\n                return false\n        else:\n            stack.push_back(char)\n    return stack.size() == 0`,
      },
      javascript: {
        code: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() // Bug: Does ! check if stack is empty before popping\n            if top != mapping[char]:\n                return false\n        else:\n            stack.push(char)\n    return stack.length == 0`,
        corrected_code: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["\n    for char in s:\n        if char in mapping:\n            if ! stack || stack.pop() != mapping[char]:\n                return false\n        else:\n            stack.push(char)\n    return stack.length == 0`,
      },
    }
  },

  {
    id: "q_stk_004",
    title: "Min Stack (LeetCode 155)",
    topic: "stacks_queues",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).",
      constraints: ["All operations must be O(1).", "At most 3 * 10^4 calls."],
      examples: [
        {
          input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()',
          output: "-3, 0, -2"
        }
      ]
    },
    ai_response: {
      code: `class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_val = float('inf')\n\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        if val < self.min_val:\n            self.min_val = val\n\n    def pop(self) -> None:\n        popped = self.stack.pop()\n        # Bug: linear scan on pop destroys O(1) requirement\n        if popped == self.min_val:\n            self.min_val = min(self.stack) if self.stack else float('inf')\n\n    def top(self) -> int:\n        return self.stack[-1]\n\n    def getMin(self) -> int:\n        return self.min_val`,
      stated_explanation: "Maintains a single array and recalculates min_val on pop in O(1) time.",
      stated_time_complexity: "O(1) all ops",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "minor_issue",
      defect_type: "complexity_regression",
      error_categories: ["complexity_regression", "deceptive_explanation"],
      expected_issues: [
        {
          id: "iss_stk_02",
          severity: "major",
          dimension: "complexity",
          line_numbers: [14],
          description: "Complexity regression: `min(self.stack)` runs in O(N) time on pop(), violating O(1) bounds.",
          failing_input_example: "30,000 pushes followed by 30,000 pops causes quadratic time.",
          why_it_matters: "Calling min() on a list is an O(N) scan."
        }
      ],
      optimal_complexity: {
        time: "O(1) all ops",
        space: "O(n)",
        reasoning: "Store paired tuples (val, current_min)."
      },
      corrected_code: `class MinStack:\n    def __init__(self):\n        self.stack = []\n    def push(self, val: int) -> None:\n        current_min = val if not self.stack else min(val, self.stack[-1][1])\n        self.stack.append((val, current_min))\n    def pop(self) -> None:\n        self.stack.pop()\n    def top(self) -> int:\n        return self.stack[-1][0]\n    def getMin(self) -> int:\n        return self.stack[-1][1]`,
      model_critique_summary: "Linear scan on pop() in MinStack."
    },
    language_variants: {
      cpp: {
        code: `class MinStack:\n    auto __init__() {\n        this->stack = []\n        this->min_val = float('inf')\n\n    def push(self, val: int) -> nullptr:\n        this->stack.push_back(val)\n        if val < this->min_val:\n            this->min_val = val\n\n    def pop(self) -> nullptr:\n        popped = this->stack.pop_back()\n        // Bug: linear scan on pop destroys O(1) requirement\n        if popped == this->min_val:\n            this->min_val = min(this->stack) if this->stack else float('inf')\n\n    def top(self) -> int:\n        return this->stack[-1]\n\n    def getMin(self) -> int:\n        return this->min_val`,
        corrected_code: `class MinStack:\n    auto __init__() {\n        this->stack = []\n    def push(self, val: int) -> nullptr:\n        current_min = val if ! this->stack else min(val, this->stack[-1][1])\n        this->stack.push_back((val, current_min))\n    def pop(self) -> nullptr:\n        this->stack.pop_back()\n    def top(self) -> int:\n        return this->stack[-1][0]\n    def getMin(self) -> int:\n        return this->stack[-1][1]`,
      },
      javascript: {
        code: `class MinStack:\n    var __init__ = function() {\n        this.stack = []\n        this.min_val = float('inf')\n\n    def push(self, val: int) -> null:\n        this.stack.push(val)\n        if val < this.min_val:\n            this.min_val = val\n\n    def pop(self) -> null:\n        popped = this.stack.pop()\n        // Bug: linear scan on pop destroys O(1) requirement\n        if popped == this.min_val:\n            this.min_val = min(this.stack) if this.stack else float('inf')\n\n    def top(self) -> int:\n        return this.stack[-1]\n\n    def getMin(self) -> int:\n        return this.min_val`,
        corrected_code: `class MinStack:\n    var __init__ = function() {\n        this.stack = []\n    def push(self, val: int) -> null:\n        current_min = val if ! this.stack else min(val, this.stack[-1][1])\n        this.stack.push((val, current_min))\n    def pop(self) -> null:\n        this.stack.pop()\n    def top(self) -> int:\n        return this.stack[-1][0]\n    def getMin(self) -> int:\n        return this.stack[-1][1]`,
      },
    }
  },

  {
    id: "q_stk_005",
    title: "Evaluate Reverse Polish Notation (LeetCode 150)",
    topic: "stacks_queues",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Evaluate the value of an arithmetic expression in Reverse Polish Notation (RPN). Valid operators are '+', '-', '*', and '/'. Division between two integers should truncate toward zero.",
      constraints: ["1 <= tokens.length <= 10^4", "tokens[i] is either an operator or an integer in the range [-200, 200]."],
      examples: [
        {
          input: 'tokens = ["4","13","5","/","+"]',
          output: "6",
          explanation: "(4 + (13 / 5)) = 6"
        },
        {
          input: 'tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]',
          output: "22"
        }
      ]
    },
    ai_response: {
      code: `def evalRPN(tokens):\n    stack = []\n    for t in tokens:\n        if t == "+":\n            stack.append(stack.pop() + stack.pop())\n        elif t == "-":\n            # Bug: Inverted operand order in subtraction\n            stack.append(stack.pop() - stack.pop())\n        elif t == "*":\n            stack.append(stack.pop() * stack.pop())\n        elif t == "/":\n            # Bug: Inverted operand order in division\n            stack.append(int(stack.pop() / stack.pop()))\n        else:\n            stack.append(int(t))\n    return stack[0]`,
      stated_explanation: "Pushes operands and pops two elements when an operator is encountered.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_stk_rpn_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [7, 11],
          description: "Inverted operand order on non-commutative operators: `stack.pop() - stack.pop()` computes `b - a` instead of `a - b` (where `a` was pushed before `b`). Same bug occurs on division `b / a`.",
          failing_input_example: 'tokens = ["4", "2", "-"] (computes 2 - 4 = -2 instead of 4 - 2 = 2)',
          why_it_matters: "Subtraction and division are non-commutative; the first popped element is the right-hand operand."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(n)",
        reasoning: "Single pass token evaluation."
      },
      corrected_code: `def evalRPN(tokens):\n    stack = []\n    for t in tokens:\n        if t in "+-*/":\n            b = stack.pop()\n            a = stack.pop()\n            if t == "+": stack.append(a + b)\n            elif t == "-": stack.append(a - b)\n            elif t == "*": stack.append(a * b)\n            elif t == "/": stack.append(int(a / b))\n        else:\n            stack.append(int(t))\n    return stack[0]`,
      model_critique_summary: "Inverted operand order for subtraction and division in RPN stack evaluation."
    },
    language_variants: {
      cpp: {
        code: `auto evalRPN(tokens) {\n    stack = []\n    for t in tokens:\n        if t == "+":\n            stack.push_back(stack.pop_back() + stack.pop_back())\n        elif t == "-":\n            // Bug: Inverted operand order in subtraction\n            stack.push_back(stack.pop_back() - stack.pop_back())\n        elif t == "*":\n            stack.push_back(stack.pop_back() * stack.pop_back())\n        elif t == "/":\n            # Bug: Inverted operand order in division\n            stack.push_back(int(stack.pop_back() / stack.pop_back()))\n        else:\n            stack.push_back(int(t))\n    return stack[0]`,
        corrected_code: `auto evalRPN(tokens) {\n    stack = []\n    for t in tokens:\n        if t in "+-*/":\n            b = stack.pop_back()\n            a = stack.pop_back()\n            if t == "+": stack.push_back(a + b)\n            elif t == "-": stack.push_back(a - b)\n            elif t == "*": stack.push_back(a * b)\n            elif t == "/": stack.push_back(int(a / b))\n        else:\n            stack.push_back(int(t))\n    return stack[0]`,
      },
      javascript: {
        code: `var evalRPN = function(tokens) {\n    stack = []\n    for t in tokens:\n        if t == "+":\n            stack.push(stack.pop() + stack.pop())\n        elif t == "-":\n            // Bug: Inverted operand order in subtraction\n            stack.push(stack.pop() - stack.pop())\n        elif t == "*":\n            stack.push(stack.pop() * stack.pop())\n        elif t == "/":\n            # Bug: Inverted operand order in division\n            stack.push(int(stack.pop() / stack.pop()))\n        else:\n            stack.push(int(t))\n    return stack[0]`,
        corrected_code: `var evalRPN = function(tokens) {\n    stack = []\n    for t in tokens:\n        if t in "+-*/":\n            b = stack.pop()\n            a = stack.pop()\n            if t == "+": stack.push(a + b)\n            elif t == "-": stack.push(a - b)\n            elif t == "*": stack.push(a * b)\n            elif t == "/": stack.push(int(a / b))\n        else:\n            stack.push(int(t))\n    return stack[0]`,
      },
    }
  },

  {
    id: "q_stk_006",
    title: "Next Greater Element I (LeetCode 496)",
    topic: "stacks_queues",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "The next greater element of some element `x` in an array is the first greater element that is to the right of `x` in the same array.\n\nGiven two distinct arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`, return an array `ans` of length `nums1.length` such that `ans[i]` is the next greater element as described above.",
      constraints: ["1 <= nums1.length <= nums2.length <= 1000", "0 <= nums1[i], nums2[i] <= 10^4", "All integers in nums1 and nums2 are unique."],
      examples: [
        {
          input: "nums1 = [4,1,2], nums2 = [1,3,4,2]",
          output: "[-1,3,-1]"
        }
      ]
    },
    ai_response: {
      code: `def nextGreaterElement(nums1, nums2):\n    next_greater = {}\n    stack = []\n    \n    for n in nums2:\n        while stack and n > stack[-1]:\n            next_greater[stack.pop()] = n\n        stack.append(n)\n        \n    return [next_greater.get(n, -1) for n in nums1]`,
      stated_explanation: "Uses a monotonic decreasing stack over nums2 to record the next greater element in a hash map. Then queries the map for each element in nums1.",
      stated_time_complexity: "O(nums1.length + nums2.length)",
      stated_space_complexity: "O(nums2.length)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(nums1.length + nums2.length)",
        space: "O(nums2.length)",
        reasoning: "Each element in nums2 is pushed and popped at most once."
      },
      corrected_code: `def nextGreaterElement(nums1, nums2):\n    next_greater = {\n    stack = []\n    for n in nums2:\n        while stack and n > stack[-1]:\n            next_greater[stack.pop()] = n\n        stack.append(n)\n    return [next_greater.get(n, -1) for n in nums1]`,
      model_critique_summary: "Optimal, completely correct monotonic stack implementation."
    },
    language_variants: {
      cpp: {
        code: `auto nextGreaterElement(nums1, nums2) {\n    next_greater = {}\n    stack = []\n    \n    for n in nums2:\n        while stack && n > stack[-1]:\n            next_greater[stack.pop_back()] = n\n        stack.push_back(n)\n        \n    return [next_greater.get(n, -1) for n in nums1]`,
        corrected_code: `auto nextGreaterElement(nums1, nums2) {\n    next_greater = {\n    stack = []\n    for n in nums2:\n        while stack && n > stack[-1]:\n            next_greater[stack.pop_back()] = n\n        stack.push_back(n)\n    return [next_greater.get(n, -1) for n in nums1]`,
      },
      javascript: {
        code: `var nextGreaterElement = function(nums1, nums2) {\n    next_greater = {}\n    stack = []\n    \n    for n in nums2:\n        while stack && n > stack[-1]:\n            next_greater[stack.pop()] = n\n        stack.push(n)\n        \n    return [next_greater.get(n, -1) for n in nums1]`,
        corrected_code: `var nextGreaterElement = function(nums1, nums2) {\n    next_greater = {\n    stack = []\n    for n in nums2:\n        while stack && n > stack[-1]:\n            next_greater[stack.pop()] = n\n        stack.push(n)\n    return [next_greater.get(n, -1) for n in nums1]`,
      },
    }
  },

  {
    id: "q_stk_007",
    title: "Next Greater Element II — Circular (LeetCode 503)",
    topic: "stacks_queues",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given a circular integer array `nums` (i.e., the next element of `nums[nums.length - 1]` is `nums[0]`), return the next greater number for every element in `nums`.",
      constraints: ["1 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
      examples: [
        {
          input: "nums = [1,2,1]",
          output: "[2,-1,2]"
        }
      ]
    },
    ai_response: {
      code: `def nextGreaterElements(nums):\n    n = len(nums)\n    res = [-1] * n\n    stack = [] # store indices\n    \n    # Circular traversal: simulate 2n length array\n    for i in range(2 * n):\n        # Bug: pushes i directly to stack instead of modulo i % n\n        while stack and nums[i % n] > nums[stack[-1]]:\n            idx = stack.pop()\n            res[idx] = nums[i % n]\n        stack.append(i)\n        \n    return res`,
      stated_explanation: "Simulates circular array by looping up to 2n. Pops indices when finding a greater element.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_stk_503_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [11],
          description: "IndexError on circular index stack push: Pushes raw index `i` (which reaches up to `2n - 1`) instead of `i % n`. `nums[stack[-1]]` raises `IndexError: list index out of range` on the second pass when `i >= n`.",
          failing_input_example: "nums = [1, 2, 1]",
          why_it_matters: "Indices stored on the monotonic stack in circular arrays must be kept within [0, n - 1]."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(n)",
        reasoning: "Two linear passes with monotonic stack."
      },
      corrected_code: `def nextGreaterElements(nums):\n    n = len(nums)\n    res = [-1] * n\n    stack = []\n    for i in range(2 * n):\n        num = nums[i % n]\n        while stack and num > nums[stack[-1]]:\n            res[stack.pop()] = num\n        if i < n:\n            stack.append(i)\n    return res`,
      model_critique_summary: "Pushed un-moduloed index i >= n to stack causing IndexError."
    },
    language_variants: {
      cpp: {
        code: `auto nextGreaterElements(nums) {\n    n = nums.size()\n    res = [-1] * n\n    stack = [] // store indices\n    \n    # Circular traversal: simulate 2n length array\n    for i in range(2 * n):\n        # Bug: pushes i directly to stack instead of modulo i % n\n        while stack && nums[i % n] > nums[stack[-1]]:\n            idx = stack.pop_back()\n            res[idx] = nums[i % n]\n        stack.push_back(i)\n        \n    return res`,
        corrected_code: `auto nextGreaterElements(nums) {\n    n = nums.size()\n    res = [-1] * n\n    stack = []\n    for i in range(2 * n):\n        num = nums[i % n]\n        while stack && num > nums[stack[-1]]:\n            res[stack.pop_back()] = num\n        if i < n:\n            stack.push_back(i)\n    return res`,
      },
      javascript: {
        code: `var nextGreaterElements = function(nums) {\n    n = nums.length\n    res = [-1] * n\n    stack = [] // store indices\n    \n    # Circular traversal: simulate 2n length array\n    for i in range(2 * n):\n        # Bug: pushes i directly to stack instead of modulo i % n\n        while stack && nums[i % n] > nums[stack[-1]]:\n            idx = stack.pop()\n            res[idx] = nums[i % n]\n        stack.push(i)\n        \n    return res`,
        corrected_code: `var nextGreaterElements = function(nums) {\n    n = nums.length\n    res = [-1] * n\n    stack = []\n    for i in range(2 * n):\n        num = nums[i % n]\n        while stack && num > nums[stack[-1]]:\n            res[stack.pop()] = num\n        if i < n:\n            stack.push(i)\n    return res`,
      },
    }
  },

  {
    id: "q_stk_008",
    title: "Daily Temperatures (LeetCode 739)",
    topic: "stacks_queues",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature.",
      constraints: ["1 <= temperatures.length <= 10^5"],
      examples: [
        {
          input: "temperatures = [73,74,75,71,69,72,76,73]",
          output: "[1,1,4,2,1,1,0,0]"
        }
      ]
    },
    ai_response: {
      code: `def dailyTemperatures(temperatures):\n    n = len(temperatures)\n    res = [0] * n\n    stack = []\n    for i in range(n):\n        # Bug: using >= instead of > causes equal temp days to resolve prematurely\n        while stack and temperatures[i] >= temperatures[stack[-1]]:\n            prev_idx = stack.pop()\n            res[prev_idx] = i - prev_idx\n        stack.append(i)\n    return res`,
      stated_explanation: "Uses monotonic decreasing stack.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_stk_03",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [6],
          description: "Strict inequality violation: Condition `temperatures[i] >= temperatures[stack[-1]]` treats equal temperatures as strictly warmer.",
          failing_input_example: "temperatures = [70, 70, 75]",
          why_it_matters: "Problem requires strictly warmer day."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(n)",
        reasoning: "Single pass monotonic stack."
      },
      corrected_code: `def dailyTemperatures(temperatures):\n    n = len(temperatures)\n    res = [0] * n\n    stack = []\n    for i in range(n):\n        while stack and temperatures[i] > temperatures[stack[-1]]:\n            prev_idx = stack.pop()\n            res[prev_idx] = i - prev_idx\n        stack.append(i)\n    return res`,
      model_critique_summary: "Used >= instead of > in monotonic stack."
    },
    language_variants: {
      cpp: {
        code: `auto dailyTemperatures(temperatures) {\n    n = temperatures.size()\n    res = [0] * n\n    stack = []\n    for i in range(n):\n        // Bug: using >= instead of > causes equal temp days to resolve prematurely\n        while stack && temperatures[i] >= temperatures[stack[-1]]:\n            prev_idx = stack.pop_back()\n            res[prev_idx] = i - prev_idx\n        stack.push_back(i)\n    return res`,
        corrected_code: `auto dailyTemperatures(temperatures) {\n    n = temperatures.size()\n    res = [0] * n\n    stack = []\n    for i in range(n):\n        while stack && temperatures[i] > temperatures[stack[-1]]:\n            prev_idx = stack.pop_back()\n            res[prev_idx] = i - prev_idx\n        stack.push_back(i)\n    return res`,
      },
      javascript: {
        code: `var dailyTemperatures = function(temperatures) {\n    n = temperatures.length\n    res = [0] * n\n    stack = []\n    for i in range(n):\n        // Bug: using >= instead of > causes equal temp days to resolve prematurely\n        while stack && temperatures[i] >= temperatures[stack[-1]]:\n            prev_idx = stack.pop()\n            res[prev_idx] = i - prev_idx\n        stack.push(i)\n    return res`,
        corrected_code: `var dailyTemperatures = function(temperatures) {\n    n = temperatures.length\n    res = [0] * n\n    stack = []\n    for i in range(n):\n        while stack && temperatures[i] > temperatures[stack[-1]]:\n            prev_idx = stack.pop()\n            res[prev_idx] = i - prev_idx\n        stack.push(i)\n    return res`,
      },
    }
  },

  {
    id: "q_stk_009",
    title: "Previous Smaller Element",
    topic: "stacks_queues",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given an array of integers `A`, find the nearest smaller element `G[i]` for every element `A[i]` such that the element has an index smaller than `i`. If none exists, output `-1`.",
      constraints: ["1 <= A.length <= 10^5", "1 <= A[i] <= 10^9"],
      examples: [
        {
          input: "A = [4, 5, 2, 10, 8]",
          output: "[-1, 4, -1, 2, 2]"
        }
      ]
    },
    ai_response: {
      code: `def prevSmaller(A):\n    res = []\n    stack = [] # monotonic increasing stack\n    \n    for x in A:\n        while stack and stack[-1] >= x:\n            stack.pop()\n        if stack:\n            res.append(stack[-1])\n        else:\n            res.append(-1)\n        stack.append(x)\n        \n    return res`,
      stated_explanation: "Uses a monotonic increasing stack. Pops elements >= x so stack[-1] is the nearest smaller element to the left.",
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
        reasoning: "Each element is pushed and popped at most once."
      },
      corrected_code: `def prevSmaller(A):\n    res = []\n    stack = []\n    for x in A:\n        while stack and stack[-1] >= x:\n            stack.pop()\n        res.append(stack[-1] if stack else -1)\n        stack.append(x)\n    return res`,
      model_critique_summary: "Optimal, completely correct monotonic increasing stack."
    },
    language_variants: {
      cpp: {
        code: `auto prevSmaller(A) {\n    res = []\n    stack = [] // monotonic increasing stack\n    \n    for x in A:\n        while stack && stack[-1] >= x:\n            stack.pop_back()\n        if stack:\n            res.push_back(stack[-1])\n        else:\n            res.push_back(-1)\n        stack.push_back(x)\n        \n    return res`,
        corrected_code: `auto prevSmaller(A) {\n    res = []\n    stack = []\n    for x in A:\n        while stack && stack[-1] >= x:\n            stack.pop_back()\n        res.push_back(stack[-1] if stack else -1)\n        stack.push_back(x)\n    return res`,
      },
      javascript: {
        code: `var prevSmaller = function(A) {\n    res = []\n    stack = [] // monotonic increasing stack\n    \n    for x in A:\n        while stack && stack[-1] >= x:\n            stack.pop()\n        if stack:\n            res.push(stack[-1])\n        else:\n            res.push(-1)\n        stack.push(x)\n        \n    return res`,
        corrected_code: `var prevSmaller = function(A) {\n    res = []\n    stack = []\n    for x in A:\n        while stack && stack[-1] >= x:\n            stack.pop()\n        res.push(stack[-1] if stack else -1)\n        stack.push(x)\n    return res`,
      },
    }
  },

  {
    id: "q_stk_010",
    title: "Largest Rectangle in Histogram (LeetCode 84)",
    topic: "stacks_queues",
    difficulty: "hard",
    language: "python",
    problem_statement: {
      description: "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
      constraints: ["1 <= heights.length <= 10^5"],
      examples: [
        {
          input: "heights = [2,1,5,6,2,3]",
          output: "10"
        }
      ]
    },
    ai_response: {
      code: `def largestRectangleArea(heights):\n    max_area = 0\n    stack = []\n    for i, h in enumerate(heights):\n        start = i\n        while stack and stack[-1][1] > h:\n            index, height = stack.pop()\n            max_area = max(max_area, height * (i - index))\n            start = index\n        stack.append((start, h))\n    # Bug: ignores remaining elements in stack after loop finishes\n    return max_area`,
      stated_explanation: "Monotonic increasing stack.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "edge_case_blindness",
      error_categories: ["edge_case_blindness"],
      expected_issues: [
        {
          id: "iss_stk_04",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [11],
          description: "Missing remaining stack flush: Fails to process bars remaining on stack after loop.",
          failing_input_example: "heights = [1, 2, 3, 4]",
          why_it_matters: "All monotonic stack histogram algorithms must drain remaining elements."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(n)",
        reasoning: "Linear scan."
      },
      corrected_code: `def largestRectangleArea(heights):\n    max_area = 0\n    stack = []\n    for i, h in enumerate(heights):\n        start = i\n        while stack and stack[-1][1] > h:\n            index, height = stack.pop()\n            max_area = max(max_area, height * (i - index))\n            start = index\n        stack.append((start, h))\n    for index, height in stack:\n        max_area = max(max_area, height * (len(heights) - index))\n    return max_area`,
      model_critique_summary: "Omitted post-loop stack drain."
    },
    language_variants: {
      cpp: {
        code: `auto largestRectangleArea(heights) {\n    max_area = 0\n    stack = []\n    for i, h in enumerate(heights):\n        start = i\n        while stack && stack[-1][1] > h:\n            index, height = stack.pop_back()\n            max_area = max(max_area, height * (i - index))\n            start = index\n        stack.push_back((start, h))\n    // Bug: ignores remaining elements in stack after loop finishes\n    return max_area`,
        corrected_code: `auto largestRectangleArea(heights) {\n    max_area = 0\n    stack = []\n    for i, h in enumerate(heights):\n        start = i\n        while stack && stack[-1][1] > h:\n            index, height = stack.pop_back()\n            max_area = max(max_area, height * (i - index))\n            start = index\n        stack.push_back((start, h))\n    for index, height in stack:\n        max_area = max(max_area, height * (heights.size() - index))\n    return max_area`,
      },
      javascript: {
        code: `var largestRectangleArea = function(heights) {\n    max_area = 0\n    stack = []\n    for i, h in enumerate(heights):\n        start = i\n        while stack && stack[-1][1] > h:\n            index, height = stack.pop()\n            max_area = max(max_area, height * (i - index))\n            start = index\n        stack.push((start, h))\n    // Bug: ignores remaining elements in stack after loop finishes\n    return max_area`,
        corrected_code: `var largestRectangleArea = function(heights) {\n    max_area = 0\n    stack = []\n    for i, h in enumerate(heights):\n        start = i\n        while stack && stack[-1][1] > h:\n            index, height = stack.pop()\n            max_area = max(max_area, height * (i - index))\n            start = index\n        stack.push((start, h))\n    for index, height in stack:\n        max_area = max(max_area, height * (heights.length - index))\n    return max_area`,
      },
    }
  }
];
