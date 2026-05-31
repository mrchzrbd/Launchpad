"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface UseInViewOptions extends IntersectionObserverInit {
  /** Unobserve after first intersection (default: true) */
  once?: boolean;
}

export interface UseInViewReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  isInView: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
): UseInViewReturn<T> {
  const { once = true, threshold = 0.12, rootMargin = "0px 0px -48px 0px", ...rest } =
    options;

  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin, ...rest },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return { ref, isInView };
}
