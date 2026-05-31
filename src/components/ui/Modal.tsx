"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const trapRef = useFocusTrap(open, onClose);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="fixed inset-0 z-[80] bg-text-primary/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[81] flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
            <motion.div
              ref={trapRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              className={cn(
                "pointer-events-auto w-full md:max-w-md",
                "bg-surface shadow-card-hover border border-border",
                "rounded-t-card md:rounded-card",
                "max-h-[90dvh] overflow-y-auto",
                className,
              )}
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 36 }}
            >
              <div className="flex items-center justify-between gap-4 p-6 border-b border-border sticky top-0 bg-surface z-10">
                <h2
                  id="modal-title"
                  className="font-display text-xl text-text-primary"
                >
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-11 w-11 items-center justify-center rounded-button text-text-muted hover:bg-surface-alt hover:text-text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
