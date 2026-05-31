"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { getPresenterNotes } from "@/lib/demo-data";
import { useDemoMode } from "@/lib/demo-mode";

export function PresenterNotesPanel() {
  const pathname = usePathname();
  const { notesOpen, setNotesOpen } = useDemoMode();
  const notes = getPresenterNotes(pathname);

  return (
    <AnimatePresence>
      {notesOpen && (
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 36 }}
          className="fixed right-0 top-0 h-full w-80 max-w-[90vw] z-[90] bg-text-primary/95 backdrop-blur-md text-background shadow-card-hover flex flex-col pointer-events-auto"
          aria-label="Presenter notes"
        >
          <div className="p-5 border-b border-white/10 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-accent uppercase tracking-wider">
                Presenter Notes
              </span>
              <button
                type="button"
                onClick={() => setNotesOpen(false)}
                className="text-white/60 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close presenter notes"
              >
                <X size={20} />
              </button>
            </div>
            <p className="font-mono text-xs text-white/40 mt-1">⌘⇧N to toggle</p>
            <h2 className="font-display text-xl mt-2">{notes.title}</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <ul className="space-y-4">
              {notes.points.map((point, i) => (
                <li key={point} className="flex gap-3">
                  <span className="font-mono text-xs text-accent mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-body text-sm text-white/80 leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 border-t border-white/10 shrink-0">
            <p className="font-body text-xs text-white/30 text-center">
              Team Tschüss · Digital Leadership · June 1st
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
