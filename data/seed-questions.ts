import { QuestionItem } from "@/types/question";
import { BACKTRACKING_QUESTIONS } from "./questions/backtracking";
import { STACKS_QUEUES_QUESTIONS } from "./questions/stacks-queues";
import { LINKED_LIST_QUESTIONS } from "./questions/linked-lists";
import { TREE_QUESTIONS } from "./questions/trees";
import { HEAP_QUESTIONS } from "./questions/heaps";
import { GRAPH_QUESTIONS } from "./questions/graphs";
import { INTERVALS_GREEDY_QUESTIONS } from "./questions/intervals-greedy";
import { ARRAYS_STRINGS_QUESTIONS } from "./questions/arrays-strings";
import { DP_QUESTIONS } from "./questions/dp";
import { ADVANCED_GRAPHS_QUESTIONS } from "./questions/advanced-graphs";
import { FRONTIER_DEFECT_QUESTIONS } from "./questions/frontier-defects";

// Master Curated Dataset containing 70+ Calibrated LeetCode & Frontier RLHF Evaluation Problems
export const SEED_QUESTIONS: QuestionItem[] = [
  ...FRONTIER_DEFECT_QUESTIONS,
  ...LINKED_LIST_QUESTIONS,
  ...STACKS_QUEUES_QUESTIONS,
  ...TREE_QUESTIONS,
  ...GRAPH_QUESTIONS,
  ...BACKTRACKING_QUESTIONS,
  ...HEAP_QUESTIONS,
  ...INTERVALS_GREEDY_QUESTIONS,
  ...ARRAYS_STRINGS_QUESTIONS,
  ...DP_QUESTIONS,
  ...ADVANCED_GRAPHS_QUESTIONS,
];

