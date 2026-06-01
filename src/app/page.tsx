"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { type ReactNode, useCallback, useEffect } from "react";
import { TryDemoButton } from "@/components/demo/TryDemoButton";
import { FreshOnboardingLink } from "@/components/onboarding/FreshOnboardingLink";
import { Button } from "@/components/ui/Button";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils";

/* ─── Scroll reveal wrapper ─────────────────────────────────────── */

function ScrollReveal({
  children,
  className,
  delayClass,
}: {
  children: ReactNode;
  className?: string;
  delayClass?: string;
}) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-on-scroll",
        isInView && "visible",
        delayClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── Hero illustration (pure CSS + SVG) ──────────────────────────── */

function HeroWorkspaceVisual() {
  return (
    <div
      className="relative hidden md:flex items-center justify-center w-full h-full min-h-[420px]"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="panel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EDE8DC" />
          </linearGradient>
        </defs>
      </svg>

      {/* Back panel — kanban column */}
      <div
        className="float-panel float-panel-delay-2 absolute right-[8%] top-[12%] w-[38%] h-[72%] rounded-card border border-border bg-surface shadow-card overflow-hidden"
        style={{ transform: "rotate(4deg)" }}
      >
        <div className="h-10 border-b border-border bg-surface-alt flex items-center gap-2 px-3">
          <span className="h-2 w-2 rounded-full bg-text-muted/40" />
          <span className="h-2 w-2 rounded-full bg-text-muted/40" />
          <span className="h-2 flex-1 rounded bg-border/80 ml-1" />
        </div>
        <div className="p-3 space-y-2">
          <div className="h-14 rounded-[10px] bg-accent-light border border-accent/15" />
          <div className="h-14 rounded-[10px] bg-surface-alt border border-border" />
          <div className="h-14 rounded-[10px] bg-surface-alt border border-border opacity-70" />
        </div>
      </div>

      {/* Middle panel — charter */}
      <div
        className="float-panel float-panel-delay-1 absolute left-[5%] top-[22%] w-[44%] h-[58%] rounded-card border border-border bg-surface shadow-card-hover overflow-hidden z-10"
        style={{ transform: "rotate(-3deg)" }}
      >
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
            Team Charter
          </span>
          <span className="h-2 w-8 rounded-full bg-success/30" />
        </div>
        <div className="p-4 space-y-2.5">
          <div className="h-2 w-full rounded bg-text-primary/10" />
          <div className="h-2 w-[85%] rounded bg-text-primary/8" />
          <div className="h-2 w-[70%] rounded bg-text-primary/6" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-6 rounded-full bg-accent/20 border border-accent/30" />
            <div className="h-6 w-6 rounded-full bg-text-primary/10 border border-border" />
            <div className="h-6 w-6 rounded-full bg-text-primary/10 border border-border" />
          </div>
        </div>
      </div>

      {/* Front accent card */}
      <div
        className="float-panel absolute left-[28%] bottom-[8%] w-[48%] rounded-card border-2 border-accent/25 bg-gradient-to-br from-accent-light to-surface shadow-button z-20 px-4 py-4"
        style={{ transform: "rotate(2deg)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-accent text-white text-[10px] font-mono font-bold">
            ✓
          </span>
          <span className="font-body text-xs font-medium text-text-primary">
            Sprint ready
          </span>
        </div>
        <div className="flex gap-1.5">
          {["Goals", "Roles", "Done"].map((tag, i) => (
            <span
              key={tag}
              className={cn(
                "font-mono text-[9px] px-2 py-0.5 rounded-full border",
                i === 2
                  ? "bg-success/15 text-success border-success/25"
                  : "bg-surface text-text-muted border-border",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative ink-blue shape */}
      <div
        className="float-panel float-panel-delay-3 absolute right-[22%] bottom-[18%] w-16 h-16 rounded-2xl bg-text-primary/90 shadow-card z-[5] flex items-center justify-center"
        style={{ transform: "rotate(-8deg)" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="6" width="8" height="16" rx="2" fill="#F5F0E8" opacity="0.9" />
          <rect x="14" y="10" width="8" height="12" rx="2" fill="#C1440E" opacity="0.85" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Data ──────────────────────────────────────────────────────── */

const TRUST_ITEMS = [
  "15 min setup",
  "Used GRPI framework",
  "No account needed",
] as const;

const TIMELINE_STEPS = [
  {
    number: "01",
    title: "Answer 4 short GRPI questions",
    description:
      "Goals, Roles, Processes, Norms. Four focused screens, about 3 minutes each.",
  },
  {
    number: "02",
    title: "Get your workspace, ready-made",
    description:
      "Auto-generated kanban, team charter, and meeting cadence — all editable.",
  },
  {
    number: "03",
    title: "Pick your tools",
    description:
      "The Tool Coach compares Notion, Trello, and ClickUp honestly, with one-click tutorials.",
  },
  {
    number: "04",
    title: "Actually start working",
    description:
      "Your team has a charter, a board, and a plan. In 15 minutes.",
  },
] as const;

const heroStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ─── Page ──────────────────────────────────────────────────────── */

export default function HomePage() {
  const scrollToHowItWorks = useCallback(() => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToHashId = useCallback((hash: string) => {
    if (!hash) return;
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const timer = setTimeout(() => scrollToHashId(hash), 100);
    return () => clearTimeout(timer);
  }, [scrollToHashId]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) scrollToHashId(hash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [scrollToHashId]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] flex items-center pt-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent-light/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-surface-alt/80 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-6xl w-full px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-center">
            <motion.div
              variants={heroStagger}
              initial="hidden"
              animate="visible"
              className="max-w-xl"
            >
              <motion.p
                variants={heroItem}
                className="font-mono text-xs uppercase tracking-[0.15em] text-accent mb-5"
              >
                For student teams · GRPI-powered
              </motion.p>

              <motion.h1
                variants={heroItem}
                className="font-display text-text-primary text-[2.5rem] leading-[1.1] md:text-[4rem] md:leading-[1.05] mb-6 whitespace-pre-line"
              >
                Stop losing track.{"\n"}Start working together.
              </motion.h1>

              <motion.p
                variants={heroItem}
                className="font-body text-xl text-text-secondary leading-relaxed mb-8 max-w-lg"
              >
                The Digital Collaboration Launchpad guides your team from
                &ldquo;just assigned&rdquo; to &ldquo;actually working&rdquo; in
                under 15 minutes — no setup overwhelm, no abandoned Notion pages.
              </motion.p>

              <motion.div variants={heroItem} className="flex flex-col gap-4 mb-10">
                <div className="flex flex-col sm:flex-row gap-4">
                  <FreshOnboardingLink id="hero-cta" data-demo-target="hero-cta">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started Free
                    </Button>
                  </FreshOnboardingLink>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={scrollToHowItWorks}
                  >
                    See How It Works
                  </Button>
                </div>
                <TryDemoButton />
              </motion.div>

              <motion.ul
                variants={heroItem}
                className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6"
              >
                {TRUST_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-text-secondary font-body"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-success shrink-0"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroWorkspaceVisual />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="section-padding scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent mb-3">
              How It Works
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-text-primary">
              From chaos to clarity in four steps
            </h2>
          </ScrollReveal>

          {/* Desktop timeline */}
          <div className="hidden lg:block">
            <div className="relative grid grid-cols-4 gap-6">
              <div
                className="absolute top-[2.75rem] left-[12.5%] right-[12.5%] h-0.5 bg-accent/80 z-0"
                aria-hidden="true"
              />
              {TIMELINE_STEPS.map((step, i) => (
                <ScrollReveal
                  key={step.number}
                  delayClass={`reveal-delay-${i + 1}`}
                  className="relative z-10"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white font-mono text-sm font-medium shadow-button mb-5 relative z-10">
                      {step.number}
                    </span>
                    <div className="rounded-card border border-border bg-surface p-6 shadow-card h-full text-left w-full hover-lift transition-all duration-200">
                      <h3 className="font-display text-lg text-text-primary mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm text-text-secondary font-body leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Mobile / tablet vertical timeline */}
          <div className="lg:hidden relative">
            <div
              className="absolute left-[1.35rem] top-6 bottom-6 w-0.5 bg-accent/80"
              aria-hidden="true"
            />
            <ol className="space-y-8">
              {TIMELINE_STEPS.map((step, i) => (
                <li key={step.number}>
                  <ScrollReveal delayClass={`reveal-delay-${(i % 3) + 1}`}>
                  <div className="relative flex gap-6 pl-0">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white font-mono text-sm font-medium shadow-button z-10">
                      {step.number}
                    </span>
                    <div className="flex-1 rounded-card border border-border bg-surface p-6 shadow-card">
                      <h3 className="font-display text-lg text-text-primary mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-text-secondary font-body leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  </ScrollReveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────────────── */}
      <section className="bg-text-primary text-background py-24 md:py-28">
        <ScrollReveal className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-background mb-5 leading-tight">
            Your team is waiting.
          </h2>
          <p className="font-body text-lg text-background/75 mb-10 max-w-xl mx-auto leading-relaxed">
            Stop losing Sunday nights to tool setup. Give your team a charter, a
            board, and a plan — before your next meeting starts.
          </p>
          <FreshOnboardingLink>
            <Button
              size="lg"
              className="text-base px-10 h-14 bg-accent hover:bg-accent-hover shadow-button"
            >
              Get Started Free
            </Button>
          </FreshOnboardingLink>
        </ScrollReveal>
      </section>
    </>
  );
}
