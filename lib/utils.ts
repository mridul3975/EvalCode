import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeComplexity(str: string): string {
  if (!str) return "O(1)";
  const clean = str.trim().toLowerCase().replace(/\s+/g, "");
  if (clean.includes("nlogn") || clean.includes("n*logn")) return "O(n log n)";
  if (clean.includes("n^2") || clean.includes("n2") || clean.includes("n*n")) return "O(n^2)";
  if (clean.includes("2^n") || clean.includes("2n")) return "O(2^n)";
  if (clean.includes("logn") || clean.includes("log(n)")) return "O(log n)";
  if (clean.includes("o(n)") || clean === "n" || clean.includes("linear")) return "O(n)";
  if (clean.includes("o(1)") || clean === "1" || clean.includes("constant")) return "O(1)";
  return str.trim();
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getReadinessTier(score: number): {
  tier: "Ready" | "Borderline" | "Needs Practice" | "Not Ready";
  color: string;
  badgeClass: string;
  description: string;
} {
  if (score >= 90) {
    return {
      tier: "Ready",
      color: "#10B981",
      badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      description: "Meets or exceeds high-tier evaluation thresholds. Strong probability of passing technical screens.",
    };
  }
  if (score >= 80) {
    return {
      tier: "Borderline",
      color: "#F59E0B",
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      description: "Strong code reading; needs polish on subtle edge-case identification and explanation auditing.",
    };
  }
  if (score >= 70) {
    return {
      tier: "Needs Practice",
      color: "#F97316",
      badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      description: "Moderate gaps: frequent misses on explanation discrepancies or asymptotic complexity bounds.",
    };
  }
  return {
    tier: "Not Ready",
    color: "#EF4444",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    description: "High rate of false positives/negatives in correctness detection and root-cause localization.",
  };
}
