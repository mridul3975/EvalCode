"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/** Viewport-level dialogs must stay outside sticky/filtered ancestors. */
export function Dialog({ children, onClose, label, className, busy = false }: {
  children: ReactNode;
  onClose: () => void;
  label: string;
  className?: string;
  busy?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = panel.current;
    const focusable = () => Array.from(root?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]'
    ) || []).filter(el => el.getClientRects().length > 0);
    (focusable()[0] || root)?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) { event.preventDefault(); close.current(); }
      if (event.key === "Tab") {
        const items = focusable();
        const first = items[0];
        const last = items[items.length - 1];
        if (!first) { event.preventDefault(); root?.focus(); }
        else if (event.shiftKey && (document.activeElement === first || !root?.contains(document.activeElement))) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !root?.contains(document.activeElement))) {
          event.preventDefault(); first.focus();
        }
      }
    }
    function containFocus(event: FocusEvent) {
      if (root && !root.contains(event.target as Node)) (focusable()[0] || root).focus();
    }
    document.addEventListener("keydown", keydown);
    document.addEventListener("focusin", containFocus);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("focusin", containFocus);
      if (previous?.isConnected) previous.focus();
    };
  }, [busy]);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="dialog-backdrop" onMouseDown={event => {
      if (event.target === event.currentTarget && !busy) onClose();
    }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
        className={cn("dialog-panel", className)}>{children}</div>
    </div>, document.body
  );
}
