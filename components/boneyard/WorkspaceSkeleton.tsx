import React from "react";
import { Skeleton } from "./Skeleton";

export function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header bar skeleton */}
      <div className="h-14 border-b border-zinc-800/80 bg-zinc-900/50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      {/* 2-Column Split Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 max-w-[1700px] w-full mx-auto">
        {/* Left Pane (Code & Problem Context) */}
        <div className="flex flex-col gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 min-h-[400px]">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Right Pane (Evaluation Form) */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 flex flex-col gap-5">
          <div className="flex gap-2 pb-2 border-b border-zinc-800">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
          <div className="mt-auto pt-4 flex justify-end">
            <Skeleton className="h-10 w-44" />
          </div>
        </div>
      </div>
    </div>
  );
}
