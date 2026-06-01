"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { useDemoMode } from "@/lib/demo-mode";
import { useLaunchpad } from "@/lib/store";

type FreshOnboardingLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  children: ReactNode;
};

/** Navigates to onboarding with a clean wizard state (clears demo session + saved progress). */
export function FreshOnboardingLink({
  children,
  onClick,
  ...props
}: FreshOnboardingLinkProps) {
  const { reset } = useLaunchpad();
  const { clearDemoSession } = useDemoMode();

  return (
    <Link
      href="/onboarding"
      {...props}
      onClick={(e) => {
        clearDemoSession();
        reset();
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
