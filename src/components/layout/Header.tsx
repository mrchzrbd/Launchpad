"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FreshOnboardingLink } from "@/components/onboarding/FreshOnboardingLink";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "How It Works", hash: "how-it-works" },
  { label: "Tools", href: "/tool-coach" },
] as const;

function scrollToHash(hash: string) {
  const el = document.getElementById(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = useCallback(
    (hash: string) => {
      setMobileOpen(false);
      if (isHome) {
        scrollToHash(hash);
      } else {
        router.push(`/#${hash}`);
      }
    },
    [isHome, router],
  );

  return (
    <header
      className={cn(
        "app-header transition-all duration-300 ease-out",
        "bg-background/90 backdrop-blur-md border-b border-border",
        scrolled && "shadow-[0_1px_0_rgba(26,26,46,0.04)]",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Launchpad home"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-accent shadow-button"
            aria-hidden="true"
          />
          <span className="font-display text-xl text-text-primary transition-colors duration-200 group-hover:text-accent">
            Launchpad
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) =>
            "hash" in item ? (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.hash)}
                className="text-sm font-body text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out bg-transparent border-0 cursor-pointer p-0"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-body text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden md:block">
          <FreshOnboardingLink>
            <Button size="md">Get Started</Button>
          </FreshOnboardingLink>
        </div>

        <button
          type="button"
          className="md:hidden flex min-h-[44px] min-w-[44px] items-center justify-center rounded-button text-text-primary hover:bg-surface-alt transition-colors duration-200"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="md:hidden nav-drawer-enter border-t border-border bg-background/95 backdrop-blur-[12px]"
        >
          <nav className="flex flex-col px-6 py-4 gap-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) =>
              "hash" in item ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.hash)}
                  className="text-left py-3 text-base font-body text-text-primary border-b border-border/60 last:border-0 bg-transparent border-x-0 border-t-0 cursor-pointer w-full"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="py-3 text-base font-body text-text-primary border-b border-border/60 last:border-0"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
            <FreshOnboardingLink className="mt-4" onClick={() => setMobileOpen(false)}>
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </FreshOnboardingLink>
          </nav>
        </div>
      )}
    </header>
  );
}
