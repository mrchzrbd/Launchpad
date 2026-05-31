"use client";

import { Button } from "@/components/ui/Button";
import { useDemoMode } from "@/lib/demo-mode";

export function TryDemoButton() {
  const { activateDemo } = useDemoMode();

  return (
    <Button
      variant="ghost"
      size="md"
      type="button"
      className="text-text-secondary hover:text-accent"
      onClick={() => activateDemo()}
    >
      or try it with Team Tschüss&apos;s real setup →
    </Button>
  );
}
