import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  loading?: boolean;
}

export function Skeleton({ className, name, loading = true, ...props }: SkeletonProps) {
  if (!loading) return null;
  return (
    <div
      data-skeleton={name}
      className={cn(
        "animate-pulse rounded-md bg-zinc-800/60 border border-zinc-700/30",
        className
      )}
      {...props}
    />
  );
}
