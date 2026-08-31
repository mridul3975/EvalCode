import { QuestionItem } from "@/types/question";

export const LINKED_LIST_QUESTIONS: QuestionItem[] = [
  {
    id: "q_ll_scratch",
    title: "Implement Singly Linked List from Scratch (Python)",
    topic: "linked_lists",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Design a singly linked list class `MyLinkedList` supporting `get(index)`, `addAtHead(val)`, `addAtTail(val)`, `addAtIndex(index, val)`, and `deleteAtIndex(index)`.",
      constraints: ["0 <= index <= 1000", "0 <= val <= 1000", "At most 2000 calls."],
      examples: [
        {
          input: 'addAtHead(1), addAtTail(3), addAtIndex(1, 2), get(1), deleteAtIndex(1), get(1)',
          output: "2, 3"
        }
      ]
    },
    ai_response: {
      code: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\nclass MyLinkedList:\n    def __init__(self):\n        self.head = None\n        self.size = 0\n\n    def get(self, index: int) -> int:\n        if index < 0 or index >= self.size:\n            return -1\n        curr = self.head\n        for _ in range(index):\n            curr = curr.next\n        return curr.val\n\n    def addAtHead(self, val: int) -> None:\n        self.addAtIndex(0, val)\n\n    def addAtTail(self, val: int) -> None:\n        self.addAtIndex(self.size, val)\n\n    def addAtIndex(self, index: int, val: int) -> None:\n        if index > self.size or index < 0:\n            return\n        if index == 0:\n            self.head = ListNode(val, self.head)\n        else:\n            curr = self.head\n            for _ in range(index - 1):\n                curr = curr.next\n            curr.next = ListNode(val, curr.next)\n        self.size += 1\n\n    def deleteAtIndex(self, index: int) -> None:\n        if index < 0 or index >= self.size:\n            return\n        if index == 0:\n            self.head = self.head.next\n        else:\n            curr = self.head\n            for _ in range(index - 1):\n                curr = curr.next\n            # Bug: Does not decrement size on deletion!\n            curr.next = curr.next.next`,
      stated_explanation: "Implements a custom singly linked list with head pointer and size tracker.",
      stated_time_complexity: "get: O(n), addAtHead: O(1), addAtTail/addAtIndex: O(n), deleteAtIndex: O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "minor_issue",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_ll_scratch_01",
          severity: "major",
          dimension: "correctness",
          line_numbers: [43],
          description: "Missing `self.size -= 1` in `deleteAtIndex`: After deleting a node, the size property is not decremented, causing subsequent `get(size - 1)` or bounds checks to access past the end of the list.",
          failing_input_example: "addAtHead(1), deleteAtIndex(0), get(0) -> crashes or returns invalid state",
          why_it_matters: "State synchronization between length trackers and node counts is essential for data structure correctness."
        }
      ],
      optimal_complexity: {
        time: "O(1) head, O(n) index operations",
        space: "O(n)",
        reasoning: "Singly linked list pointer manipulation."
      },
      corrected_code: `class MyLinkedList:\n    def __init__(self):\n        self.head = None\n        self.size = 0\n    def get(self, index: int) -> int:\n        if index < 0 or index >= self.size: return -1\n        curr = self.head\n        for _ in range(index): curr = curr.next\n        return curr.val\n    def addAtHead(self, val: int) -> None:\n        self.addAtIndex(0, val)\n    def addAtTail(self, val: int) -> None:\n        self.addAtIndex(self.size, val)\n    def addAtIndex(self, index: int, val: int) -> None:\n        if index > self.size or index < 0: return\n        if index == 0:\n            self.head = ListNode(val, self.head)\n        else:\n            curr = self.head\n            for _ in range(index - 1): curr = curr.next\n            curr.next = ListNode(val, curr.next)\n        self.size += 1\n    def deleteAtIndex(self, index: int) -> None:\n        if index < 0 or index >= self.size: return\n        if index == 0:\n            self.head = self.head.next\n        else:\n            curr = self.head\n            for _ in range(index - 1): curr = curr.next\n            curr.next = curr.next.next\n        self.size -= 1`,
      model_critique_summary: "Missing self.size -= 1 on deleteAtIndex."
    },
    language_variants: {
      cpp: {
        code: `struct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int v = 0, ListNode *n = nullptr) : val(v), next(n) {}\n};\n\nclass MyLinkedList {\npublic:\n    ListNode *head;\n    int size;\n    MyLinkedList() : head(nullptr), size(0) {}\n\n    int get(int index) {\n        if (index < 0 || index >= size) return -1;\n        ListNode *curr = head;\n        for (int i = 0; i < index; i++) curr = curr->next;\n        return curr->val;\n    }\n\n    void addAtHead(int val) { addAtIndex(0, val); }\n    void addAtTail(int val) { addAtIndex(size, val); }\n\n    void addAtIndex(int index, int val) {\n        if (index > size || index < 0) return;\n        if (index == 0) {\n            head = new ListNode(val, head);\n        } else {\n            ListNode *curr = head;\n            for (int i = 0; i < index - 1; i++) curr = curr->next;\n            curr->next = new ListNode(val, curr->next);\n        }\n        size++;\n    }\n\n    void deleteAtIndex(int index) {\n        if (index < 0 || index >= size) return;\n        if (index == 0) {\n            head = head->next;\n        } else {\n            ListNode *curr = head;\n            for (int i = 0; i < index - 1; i++) curr = curr->next;\n            // Bug: Does not decrement size on deletion!\n            curr->next = curr->next->next;\n        }\n    }\n};`,
        corrected_code: `class MyLinkedList {\npublic:\n    ListNode *head;\n    int size;\n    MyLinkedList() : head(nullptr), size(0) {}\n    int get(int index) {\n        if (index < 0 || index >= size) return -1;\n        ListNode *curr = head;\n        for (int i = 0; i < index; i++) curr = curr->next;\n        return curr->val;\n    }\n    void addAtHead(int val) { addAtIndex(0, val); }\n    void addAtTail(int val) { addAtIndex(size, val); }\n    void addAtIndex(int index, int val) {\n        if (index > size || index < 0) return;\n        if (index == 0) head = new ListNode(val, head);\n        else {\n            ListNode *curr = head;\n            for (int i = 0; i < index - 1; i++) curr = curr->next;\n            curr->next = new ListNode(val, curr->next);\n        }\n        size++;\n    }\n    void deleteAtIndex(int index) {\n        if (index < 0 || index >= size) return;\n        if (index == 0) head = head->next;\n        else {\n            ListNode *curr = head;\n            for (int i = 0; i < index - 1; i++) curr = curr->next;\n            curr->next = curr->next->next;\n        }\n        size--;\n    }\n};`,
      },
      javascript: {
        code: `class ListNode {\n    constructor(val = 0, next = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nclass MyLinkedList {\n    constructor() {\n        this.head = null;\n        this.size = 0;\n    }\n\n    get(index) {\n        if (index < 0 || index >= this.size) return -1;\n        let curr = this.head;\n        for (let i = 0; i < index; i++) curr = curr.next;\n        return curr.val;\n    }\n\n    addAtHead(val) { this.addAtIndex(0, val); }\n    addAtTail(val) { this.addAtIndex(this.size, val); }\n\n    addAtIndex(index, val) {\n        if (index > this.size || index < 0) return;\n        if (index === 0) {\n            this.head = new ListNode(val, this.head);\n        } else {\n            let curr = this.head;\n            for (let i = 0; i < index - 1; i++) curr = curr.next;\n            curr.next = new ListNode(val, curr.next);\n        }\n        this.size++;\n    }\n\n    deleteAtIndex(index) {\n        if (index < 0 || index >= this.size) return;\n        if (index === 0) {\n            this.head = this.head.next;\n        } else {\n            let curr = this.head;\n            for (let i = 0; i < index - 1; i++) curr = curr.next;\n            // Bug: Does not decrement size on deletion!\n            curr.next = curr.next.next;\n        }\n    }\n}`,
        corrected_code: `class MyLinkedList {\n    constructor() {\n        this.head = null;\n        this.size = 0;\n    }\n    get(index) {\n        if (index < 0 || index >= this.size) return -1;\n        let curr = this.head;\n        for (let i = 0; i < index; i++) curr = curr.next;\n        return curr.val;\n    }\n    addAtHead(val) { this.addAtIndex(0, val); }\n    addAtTail(val) { this.addAtIndex(this.size, val); }\n    addAtIndex(index, val) {\n        if (index > this.size || index < 0) return;\n        if (index === 0) this.head = new ListNode(val, this.head);\n        else {\n            let curr = this.head;\n            for (let i = 0; i < index - 1; i++) curr = curr.next;\n            curr.next = new ListNode(val, curr.next);\n        }\n        this.size++;\n    }\n    deleteAtIndex(index) {\n        if (index < 0 || index >= this.size) return;\n        if (index === 0) this.head = this.head.next;\n        else {\n            let curr = this.head;\n            for (let i = 0; i < index - 1; i++) curr = curr.next;\n            curr.next = curr.next.next;\n        }\n        this.size--;\n    }\n}`,
      },
    }
  },
  {
    id: "q_ll_001",
    title: "Reverse Singly Linked List Iterative (LeetCode 206)",
    topic: "linked_lists",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
      constraints: ["0 <= Node Count <= 5000", "-5000 <= Node.val <= 5000"],
      examples: [
        {
          input: "head = [1,2,3,4,5]",
          output: "[5,4,3,2,1]"
        }
      ]
    },
    ai_response: {
      code: `def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        curr.next = prev  # Bug: Lost pointer to next node before saving\n        prev = curr\n        curr = curr.next\n    return prev`,
      stated_explanation: "Reverses pointers iteratively.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "pointer_bug",
      error_categories: ["pointer_bug"],
      expected_issues: [
        {
          id: "iss_ll_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [5],
          description: "Overwrites curr.next before capturing next_node.",
          failing_input_example: "head = [1, 2, 3]",
          why_it_matters: "Mutating pointers without saving forward lookahead links causes infinite loops."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Single pass in-place."
      },
      corrected_code: `def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev`,
      model_critique_summary: "Lost forward pointer reference."
    },
    language_variants: {
      cpp: {
        code: `ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        curr->next = prev;  // Bug: Lost pointer to next node before saving\n        prev = curr;\n        curr = curr->next;\n    }\n    return prev;\n}`,
        corrected_code: `ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* next_node = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next_node;\n    }\n    return prev;\n}`,
      },
      javascript: {
        code: `var reverseList = function(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        curr.next = prev;  // Bug: Lost pointer to next node before saving\n        prev = curr;\n        curr = curr.next;\n    }\n    return prev;\n};`,
        corrected_code: `var reverseList = function(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        let next_node = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next_node;\n    }\n    return prev;\n};`,
      },
    }
  },
  {
    id: "q_ll_rec",
    title: "Reverse Linked List Recursive (LeetCode 206)",
    topic: "linked_lists",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Reverse a singly linked list recursively and return the new head.",
      constraints: ["0 <= Node Count <= 5000"],
      examples: [
        {
          input: "head = [1,2,3]",
          output: "[3,2,1]"
        }
      ]
    },
    ai_response: {
      code: `def reverseList(head):\n    if not head or not head.next:\n        return head\n        \n    new_head = reverseList(head.next)\n    # Bug: head.next is already the tail of the reversed sublist, but head.next.next is assigned without clearing head.next\n    head.next.next = head\n    # Missing: head.next = None\n    return new_head`,
      stated_explanation: "Recursively reverses sublist and reconnects head to the tail.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(n)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "pointer_bug",
      error_categories: ["pointer_bug"],
      expected_issues: [
        {
          id: "iss_ll_rec_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [6],
          description: "Missing `head.next = None`: `head.next.next = head` creates a two-node cycle between the old head and second node. Failing to clear `head.next = None` leaves an infinite cycle in the reversed list.",
          failing_input_example: "head = [1, 2, 3]",
          why_it_matters: "In recursive list reversal, the old head must have its forward next pointer severed to become the new tail pointing to None."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(n)",
        reasoning: "Recursion call stack of depth n."
      },
      corrected_code: `def reverseList(head):\n    if not head or not head.next:\n        return head\n    new_head = reverseList(head.next)\n    head.next.next = head\n    head.next = None\n    return new_head`,
      model_critique_summary: "Missing head.next = None in recursive list reversal causing cycle."
    },
    language_variants: {
      cpp: {
        code: `ListNode* reverseList(ListNode* head) {\n    if (!head || !head->next) return head;\n\n    ListNode* new_head = reverseList(head->next);\n    // Bug: head->next->next = head without clearing head->next\n    head->next->next = head;\n    // Missing: head->next = nullptr;\n    return new_head;\n}`,
        corrected_code: `ListNode* reverseList(ListNode* head) {\n    if (!head || !head->next) return head;\n    ListNode* new_head = reverseList(head->next);\n    head->next->next = head;\n    head->next = nullptr;\n    return new_head;\n}`,
      },
      javascript: {
        code: `var reverseList = function(head) {\n    if (!head || !head.next) return head;\n\n    let new_head = reverseList(head.next);\n    // Bug: head.next.next = head without clearing head.next\n    head.next.next = head;\n    // Missing: head.next = null;\n    return new_head;\n};`,
        corrected_code: `var reverseList = function(head) {\n    if (!head || !head.next) return head;\n    let new_head = reverseList(head.next);\n    head.next.next = head;\n    head.next = null;\n    return new_head;\n};`,
      },
    }
  },
  {
    id: "q_ll_002",
    title: "Middle of the Linked List (LeetCode 876)",
    topic: "linked_lists",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Given the `head` of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node.",
      constraints: ["1 <= Node Count <= 100"],
      examples: [
        {
          input: "head = [1,2,3,4,5,6]",
          output: "[4,5,6]"
        }
      ]
    },
    ai_response: {
      code: `def middleNode(head):\n    slow = head\n    fast = head\n    # Bug: terminates on fast.next.next, missing second middle on even lists\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`,
      stated_explanation: "Uses two pointers slow and fast.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "edge_case_blindness",
      error_categories: ["edge_case_blindness"],
      expected_issues: [
        {
          id: "iss_ll_02",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [4],
          description: "Even-length list off-by-one: Stops on first middle instead of second middle.",
          failing_input_example: "head = [1, 2, 3, 4]",
          why_it_matters: "Must check `while fast and fast.next:`."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Two pointers."
      },
      corrected_code: `def middleNode(head):\n    slow = head\n    fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`,
      model_critique_summary: "Improper loop termination condition on fast pointer."
    },
    language_variants: {
      cpp: {
        code: `ListNode* middleNode(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    // Bug: terminates on fast->next->next, missing second middle on even lists\n    while (fast->next && fast->next->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}`,
        corrected_code: `ListNode* middleNode(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}`,
      },
      javascript: {
        code: `var middleNode = function(head) {\n    let slow = head;\n    let fast = head;\n    // Bug: terminates on fast.next.next, missing second middle on even lists\n    while (fast.next && fast.next.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n};`,
        corrected_code: `var middleNode = function(head) {\n    let slow = head;\n    let fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n};`,
      },
    }
  },
  {
    id: "q_ll_003",
    title: "Linked List Cycle (LeetCode 141)",
    topic: "linked_lists",
    difficulty: "easy",
    language: "cpp",
    problem_statement: {
      description: "Determine if a linked list contains a cycle.",
      constraints: ["0 <= Node Count <= 10^4"],
      examples: [
        {
          input: "head = [3,2,0,-4], pos = 1",
          output: "true"
        }
      ]
    },
    ai_response: {
      code: `bool hasCycle(ListNode *head) {\n    if (!head || !head->next) return false;\n    ListNode *slow = head;\n    ListNode *fast = head; // Bug: compared before advancing\n    while (fast && fast->next) {\n        if (slow == fast) return true;\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return false;\n}`,
      stated_explanation: "Floyd's algorithm comparing slow and fast.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_ll_03",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [6],
          description: "Premature match: `slow == fast` evaluates to true before moving pointers.",
          failing_input_example: "head = [1, 2, 3]",
          why_it_matters: "Pointers must advance before comparison."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Tortoise and hare."
      },
      corrected_code: `bool hasCycle(ListNode *head) {\n    ListNode *slow = head;\n    ListNode *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
      model_critique_summary: "Compared slow == fast before pointer movement."
    },
    language_variants: {
      python: {
        code: `def hasCycle(head):\n    if not head or not head.next:\n        return False\n    slow = head\n    fast = head  # Bug: compared before advancing\n    while fast and fast.next:\n        if slow == fast:\n            return True\n        slow = slow.next\n        fast = fast.next.next\n    return False`,
        corrected_code: `def hasCycle(head):\n    slow = head\n    fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False`,
      },
      javascript: {
        code: `var hasCycle = function(head) {\n    if (!head || !head.next) return false;\n    let slow = head;\n    let fast = head; // Bug: compared before advancing\n    while (fast && fast.next) {\n        if (slow === fast) return true;\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return false;\n};`,
        corrected_code: `var hasCycle = function(head) {\n    let slow = head;\n    let fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow === fast) return true;\n    }\n    return false;\n};`,
      },
    }
  },
  {
    id: "q_ll_083",
    title: "Remove Duplicates from Sorted List (LeetCode 83)",
    topic: "linked_lists",
    difficulty: "easy",
    language: "python",
    problem_statement: {
      description: "Given the `head` of a sorted linked list, delete all duplicates such that each element appears only once. Return the linked list sorted as well.",
      constraints: ["0 <= Node Count <= 300", "-100 <= Node.val <= 100", "List is sorted."],
      examples: [
        {
          input: "head = [1,1,2,3,3]",
          output: "[1,2,3]"
        }
      ]
    },
    ai_response: {
      code: `def deleteDuplicates(head):\n    curr = head\n    while curr and curr.next:\n        if curr.val == curr.next.val:\n            # Bug: advances curr immediately after bypassing duplicate, missing 3+ duplicate runs\n            curr.next = curr.next.next\n            curr = curr.next\n        else:\n            curr = curr.next\n    return head`,
      stated_explanation: "Traverses sorted list and bypasses duplicate adjacent nodes.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_ll_83_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [6],
          description: "Premature pointer advancement on duplicate runs: `curr = curr.next` advances to the next node before checking if the newly linked node also shares the same value (e.g. `[1, 1, 1]`).",
          failing_input_example: "head = [1, 1, 1] -> returns [1, 1]",
          why_it_matters: "When deleting duplicates, `curr` must remain in place until `curr.val != curr.next.val`."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Single linear pass."
      },
      corrected_code: `def deleteDuplicates(head):\n    curr = head\n    while curr and curr.next:\n        if curr.val == curr.next.val:\n            curr.next = curr.next.next\n        else:\n            curr = curr.next\n    return head`,
      model_critique_summary: "Advanced curr pointer inside duplicate deletion branch."
    },
    language_variants: {
      cpp: {
        code: `ListNode* deleteDuplicates(ListNode* head) {\n    ListNode* curr = head;\n    while (curr && curr->next) {\n        if (curr->val == curr->next->val) {\n            // Bug: advances curr immediately after bypassing duplicate\n            curr->next = curr->next->next;\n            curr = curr->next;\n        } else {\n            curr = curr->next;\n        }\n    }\n    return head;\n}`,
        corrected_code: `ListNode* deleteDuplicates(ListNode* head) {\n    ListNode* curr = head;\n    while (curr && curr->next) {\n        if (curr->val == curr->next->val) {\n            curr->next = curr->next->next;\n        } else {\n            curr = curr->next;\n        }\n    }\n    return head;\n}`,
      },
      javascript: {
        code: `var deleteDuplicates = function(head) {\n    let curr = head;\n    while (curr && curr.next) {\n        if (curr.val === curr.next.val) {\n            // Bug: advances curr immediately after bypassing duplicate\n            curr.next = curr.next.next;\n            curr = curr.next;\n        } else {\n            curr = curr.next;\n        }\n    }\n    return head;\n};`,
        corrected_code: `var deleteDuplicates = function(head) {\n    let curr = head;\n    while (curr && curr.next) {\n        if (curr.val === curr.next.val) {\n            curr.next = curr.next.next;\n        } else {\n            curr = curr.next;\n        }\n    }\n    return head;\n};`,
      },
    }
  },
  {
    id: "q_ll_004",
    title: "Remove Duplicates from Sorted List II (LeetCode 82)",
    topic: "linked_lists",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given the `head` of a sorted linked list, delete all nodes that have duplicate numbers, leaving only distinct numbers.",
      constraints: ["0 <= Node Count <= 300"],
      examples: [
        {
          input: "head = [1,2,3,3,4,4,5]",
          output: "[1,2,5]"
        }
      ]
    },
    ai_response: {
      code: `def deleteDuplicates(head):\n    dummy = ListNode(0, head)\n    prev = dummy\n    curr = head\n    while curr:\n        if curr.next and curr.val == curr.next.val:\n            while curr.next and curr.val == curr.next.val:\n                curr = curr.next\n            prev.next = curr.next\n        curr = curr.next\n    return dummy.next`,
      stated_explanation: "Skips duplicate nodes with sentinel dummy.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_ll_04",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [10],
          description: "Missing else branch: `prev` is never updated when `curr` is unique.",
          failing_input_example: "head = [1, 2, 3, 3, 4]",
          why_it_matters: "Prev must only advance on distinct elements."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Single pass."
      },
      corrected_code: `def deleteDuplicates(head):\n    dummy = ListNode(0, head)\n    prev = dummy\n    curr = head\n    while curr:\n        if curr.next and curr.val == curr.next.val:\n            while curr.next and curr.val == curr.next.val:\n                curr = curr.next\n            prev.next = curr.next\n        else:\n            prev = prev.next\n        curr = curr.next\n    return dummy.next`,
      model_critique_summary: "Missing else branch to advance prev."
    },
    language_variants: {
      cpp: {
        code: `ListNode* deleteDuplicates(ListNode* head) {\n    ListNode dummy(0, head);\n    ListNode* prev = &dummy;\n    ListNode* curr = head;\n    while (curr) {\n        if (curr->next && curr->val == curr->next->val) {\n            while (curr->next && curr->val == curr->next->val)\n                curr = curr->next;\n            prev->next = curr->next;\n        }\n        curr = curr->next;\n    }\n    return dummy.next;\n}`,
        corrected_code: `ListNode* deleteDuplicates(ListNode* head) {\n    ListNode dummy(0, head);\n    ListNode* prev = &dummy;\n    ListNode* curr = head;\n    while (curr) {\n        if (curr->next && curr->val == curr->next->val) {\n            while (curr->next && curr->val == curr->next->val)\n                curr = curr->next;\n            prev->next = curr->next;\n        } else {\n            prev = prev->next;\n        }\n        curr = curr->next;\n    }\n    return dummy.next;\n}`,
      },
      javascript: {
        code: `var deleteDuplicates = function(head) {\n    let dummy = new ListNode(0, head);\n    let prev = dummy;\n    let curr = head;\n    while (curr) {\n        if (curr.next && curr.val === curr.next.val) {\n            while (curr.next && curr.val === curr.next.val)\n                curr = curr.next;\n            prev.next = curr.next;\n        }\n        curr = curr.next;\n    }\n    return dummy.next;\n};`,
        corrected_code: `var deleteDuplicates = function(head) {\n    let dummy = new ListNode(0, head);\n    let prev = dummy;\n    let curr = head;\n    while (curr) {\n        if (curr.next && curr.val === curr.next.val) {\n            while (curr.next && curr.val === curr.next.val)\n                curr = curr.next;\n            prev.next = curr.next;\n        } else {\n            prev = prev.next;\n        }\n        curr = curr.next;\n    }\n    return dummy.next;\n};`,
      },
    }
  },
  {
    id: "q_ll_061",
    title: "Rotate List (LeetCode 61)",
    topic: "linked_lists",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given the `head` of a linked list, rotate the list to the right by `k` places.",
      constraints: ["0 <= Node Count <= 500", "-100 <= Node.val <= 100", "0 <= k <= 2 * 10^9"],
      examples: [
        {
          input: "head = [1,2,3,4,5], k = 2",
          output: "[4,5,1,2,3]"
        }
      ]
    },
    ai_response: {
      code: `def rotateRight(head, k):\n    if not head or not head.next or k == 0:\n        return head\n        \n    # Compute length\n    length = 1\n    tail = head\n    while tail.next:\n        tail = tail.next\n        length += 1\n        \n    tail.next = head # make circular\n    k = k % length\n    \n    # Bug: moves k steps instead of length - k steps to find new tail\n    new_tail = head\n    for _ in range(k - 1):\n        new_tail = new_tail.next\n        \n    new_head = new_tail.next\n    new_tail.next = None\n    return new_head`,
      stated_explanation: "Forms a circular list and breaks the circle at the rotated split point.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_ll_61_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [16],
          description: "Inverted rotation offset: Rotating to the right by `k` places requires breaking the cycle at index `length - k`, not `k` (which rotates left).",
          failing_input_example: "head = [1, 2, 3, 4, 5], k = 2 -> returns [2, 3, 4, 5, 1] instead of [4, 5, 1, 2, 3]",
          why_it_matters: "Right rotation shifts the last k nodes to the front, requiring traversal of length - k - 1 steps to locate the new tail."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Single pass to compute length, second pass to split."
      },
      corrected_code: `def rotateRight(head, k):\n    if not head or not head.next or k == 0:\n        return head\n    length, tail = 1, head\n    while tail.next:\n        tail = tail.next\n        length += 1\n    k = k % length\n    if k == 0: return head\n    tail.next = head\n    new_tail = head\n    for _ in range(length - k - 1):\n        new_tail = new_tail.next\n    new_head = new_tail.next\n    new_tail.next = None\n    return new_head`,
      model_critique_summary: "Rotated left by k steps instead of right by length - k."
    },
    language_variants: {
      cpp: {
        code: `ListNode* rotateRight(ListNode* head, int k) {\n    if (!head || !head->next || k == 0) return head;\n    int length = 1;\n    ListNode* tail = head;\n    while (tail->next) { tail = tail->next; length++; }\n    tail->next = head;\n    k = k % length;\n    // Bug: moves k steps instead of length - k steps\n    ListNode* new_tail = head;\n    for (int i = 0; i < k - 1; i++) new_tail = new_tail->next;\n    ListNode* new_head = new_tail->next;\n    new_tail->next = nullptr;\n    return new_head;\n}`,
        corrected_code: `ListNode* rotateRight(ListNode* head, int k) {\n    if (!head || !head->next || k == 0) return head;\n    int length = 1;\n    ListNode* tail = head;\n    while (tail->next) { tail = tail->next; length++; }\n    k = k % length;\n    if (k == 0) return head;\n    tail->next = head;\n    ListNode* new_tail = head;\n    for (int i = 0; i < length - k - 1; i++) new_tail = new_tail->next;\n    ListNode* new_head = new_tail->next;\n    new_tail->next = nullptr;\n    return new_head;\n}`,
      },
      javascript: {
        code: `var rotateRight = function(head, k) {\n    if (!head || !head.next || k === 0) return head;\n    let length = 1;\n    let tail = head;\n    while (tail.next) { tail = tail.next; length++; }\n    tail.next = head;\n    k = k % length;\n    // Bug: moves k steps instead of length - k steps\n    let new_tail = head;\n    for (let i = 0; i < k - 1; i++) new_tail = new_tail.next;\n    let new_head = new_tail.next;\n    new_tail.next = null;\n    return new_head;\n};`,
        corrected_code: `var rotateRight = function(head, k) {\n    if (!head || !head.next || k === 0) return head;\n    let length = 1;\n    let tail = head;\n    while (tail.next) { tail = tail.next; length++; }\n    k = k % length;\n    if (k === 0) return head;\n    tail.next = head;\n    let new_tail = head;\n    for (let i = 0; i < length - k - 1; i++) new_tail = new_tail.next;\n    let new_head = new_tail.next;\n    new_tail.next = null;\n    return new_head;\n};`,
      },
    }
  },
  {
    id: "q_ll_024",
    title: "Swap Nodes in Pairs (LeetCode 24)",
    topic: "linked_lists",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)",
      constraints: ["0 <= Node Count <= 100", "0 <= Node.val <= 100"],
      examples: [
        {
          input: "head = [1,2,3,4]",
          output: "[2,1,4,3]"
        }
      ]
    },
    ai_response: {
      code: `def swapPairs(head):\n    dummy = ListNode(0, head)\n    prev = dummy\n    curr = head\n    \n    while curr and curr.next:\n        first = curr\n        second = curr.next\n        \n        # Swapping\n        prev.next = second\n        first.next = second.next\n        second.next = first\n        \n        # Advancing pointers\n        prev = first\n        curr = first.next\n        \n    return dummy.next`,
      stated_explanation: "Iterates through the list in pairs using a dummy node. Rewires links so second points to first, and advances prev and curr pointers.",
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
        reasoning: "Single pass in-place pointer swapping."
      },
      corrected_code: `def swapPairs(head):\n    dummy = ListNode(0, head)\n    prev = dummy\n    curr = head\n    while curr and curr.next:\n        first = curr\n        second = curr.next\n        prev.next = second\n        first.next = second.next\n        second.next = first\n        prev = first\n        curr = first.next\n    return dummy.next`,
      model_critique_summary: "Optimal, completely correct pairwise node swapping."
    },
    language_variants: {
      cpp: {
        code: `ListNode* swapPairs(ListNode* head) {\n    ListNode dummy(0, head);\n    ListNode* prev = &dummy;\n    ListNode* curr = head;\n    while (curr && curr->next) {\n        ListNode* first = curr;\n        ListNode* second = curr->next;\n        prev->next = second;\n        first->next = second->next;\n        second->next = first;\n        prev = first;\n        curr = first->next;\n    }\n    return dummy.next;\n}`,
        corrected_code: `ListNode* swapPairs(ListNode* head) {\n    ListNode dummy(0, head);\n    ListNode* prev = &dummy;\n    ListNode* curr = head;\n    while (curr && curr->next) {\n        ListNode* first = curr;\n        ListNode* second = curr->next;\n        prev->next = second;\n        first->next = second->next;\n        second->next = first;\n        prev = first;\n        curr = first->next;\n    }\n    return dummy.next;\n}`,
      },
      javascript: {
        code: `var swapPairs = function(head) {\n    let dummy = new ListNode(0, head);\n    let prev = dummy;\n    let curr = head;\n    while (curr && curr.next) {\n        let first = curr;\n        let second = curr.next;\n        prev.next = second;\n        first.next = second.next;\n        second.next = first;\n        prev = first;\n        curr = first.next;\n    }\n    return dummy.next;\n};`,
        corrected_code: `var swapPairs = function(head) {\n    let dummy = new ListNode(0, head);\n    let prev = dummy;\n    let curr = head;\n    while (curr && curr.next) {\n        let first = curr;\n        let second = curr.next;\n        prev.next = second;\n        first.next = second.next;\n        second.next = first;\n        prev = first;\n        curr = first.next;\n    }\n    return dummy.next;\n};`,
      },
    }
  },
  {
    id: "q_ll_086",
    title: "Partition List (LeetCode 86)",
    topic: "linked_lists",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given the `head` of a linked list and a value `x`, partition it such that all nodes less than `x` come before nodes greater than or equal to `x`.\n\nYou should preserve the original relative order of the nodes in each of the two partitions.",
      constraints: ["0 <= Node Count <= 200", "-100 <= Node.val <= 100", "-200 <= x <= 200"],
      examples: [
        {
          input: "head = [1,4,3,2,5,2], x = 3",
          output: "[1,2,2,4,3,5]"
        }
      ]
    },
    ai_response: {
      code: `def partition(head, x):\n    less_head = ListNode(0)\n    greater_head = ListNode(0)\n    less = less_head\n    greater = greater_head\n    \n    while head:\n        if head.val < x:\n            less.next = head\n            less = less.next\n        else:\n            greater.next = head\n            greater = greater.next\n        head = head.next\n        \n    # Bug: Forgot to terminate greater.next = None, creating a cycle!\n    less.next = greater_head.next\n    return less_head.next`,
      stated_explanation: "Maintains two dummy chains: less and greater. Appends nodes respectively and joins less to greater.",
      stated_time_complexity: "O(n)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "pointer_bug",
      error_categories: ["pointer_bug"],
      expected_issues: [
        {
          id: "iss_ll_86_01",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [16],
          description: "Missing cycle termination `greater.next = None`: If the last node in the original list was smaller than `x`, `greater.next` still points to that node, creating an infinite cycle when `less.next` is merged.",
          failing_input_example: "head = [1, 4, 3, 2], x = 3",
          why_it_matters: "Two-chain partitioning requires explicitly severing `greater.next = None` before joining."
        }
      ],
      optimal_complexity: {
        time: "O(n)",
        space: "O(1)",
        reasoning: "Single pass linear partitioning."
      },
      corrected_code: `def partition(head, x):\n    less_head = ListNode(0)\n    greater_head = ListNode(0)\n    less = less_head\n    greater = greater_head\n    while head:\n        if head.val < x:\n            less.next = head\n            less = less.next\n        else:\n            greater.next = head\n            greater = greater.next\n        head = head.next\n    greater.next = None\n    less.next = greater_head.next\n    return less_head.next`,
      model_critique_summary: "Omitted greater.next = None causing cycle."
    },
    language_variants: {
      cpp: {
        code: `ListNode* partition(ListNode* head, int x) {\n    ListNode less_head(0), greater_head(0);\n    ListNode* less = &less_head;\n    ListNode* greater = &greater_head;\n    while (head) {\n        if (head->val < x) {\n            less->next = head;\n            less = less->next;\n        } else {\n            greater->next = head;\n            greater = greater->next;\n        }\n        head = head->next;\n    }\n    // Bug: Forgot to terminate greater->next = nullptr!\n    less->next = greater_head.next;\n    return less_head.next;\n}`,
        corrected_code: `ListNode* partition(ListNode* head, int x) {\n    ListNode less_head(0), greater_head(0);\n    ListNode* less = &less_head;\n    ListNode* greater = &greater_head;\n    while (head) {\n        if (head->val < x) {\n            less->next = head;\n            less = less->next;\n        } else {\n            greater->next = head;\n            greater = greater->next;\n        }\n        head = head->next;\n    }\n    greater->next = nullptr;\n    less->next = greater_head.next;\n    return less_head.next;\n}`,
      },
      javascript: {
        code: `var partition = function(head, x) {\n    let less_head = new ListNode(0);\n    let greater_head = new ListNode(0);\n    let less = less_head;\n    let greater = greater_head;\n    while (head) {\n        if (head.val < x) {\n            less.next = head;\n            less = less.next;\n        } else {\n            greater.next = head;\n            greater = greater.next;\n        }\n        head = head.next;\n    }\n    // Bug: Forgot to terminate greater.next = null!\n    less.next = greater_head.next;\n    return less_head.next;\n};`,
        corrected_code: `var partition = function(head, x) {\n    let less_head = new ListNode(0);\n    let greater_head = new ListNode(0);\n    let less = less_head;\n    let greater = greater_head;\n    while (head) {\n        if (head.val < x) {\n            less.next = head;\n            less = less.next;\n        } else {\n            greater.next = head;\n            greater = greater.next;\n        }\n        head = head.next;\n    }\n    greater.next = null;\n    less.next = greater_head.next;\n    return less_head.next;\n};`,
      },
    }
  },
  {
    id: "q_ll_005",
    title: "Merge k Sorted Lists (LeetCode 23)",
    topic: "linked_lists",
    difficulty: "hard",
    language: "python",
    problem_statement: {
      description: "Merge k sorted linked lists into one sorted linked list.",
      constraints: ["0 <= k <= 10^4", "0 <= length <= 500"],
      examples: [
        {
          input: "lists = [[1,4,5],[1,3,4],[2,6]]",
          output: "[1,1,2,3,4,4,5,6]"
        }
      ]
    },
    ai_response: {
      code: `import heapq\ndef mergeKLists(lists):\n    dummy = ListNode(0)\n    curr = dummy\n    min_heap = []\n    for node in lists:\n        if node:\n            # Bug: TypeError on duplicate node values\n            heapq.heappush(min_heap, (node.val, node))\n    while min_heap:\n        val, node = heapq.heappop(min_heap)\n        curr.next = node\n        curr = curr.next\n        if node.next:\n            heapq.heappush(min_heap, (node.next.val, node.next))\n    return dummy.next`,
      stated_explanation: "Min heap merge.",
      stated_time_complexity: "O(N log k)",
      stated_space_complexity: "O(k)"
    },
    ground_truth: {
      verdict: "major_bug",
      defect_type: "subtle_logic_bug",
      error_categories: ["subtle_logic_bug"],
      expected_issues: [
        {
          id: "iss_ll_05",
          severity: "critical",
          dimension: "correctness",
          line_numbers: [8],
          description: "Python heapq TypeError on duplicate values without tie-breaker.",
          failing_input_example: "lists = [[1, 4], [1, 3]]",
          why_it_matters: "Tuple tie-breaker index is required."
        }
      ],
      optimal_complexity: {
        time: "O(N log k)",
        space: "O(k)",
        reasoning: "Min heap."
      },
      corrected_code: `import heapq\ndef mergeKLists(lists):\n    dummy = ListNode(0)\n    curr = dummy\n    min_heap = []\n    for i, node in enumerate(lists):\n        if node:\n            heapq.heappush(min_heap, (node.val, i, node))\n    while min_heap:\n        val, i, node = heapq.heappop(min_heap)\n        curr.next = node\n        curr = curr.next\n        if node.next:\n            heapq.heappush(min_heap, (node.next.val, i, node.next))\n    return dummy.next`,
      model_critique_summary: "Missing index tie-breaker in heap tuple."
    },
    language_variants: {
      cpp: {
        code: `ListNode* mergeKLists(vector<ListNode*>& lists) {\n    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };\n    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);\n    for (auto node : lists)\n        if (node) pq.push(node);\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    while (!pq.empty()) {\n        ListNode* node = pq.top(); pq.pop();\n        curr->next = node;\n        curr = curr->next;\n        if (node->next) pq.push(node->next);\n    }\n    return dummy.next;\n}`,
        corrected_code: `ListNode* mergeKLists(vector<ListNode*>& lists) {\n    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };\n    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);\n    for (auto node : lists)\n        if (node) pq.push(node);\n    ListNode dummy(0);\n    ListNode* curr = &dummy;\n    while (!pq.empty()) {\n        ListNode* node = pq.top(); pq.pop();\n        curr->next = node;\n        curr = curr->next;\n        if (node->next) pq.push(node->next);\n    }\n    return dummy.next;\n}`,
      },
      javascript: {
        code: `var mergeKLists = function(lists) {\n    let dummy = new ListNode(0);\n    let curr = dummy;\n    let heap = [];\n    for (let node of lists)\n        if (node)\n            // Bug: No tie-breaker when values are equal\n            heap.push([node.val, node]);\n    heap.sort((a, b) => a[0] - b[0]);\n    while (heap.length) {\n        let [val, node] = heap.shift();\n        curr.next = node;\n        curr = curr.next;\n        if (node.next) {\n            heap.push([node.next.val, node.next]);\n            heap.sort((a, b) => a[0] - b[0]);\n        }\n    }\n    return dummy.next;\n};`,
        corrected_code: `var mergeKLists = function(lists) {\n    let dummy = new ListNode(0);\n    let curr = dummy;\n    let heap = [];\n    let idx = 0;\n    for (let node of lists)\n        if (node) heap.push([node.val, idx++, node]);\n    heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);\n    while (heap.length) {\n        let [val, i, node] = heap.shift();\n        curr.next = node;\n        curr = curr.next;\n        if (node.next) {\n            heap.push([node.next.val, i, node.next]);\n            heap.sort((a, b) => a[0] - b[0] || a[1] - b[1]);\n        }\n    }\n    return dummy.next;\n};`,
      },
    }
  },
  {
    id: "q_ll_328",
    title: "Odd Even Linked List (LeetCode 328)",
    topic: "linked_lists",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.",
      constraints: ["0 <= Node Count <= 10^4", "Solve in O(1) extra space complexity and O(n) time."],
      examples: [
        {
          input: "head = [1,2,3,4,5]",
          output: "[1,3,5,2,4]"
        }
      ]
    },
    ai_response: {
      code: `def oddEvenList(head):\n    if not head or not head.next:\n        return head\n        \n    odd = head\n    even = head.next\n    even_head = even\n    \n    while even and even.next:\n        odd.next = even.next\n        odd = odd.next\n        even.next = odd.next\n        even = even.next\n        \n    odd.next = even_head\n    return head`,
      stated_explanation: "Separates odd and even indexed nodes into two chains in O(1) space, then attaches even chain to odd tail.",
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
        reasoning: "Two-pointer odd/even separation in-place."
      },
      corrected_code: `def oddEvenList(head):\n    if not head or not head.next:\n        return head\n    odd = head\n    even = head.next\n    even_head = even\n    while even and even.next:\n        odd.next = even.next\n        odd = odd.next\n        even.next = odd.next\n        even = even.next\n    odd.next = even_head\n    return head`,
      model_critique_summary: "Optimal, completely correct odd-even pointer grouping."
    },
    language_variants: {
      cpp: {
        code: `ListNode* oddEvenList(ListNode* head) {\n    if (!head || !head->next) return head;\n    ListNode* odd = head;\n    ListNode* even = head->next;\n    ListNode* even_head = even;\n    while (even && even->next) {\n        odd->next = even->next;\n        odd = odd->next;\n        even->next = odd->next;\n        even = even->next;\n    }\n    odd->next = even_head;\n    return head;\n}`,
        corrected_code: `ListNode* oddEvenList(ListNode* head) {\n    if (!head || !head->next) return head;\n    ListNode* odd = head;\n    ListNode* even = head->next;\n    ListNode* even_head = even;\n    while (even && even->next) {\n        odd->next = even->next;\n        odd = odd->next;\n        even->next = odd->next;\n        even = even->next;\n    }\n    odd->next = even_head;\n    return head;\n}`,
      },
      javascript: {
        code: `var oddEvenList = function(head) {\n    if (!head || !head.next) return head;\n    let odd = head;\n    let even = head.next;\n    let even_head = even;\n    while (even && even.next) {\n        odd.next = even.next;\n        odd = odd.next;\n        even.next = odd.next;\n        even = even.next;\n    }\n    odd.next = even_head;\n    return head;\n};`,
        corrected_code: `var oddEvenList = function(head) {\n    if (!head || !head.next) return head;\n    let odd = head;\n    let even = head.next;\n    let even_head = even;\n    while (even && even.next) {\n        odd.next = even.next;\n        odd = odd.next;\n        even.next = odd.next;\n        even = even.next;\n    }\n    odd.next = even_head;\n    return head;\n};`,
      },
    }
  },
  {
    id: "q_ll_2130",
    title: "Maximum Twin Sum of a Linked List (LeetCode 2130)",
    topic: "linked_lists",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "In a linked list of size `n` (where `n` is even), the `i-th` node's twin is the `(n-1-i)-th` node. The twin sum is the sum of a node and its twin. Return the maximum twin sum.",
      constraints: ["n is even in range [2, 10^5]", "1 <= Node.val <= 10^5"],
      examples: [
        {
          input: "head = [5,4,2,1]",
          output: "6",
          explanation: "Twin pairs are (5,1)->6, (4,2)->6. Max = 6."
        }
      ]
    },
    ai_response: {
      code: `def pairSum(head):\n    # Find middle\n    slow, fast = head, head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        \n    # Reverse second half\n    prev = None\n    while slow:\n        nxt = slow.next\n        slow.next = prev\n        prev = slow\n        slow = nxt\n        \n    # Compare twin sums\n    max_twin = 0\n    first, second = head, prev\n    while second:\n        max_twin = max(max_twin, first.val + second.val)\n        first = first.next\n        second = second.next\n        \n    return max_twin`,
      stated_explanation: "Finds middle using slow/fast pointers, reverses the second half in-place, and iterates both halves to find maximum twin sum.",
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
        reasoning: "Three linear passes in O(1) auxiliary memory."
      },
      corrected_code: `def pairSum(head):\n    slow, fast = head, head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    prev = None\n    while slow:\n        nxt = slow.next\n        slow.next = prev\n        prev = slow\n        slow = nxt\n    max_twin = 0\n    first, second = head, prev\n    while second:\n        max_twin = max(max_twin, first.val + second.val)\n        first = first.next\n        second = second.next\n    return max_twin`,
      model_critique_summary: "Optimal, completely correct three-stage in-place twin sum evaluation."
    },
    language_variants: {
      cpp: {
        code: `int pairSum(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    ListNode* prev = nullptr;\n    while (slow) {\n        ListNode* nxt = slow->next;\n        slow->next = prev;\n        prev = slow;\n        slow = nxt;\n    }\n    int max_twin = 0;\n    ListNode* first = head;\n    ListNode* second = prev;\n    while (second) {\n        max_twin = max(max_twin, first->val + second->val);\n        first = first->next;\n        second = second->next;\n    }\n    return max_twin;\n}`,
        corrected_code: `int pairSum(ListNode* head) {\n    ListNode* slow = head;\n    ListNode* fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    ListNode* prev = nullptr;\n    while (slow) {\n        ListNode* nxt = slow->next;\n        slow->next = prev;\n        prev = slow;\n        slow = nxt;\n    }\n    int max_twin = 0;\n    ListNode* first = head;\n    ListNode* second = prev;\n    while (second) {\n        max_twin = max(max_twin, first->val + second->val);\n        first = first->next;\n        second = second->next;\n    }\n    return max_twin;\n}`,
      },
      javascript: {
        code: `var pairSum = function(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    let prev = null;\n    while (slow) {\n        let nxt = slow.next;\n        slow.next = prev;\n        prev = slow;\n        slow = nxt;\n    }\n    let max_twin = 0;\n    let first = head, second = prev;\n    while (second) {\n        max_twin = Math.max(max_twin, first.val + second.val);\n        first = first.next;\n        second = second.next;\n    }\n    return max_twin;\n};`,
        corrected_code: `var pairSum = function(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    let prev = null;\n    while (slow) {\n        let nxt = slow.next;\n        slow.next = prev;\n        prev = slow;\n        slow = nxt;\n    }\n    let max_twin = 0;\n    let first = head, second = prev;\n    while (second) {\n        max_twin = Math.max(max_twin, first.val + second.val);\n        first = first.next;\n        second = second.next;\n    }\n    return max_twin;\n};`,
      },
    }
  },
  {
    id: "q_ll_147",
    title: "Insertion Sort List (LeetCode 147)",
    topic: "linked_lists",
    difficulty: "medium",
    language: "python",
    problem_statement: {
      description: "Given the head of a singly linked list, sort the list using insertion sort, and return the sorted list's head.",
      constraints: ["1 <= Node Count <= 5000", "-5000 <= Node.val <= 5000"],
      examples: [
        {
          input: "head = [4,2,1,3]",
          output: "[1,2,3,4]"
        }
      ]
    },
    ai_response: {
      code: `def insertionSortList(head):\n    dummy = ListNode(0)\n    curr = head\n    \n    while curr:\n        prev = dummy\n        next_node = curr.next\n        \n        # Find insertion position in sorted prefix\n        while prev.next and prev.next.val < curr.val:\n            prev = prev.next\n            \n        # Insert curr between prev and prev.next\n        curr.next = prev.next\n        prev.next = curr\n        \n        curr = next_node\n        \n    return dummy.next`,
      stated_explanation: "Maintains a sorted dummy list and inserts each node from the unsorted chain into its correct ascending position.",
      stated_time_complexity: "O(n^2)",
      stated_space_complexity: "O(1)"
    },
    ground_truth: {
      verdict: "correct",
      defect_type: "completely_correct",
      error_categories: ["completely_correct"],
      expected_issues: [],
      optimal_complexity: {
        time: "O(n^2)",
        space: "O(1)",
        reasoning: "Classic in-place linked list insertion sort."
      },
      corrected_code: `def insertionSortList(head):\n    dummy = ListNode(0)\n    curr = head\n    while curr:\n        prev = dummy\n        next_node = curr.next\n        while prev.next and prev.next.val < curr.val:\n            prev = prev.next\n        curr.next = prev.next\n        prev.next = curr\n        curr = next_node\n    return dummy.next`,
      model_critique_summary: "Optimal, completely correct implementation of linked list insertion sort."
    },
    language_variants: {
      cpp: {
        code: `ListNode* insertionSortList(ListNode* head) {\n    ListNode dummy(0);\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* prev = &dummy;\n        ListNode* next_node = curr->next;\n        while (prev->next && prev->next->val < curr->val)\n            prev = prev->next;\n        curr->next = prev->next;\n        prev->next = curr;\n        curr = next_node;\n    }\n    return dummy.next;\n}`,
        corrected_code: `ListNode* insertionSortList(ListNode* head) {\n    ListNode dummy(0);\n    ListNode* curr = head;\n    while (curr) {\n        ListNode* prev = &dummy;\n        ListNode* next_node = curr->next;\n        while (prev->next && prev->next->val < curr->val)\n            prev = prev->next;\n        curr->next = prev->next;\n        prev->next = curr;\n        curr = next_node;\n    }\n    return dummy.next;\n}`,
      },
      javascript: {
        code: `var insertionSortList = function(head) {\n    let dummy = new ListNode(0);\n    let curr = head;\n    while (curr) {\n        let prev = dummy;\n        let next_node = curr.next;\n        while (prev.next && prev.next.val < curr.val)\n            prev = prev.next;\n        curr.next = prev.next;\n        prev.next = curr;\n        curr = next_node;\n    }\n    return dummy.next;\n};`,
        corrected_code: `var insertionSortList = function(head) {\n    let dummy = new ListNode(0);\n    let curr = head;\n    while (curr) {\n        let prev = dummy;\n        let next_node = curr.next;\n        while (prev.next && prev.next.val < curr.val)\n            prev = prev.next;\n        curr.next = prev.next;\n        prev.next = curr;\n        curr = next_node;\n    }\n    return dummy.next;\n};`,
      },
    }
  }
];
